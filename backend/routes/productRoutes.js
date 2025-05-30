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
// import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.get('/:category', getProductByCategory);

// Admin routes
router.post('/create', upload.fields([
                        {name:'image1', maxCount:1}, 
                        {name:'image2', maxCount:1}, 
                        {name:'image3', maxCount:1}, 
                        {name:'image4', maxCount:1},
                      ]),  createProduct); //protect, admin

router.put('/update/:id', updateProduct);
//router.put('/update/:id', upload.fields([
//                        {name:'image1', maxCount:1}, 
//                        {name:'image2', maxCount:1}, 
//                        {name:'image3', maxCount:1}, 
//                        {name:'image4', maxCount:1},
//                      ]), updateProduct); //protect, admin

router.delete('/delete/:id', deleteProduct); //protect, admin

export default router; 