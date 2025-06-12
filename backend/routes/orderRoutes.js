import express from 'express';
import { createOrder, 
  getOrder, 
  getOrderByNumber, 
  getOrdersByEmail, 
  getAllOrders, 
  updateOrderStatus, 
  updatePaymentStatus, 
  cancelOrder,
  deleteOrder } 
from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.get('/:id', getOrder);
orderRouter.get('/number/:number', getOrderByNumber);
orderRouter.get('/email/:email', getOrdersByEmail);
orderRouter.get('/', getAllOrders);
orderRouter.put('/:id/status', updateOrderStatus);
orderRouter.put('/:id/payment', updatePaymentStatus);
orderRouter.put('/:id/cancel', cancelOrder);
orderRouter.delete('/:id', deleteOrder);

export default orderRouter;