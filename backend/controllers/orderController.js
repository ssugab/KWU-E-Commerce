import Order from '../models/Orders.js';
import Product from '../models/Product.js';

// Helper function untuk response
const sendResponse = (res, status, success, message, data = null) => {
  res.status(status).json({ success, message, ...data });
};

// Helper function untuk error handling
const handleError = (res, error, defaultMessage = 'Server error') => {
  console.error('❌', error);
  const message = error.response?.data?.message || error.message || defaultMessage;
  sendResponse(res, 500, false, message);
};

// Create Order - Simplified
const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing } = req.body;
    const userId = req.user?.userId || req.user?.id;

    // Simple validation
    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length || !userId) {
      return sendResponse(res, 400, false, 'Data is not complete');
    }

    // Process order items
    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return sendResponse(res, 400, false, `Product ${item.productId} tidak ditemukan`);
      }

      // Check stock if available
      if (product.stock !== undefined && product.stock < item.quantity) {
        return sendResponse(res, 400, false, `Stock ${product.name} is not enough. Stock available: ${product.stock}`);
      }
      
      const itemTotal = product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        productPrice: product.price,
        size: item.size || null,
        quantity: item.quantity,
        itemTotal
      });
    }

    // Create order
    const newOrder = await Order.create({
      userId,
      customer: {
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
        npm: customer.npm || ''
      },
      orderItems,
      pricing: {
        subtotal: calculatedSubtotal,
        total: calculatedSubtotal
      },
      status: 'pending_confirmation',
      paymentStatus: 'pending',
      notifications: {
        newOrderNotified: false,
        readyPickupSent: false,
        readyPickupDate: null
      }
    });

    await newOrder.populate('orderItems.productId');
    sendResponse(res, 201, true, 'Pesanan berhasil dibuat', { order: newOrder });

  } catch (error) {
    handleError(res, error, 'Gagal membuat pesanan');
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.productId');
    if (!order) return sendResponse(res, 404, false, 'Pesanan tidak ditemukan');
    
    sendResponse(res, 200, true, 'Success', { order });
  } catch (error) {
    handleError(res, error, 'Gagal mengambil pesanan');
  }
};

// Get Orders by Email - Simplified
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ 'customer.email': email.toLowerCase() })
      .populate('orderItems.productId')
      .sort({ orderDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ 'customer.email': email.toLowerCase() });

    sendResponse(res, 200, true, 'Success', {
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    handleError(res, error, 'Gagal mengambil pesanan');
  }
};

// Get My Orders - Simplified
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    if (!orders) return sendResponse(res, 404, false, 'Order not found');
    sendResponse(res, 200, true, 'Success', { orders });
  } catch (error) {
    handleError(res, error, 'Gagal mengambil pesanan');
  }
};

// Get All Orders - Simplified
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
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    sendResponse(res, 200, true, 'Success', {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    handleError(res, error, 'Failed to get all orders');
  }
};

// Update order status - Admin only
const updateOrderStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { status, adminNotes } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');

    const validStatuses = ['pending_confirmation', 'confirmed', 'ready_pickup', 'picked_up', 'cancelled', 'expired'];
    if (!validStatuses.includes(status)) {
      return sendResponse(res, 400, false, 'Invalid status');
    }

    await order.updateStatus(status, 'admin', adminNotes);
    if (adminNotes) {
      order.adminNotes = adminNotes;
      await order.save();
    }

    await order.populate('orderItems.productId');
    sendResponse(res, 200, true, 'Status updated successfully', { order });
  } catch (error) {
    handleError(res, error, 'Failed to update status');
  }
};

// Update payment status - Admin only
const updatePaymentStatus = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');

    order.paymentStatus = paymentStatus;
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }

    await order.save();
    await order.populate('orderItems.productId');
    
    sendResponse(res, 200, true, 'Payment status updated successfully', { order });
  } catch (error) {
    handleError(res, error, 'Failed to update payment status');
  }
};

// Upload Payment Proof - Simplified
const uploadPaymentProof = async (req, res) => {
  try {
    if (!req.file) return sendResponse(res, 400, false, 'File not found');

    const order = await Order.findById(req.params.id);
    if (!order) return sendResponse(res, 404, false, 'Order not found');

    order.paymentProof = {
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      uploadedAt: new Date()
    };
    order.paymentStatus = 'paid';
    
    await order.save();
    sendResponse(res, 200, true, 'Payment proof uploaded successfully', { order });
  } catch (error) {
    handleError(res, error, 'Failed to upload payment proof');
  }
};

// Cancel Order - Simplified
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    if (order.status === 'picked_up') return sendResponse(res, 400, false, 'Order already picked up');
    if (order.status === 'cancelled') return sendResponse(res, 400, false, 'Order already cancelled');

    await order.updateStatus('cancelled', 'customer', reason || 'Dibatalkan');
    await order.populate('orderItems.productId');
    
    sendResponse(res, 200, true, 'Order cancelled successfully', { order });
  } catch (error) {
    handleError(res, error, 'Failed to cancel order');
  }
};

// Delete Order - Simplified
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    
    sendResponse(res, 200, true, 'Order deleted successfully');
  } catch (error) {
    handleError(res, error, 'Failed to delete order');
  }
};

// Mark order as ready for pickup - Admin only
const markReadyPickup = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { adminNotes = '' } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    if (order.status !== 'confirmed') return sendResponse(res, 400, false, 'Order must be confirmed first');

    await order.updateStatus('ready_pickup', 'admin', adminNotes || 'Order ready for pickup');
    if (adminNotes) {
      order.adminNotes = adminNotes;
      await order.save();
    }

    await order.populate('orderItems.productId');
    sendResponse(res, 200, true, 'Order ready for pickup', { order });
  } catch (error) {
    handleError(res, error, 'Failed to mark order as ready for pickup');
  }
};

// Get orders that need admin notification (new orders)
const getNewOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({
      'notifications.newOrderNotified': false,
      status: 'pending_confirmation'
    });
    sendResponse(res, 200, true, 'Success', { count });
  } catch (error) {
    handleError(res, error, 'Failed to get new orders count');
  }
};

// Mark new orders as notified
const markNewOrdersNotified = async (req, res) => {
  try {
    await Order.updateMany(
      { 'notifications.newOrderNotified': false },
      { 'notifications.newOrderNotified': true }
    );
    sendResponse(res, 200, true, 'Notification marked');
  } catch (error) {
    handleError(res, error, 'Failed to mark notification');
  }
};

// Confirm Receipt - User confirms they received the order
const confirmReceiptOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { notes = '' } = req.body;
    const userId = req.user?.userId || req.user?.id;
    
    const order = await Order.findById(orderId);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    
    // Check if user owns this order
    if (order.userId.toString() !== userId) {
      return sendResponse(res, 403, false, 'You do not have access to this order');
    }
    
    // Check if order is ready for confirmation
    if (order.status !== 'ready_pickup') {
      return sendResponse(res, 400, false, 'Order is not ready for confirmation');
    }

    // Update status to picked_up and add confirmation details
    await order.updateStatus('picked_up', 'customer', notes || 'Order received by customer');
    order.pickupDate = new Date();
    
    if (notes) {
      order.customerNotes = notes;
    }
    
    await order.save();
    await order.populate('orderItems.productId');
    
    sendResponse(res, 200, true, 'Order confirmation successful', { order });
  } catch (error) {
    handleError(res, error, 'Failed to confirm order receipt');
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
  deleteOrder,
  
  markReadyPickup,
  getNewOrdersCount,
  markNewOrdersNotified,
  confirmReceiptOrder
};