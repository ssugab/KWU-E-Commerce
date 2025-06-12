import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/create', upload.fields([
                        {name:'image1', maxCount:1}, 
                        {name:'image2', maxCount:1}, 
                        {name:'image3', maxCount:1}, 
                        {name:'image4', maxCount:1},
                      ]), admin, createProduct); 
router.put('/update/:id', admin, updateProduct);
router.delete('/delete/:id', admin, deleteProduct);

export default router; 