import express from 'express';
import { createOrder, 
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
  markNewOrdersNotified } 
from '../controllers/orderController.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';
import { uploadPaymentProof as uploadMiddleware } from '../config/cloudinary.js';

const orderRouter = express.Router();

// User routes (require auth only)
orderRouter.post('/create', auth, createOrder);
orderRouter.get('/my-orders', auth, getMyOrders);
orderRouter.post('/:id/upload-proof', auth, uploadMiddleware.single('paymentProof'), uploadPaymentProof);

// Public routes (accessible to all authenticated users)
orderRouter.get('/:id', auth, getOrder);
orderRouter.get('/user/:email', auth, getOrdersByEmail);

// Admin-only routes (require auth + admin role)
orderRouter.get('/', auth, requireAdmin, getAllOrders);
orderRouter.put('/:id/status', auth, requireAdmin, updateOrderStatus);
orderRouter.put('/:id/payment', auth, requireAdmin, updatePaymentStatus);
orderRouter.put('/:id/cancel', auth, requireAdmin, cancelOrder);
orderRouter.delete('/:id', auth, requireAdmin, deleteOrder);

// Admin notification routes
orderRouter.put('/:id/ready-pickup', auth, requireAdmin, markReadyPickup);
orderRouter.get('/admin/new-count', auth, requireAdmin, getNewOrdersCount);
orderRouter.put('/admin/mark-notified', auth, requireAdmin, markNewOrdersNotified);

export default orderRouter;