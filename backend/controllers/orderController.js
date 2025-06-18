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

// Helper function untuk mengurangi stok produk
const reduceProductStock = async (orderItems) => {
  const stockUpdates = [];
  
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} tidak ditemukan`);
    }
    
    // Cek apakah stok mencukupi
    if (product.stock < item.quantity) {
      throw new Error(`Stok ${product.name} tidak mencukupi. Stok tersedia: ${product.stock}, dibutuhkan: ${item.quantity}`);
    }
    
    // Kurangi stok
    const newStock = product.stock - item.quantity;
    product.stock = newStock;
    
    // Update status produk jika stok habis
    if (newStock === 0) {
      product.status = 'out_of_stock';
    }
    
    await product.save();
    stockUpdates.push({
      productId: product._id,
      productName: product.name,
      previousStock: product.stock + item.quantity,
      newStock: newStock,
      quantity: item.quantity
    });
  }
  
  return stockUpdates;
};

// Helper function to restore product stock (if order is cancelled)
const restoreProductStock = async (orderItems) => {
  const stockUpdates = [];
  
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      console.log(`⚠️ Product ${item.productId} tidak ditemukan saat restore stock`);
      continue;
    }
    
    const newStock = product.stock + item.quantity;
    product.stock = newStock;
    
    // Update product status if it was out_of_stock
    if (product.status === 'out_of_stock' && newStock > 0) {
      product.status = 'active';
    }
    
    await product.save();
    stockUpdates.push({
      productId: product._id,
      productName: product.name,
      previousStock: product.stock - item.quantity,
      newStock: newStock,
      quantity: item.quantity
    });
  }
  
  return stockUpdates;
};

// Create Order
const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing } = req.body;
    const userId = req.user?.userId || req.user?.id;

    if (!customer?.name || !customer?.email || !customer?.phone || !items?.length || !userId) {
      return sendResponse(res, 400, false, 'Data is not complete');
    }

    const orderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return sendResponse(res, 400, false, `Product ${item.productId} tidak ditemukan`);
      }

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
    sendResponse(res, 201, true, 'Order created successfully', { order: newOrder });

  } catch (error) {
    handleError(res, error, 'Failed to create order');
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.productId');
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    
    sendResponse(res, 200, true, 'Success', { order });
  } catch (error) {
    handleError(res, error, 'Failed to get order');
  }
};

// Get Orders by Email
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
    handleError(res, error, 'Failed to get orders by email');
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    if (!orders) return sendResponse(res, 404, false, 'Order not found');
    sendResponse(res, 200, true, 'Success', { orders });
  } catch (error) {
    handleError(res, error, 'Failed to get my orders');
  }
};

// Get All Orders - Admin only
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

    // Auto-mark new orders as notified when admin views orders
    const notificationUpdate = await Order.updateMany(
      { 'notifications.newOrderNotified': false },
      { 'notifications.newOrderNotified': true }
    );

    // Build filter for filtering orders by status
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort for sorting orders
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('orderItems.productId')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    sendResponse(res, 200, true, 'Orders loaded and notifications cleared', {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      },
      notificationsCleared: notificationUpdate.modifiedCount
    });
  } catch (error) {
    handleError(res, error, 'Failed to get all orders');
  }
};

// Update order status (Admin only)
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

    // Handle stock when order is cancelled after confirmed
    if (status === 'cancelled' && order.status === 'confirmed' && order.stockReduced) {
      try {
        const stockUpdates = await restoreProductStock(order.orderItems);
        console.log('📦 Stock restored:', stockUpdates);
        order.stockRestored = true;
        order.stockRestoreLog = stockUpdates;
      } catch (stockError) {
        console.error('❌ Error restoring stock:', stockError.message);
        // Continue cancel order even if restore stock fails
      }
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

// Update payment status (Admin only)
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

// Upload Payment Proof
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

// Cancel Order - Admin only (user might cancel their own order in future update)
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    if (order.status === 'picked_up') return sendResponse(res, 400, false, 'Order already picked up');
    if (order.status === 'cancelled') return sendResponse(res, 400, false, 'Order already cancelled');

    // Restore stock if order is confirmed
    if (order.status === 'confirmed' && order.stockReduced) {
      try {
        const stockUpdates = await restoreProductStock(order.orderItems);
        console.log('📦 Stock restored after cancellation:', stockUpdates);
        order.stockRestored = true;
        order.stockRestoreLog = stockUpdates;
      } catch (stockError) {
        console.error('❌ Error restoring stock:', stockError.message);
        // Continue cancel order even if restore stock fails
      }
    }

    await order.updateStatus('cancelled', 'customer', reason || 'Dibatalkan');
    await order.populate('orderItems.productId');
    
    sendResponse(res, 200, true, 'Order cancelled successfully', { order });
  } catch (error) {
    handleError(res, error, 'Failed to cancel order');
  }
};

// Delete Order - Admin only
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

// Get orders that need admin notification (new orders) - Admin only
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

// Confirm Receipt - User confirms they received the order products
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

// Confirm Payment - Admin only
const confirmPayment = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { adminNotes = '' } = req.body;
    
    const order = await Order.findById(orderId).populate('orderItems.productId');
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    
    // Check if order can be confirmed
    if (order.status === 'confirmed') {
      return sendResponse(res, 400, false, 'Order already confirmed');
    }
    
    if (order.status === 'cancelled' || order.status === 'expired') {
      return sendResponse(res, 400, false, 'Order already cancelled or expired');
    }
    
    if (order.paymentStatus !== 'paid') {
      return sendResponse(res, 400, false, 'Payment proof not uploaded');
    }
    
    try {

      const stockUpdates = await reduceProductStock(order.orderItems);
      console.log('📦 Stock updated:', stockUpdates);
      
      await order.updateStatus('confirmed', 'admin', adminNotes || 'Payment Confirmed');
      
      if (adminNotes) {
        order.adminNotes = adminNotes;
      }
      
      order.stockReduced = true;
      order.stockUpdateLog = stockUpdates;
      
      await order.save();
      await order.populate('orderItems.productId');
      
      sendResponse(res, 200, true, 'Payment confirmed and stock reduced successfully', { 
        order,
        stockUpdates
      });
      
    } catch (stockError) {
      return sendResponse(res, 400, false, `Failed to reduce stock: ${stockError.message}`);
    }
    
  } catch (error) {
    handleError(res, error, 'Failed to confirm payment');
  }
};

// Reject Payment - Admin only
const rejectPayment = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { adminNotes = '' } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) return sendResponse(res, 404, false, 'Order not found');
    
    // Reset payment status
    order.paymentStatus = 'failed';
    await order.updateStatus('pending_confirmation', 'admin', adminNotes || 'Payment rejected, please upload payment proof again');
    
    if (adminNotes) {
      order.adminNotes = adminNotes;
    }
    
    await order.save();
    await order.populate('orderItems.productId');
    
    sendResponse(res, 200, true, 'Payment rejected', { order });
    
  } catch (error) {
    handleError(res, error, 'Failed to reject payment');
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
  
  confirmPayment,
  rejectPayment,
  markReadyPickup,
  getNewOrdersCount,
  confirmReceiptOrder
};