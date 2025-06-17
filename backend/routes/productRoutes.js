import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getHeroProducts
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import { auth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/hero', getHeroProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/create', upload.fields([
                        {name:'image1', maxCount:1}, 
                        {name:'image2', maxCount:1}, 
                        {name:'image3', maxCount:1}, 
                        {name:'image4', maxCount:1},
                      ]), auth, requireAdmin, createProduct); 
router.put('/update/:id', upload.fields([
                        {name:'newImage1', maxCount:1}, 
                        {name:'newImage2', maxCount:1}, 
                        {name:'newImage3', maxCount:1}, 
                        {name:'newImage4', maxCount:1},
                      ]), auth, requireAdmin, updateProduct);
router.delete('/delete/:id', auth, requireAdmin, deleteProduct);

export default router; 