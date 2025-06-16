import express from 'express';
import { 
  addToCart, 
  getCart, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';
import { auth } from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

// Semua routes cart memerlukan authentication
cartRouter.use(auth);

cartRouter.get('/', getCart);
cartRouter.post('/add', addToCart);
cartRouter.put('/update', updateCartQuantity);
cartRouter.delete('/remove', removeFromCart);
cartRouter.delete('/clear', clearCart);

export default cartRouter; 