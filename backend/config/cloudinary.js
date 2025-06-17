import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();


// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Configuration Storage for Payment Proofs
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kwu-order-payment-proofs', // Folder for payment proofs
    allowed_formats: ['jpg', 'jpeg', 'png'], // Allowed formats
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Resize automatically
      { quality: 'auto' }, // Optimize quality
    ],
    resource_type: 'image',
  },
});

// Multer middleware for upload
const uploadPaymentProof = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

export default cloudinary;
export { uploadPaymentProof };
