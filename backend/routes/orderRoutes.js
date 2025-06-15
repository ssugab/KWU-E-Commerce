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
import { auth } from '../middleware/authMiddleware.js';
import { uploadPaymentProof as uploadMiddleware } from '../config/cloudinary.js';

const orderRouter = express.Router();

orderRouter.post('/create', auth, createOrder);
orderRouter.get('/', getAllOrders);
orderRouter.get('/:id', getOrder);
orderRouter.get('/my-orders', auth, getMyOrders);
orderRouter.get('/user/:email', getOrdersByEmail);
orderRouter.put('/:id/status', updateOrderStatus);
orderRouter.put('/:id/payment', updatePaymentStatus);
orderRouter.post('/:id/upload-proof', auth, uploadMiddleware.single('paymentProof'), uploadPaymentProof);
orderRouter.put('/:id/cancel', cancelOrder);
orderRouter.delete('/:id', deleteOrder);
orderRouter.put('/:id/ready-pickup', markReadyPickup);
orderRouter.get('/admin/new-count', getNewOrdersCount);
orderRouter.put('/admin/mark-notified', markNewOrdersNotified);

export default orderRouter;