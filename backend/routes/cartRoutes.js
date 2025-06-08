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

// Get cart user
cartRouter.get('/', getCart);

// Add item to cart
cartRouter.post('/add', addToCart);

// Update cart item quantity
cartRouter.put('/update', updateCartQuantity);

// Remove item from cart
cartRouter.delete('/remove', removeFromCart);

// Clear cart
cartRouter.delete('/clear', clearCart);

export default cartRouter; 