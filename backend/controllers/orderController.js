import Order from '../models/Orders.js';
import Product from '../models/Product.js';

const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing } = req.body;

    // Validate input
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer data and items are required'
      });
    }

    // Validate customer data
    if (!customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer data is not complete (name, email, phone are required)'
      });
    }

    // Get userID from auth middleware (assume user is authenticated)
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      console.error('❌ User not authenticated in createOrder:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User is not authenticated'
      });
    }
    
    console.log('✅ Authenticated user ID:', userId);

    // Validate and get product details for orderItems
    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} not found`
        });
      }

      // Check stock if available
      if (product.stock !== undefined && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock ${product.name} is not enough. Stock available: ${product.stock}`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images && product.images[0] ? product.images[0] : '',
        productPrice: product.price,
        size: item.size || null,
        quantity: item.quantity,
        itemTotal: itemTotal
      });
    }

    // Validasi pricing jika dikirim dari frontend
    if (pricing) {
      if (Math.abs(pricing.subtotal - calculatedSubtotal) > 0.01) {
        return res.status(400).json({
          success: false,
          message: 'Subtotal tidak sesuai dengan perhitungan server'
        });
      }
    }

    // Buat order baru
    const newOrder = new Order({
      userId: userId,
      customer: {
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
        npm: customer.npm || ''
      },
      orderItems: orderItems,
      pricing: {
        subtotal: calculatedSubtotal,
        total: calculatedSubtotal
      },
      status: 'pending_confirmation',
      paymentStatus: 'pending'
    });

    // Simpan order
    const savedOrder = await newOrder.save();

    // Populate product details
    await savedOrder.populate('orderItems.productId');

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat',
      order: savedOrder
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data tidak valid',
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params; // Menggunakan 'id' sesuai dengan route /:id

    console.log('🔍 Getting order with ID:', orderId);

    const order = await Order.findById(orderId)
      .populate('orderItems.productId')
      .exec();

    if (!order) {
      console.log('❌ Order not found:', orderId);
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }
    res.status(200).json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Get orders by customer email
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ 'customer.email': email.toLowerCase() })
      .populate('orderItems.productId')
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments({ 'customer.email': email.toLowerCase() });

    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('❌ Error fetching orders by email:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })

    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      });
    }

    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    console.error('❌ Error fetching my orders:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      paymentStatus,
      search,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('orderItems.productId')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(filter);

    // Statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      }
    ]);

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      orders: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      },
      statistics: {
        overview: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
        statusBreakdown: statusCounts
      }
    });

  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update order status - Admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { status, adminNotes, updatedBy = 'admin' } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    // Validasi status
    const validStatuses = ['pending_confirmation', 'confirmed', 'picked_up', 'cancelled', 'expired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    // Update menggunakan method custom
    await order.updateStatus(status, updatedBy, adminNotes);

    // Update admin notes jika ada
    if (adminNotes) {
      order.adminNotes = adminNotes;
      await order.save();
    }

    await order.populate('orderItems.productId');

    res.status(200).json({
      success: true,
      message: 'Status pesanan berhasil diperbarui',
      order: order
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Update payment status - Admin only
const updatePaymentStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    // Validasi payment status
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status pembayaran tidak valid'
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }

    await order.save();
    await order.populate('orderItems.productId');

    res.status(200).json({
      success: true,
      message: 'Status pembayaran berhasil diperbarui',
      order: order
    });

  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { reason, cancelledBy = 'customer' } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    // Cek apakah order bisa dibatalkan
    if (order.status === 'picked_up') {
      return res.status(400).json({
        success: false,
        message: 'Pesanan yang sudah diambil tidak dapat dibatalkan'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Pesanan sudah dibatalkan sebelumnya'
      });
    }

    await order.updateStatus('cancelled', cancelledBy, reason || 'Dibatalkan');

    await order.populate('orderItems.productId');

    res.status(200).json({
      success: true,
      message: 'Pesanan berhasil dibatalkan',
      order: order
    });

  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Delete order (admin only)
const deleteOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pesanan tidak ditemukan'
      });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({
      success: true,
      message: 'Pesanan berhasil dihapus'
    });

  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Upload payment proof
const uploadPaymentProof = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    
    // Cek apakah file terupload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('📁 File uploaded:', req.file);

    // Cari order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order dengan payment proof
    order.paymentProof = {
      imageUrl: req.file.path, // URL dari Cloudinary
      cloudinaryId: req.file.filename, // ID untuk hapus file nanti
      uploadedAt: new Date()
    };
    
    // Update payment status menjadi 'paid' (menunggu konfirmasi admin)
    order.paymentStatus = 'paid';
    
    await order.save();

    console.log('✅ Payment proof uploaded successfully:', {
      orderId: order._id,
      imageUrl: order.paymentProof.imageUrl
    });

    res.status(200).json({
      success: true,
      message: 'Payment proof uploaded successfully',
      order: order,
      paymentProof: order.paymentProof
    });

  } catch (error) {
    console.error('❌ Error uploading payment proof:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload payment proof',
      error: error.message
    });
  }
};

export {
  createOrder,
  getOrder,
  getMyOrders,
  getOrdersByEmail,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  uploadPaymentProof,
  cancelOrder,
  deleteOrder
};