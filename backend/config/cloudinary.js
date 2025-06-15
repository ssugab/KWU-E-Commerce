import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();


// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Konfigurasi Storage untuk Payment Proofs
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'kwu-order-payment-proofs', // Folder khusus untuk bukti pembayaran
    allowed_formats: ['jpg', 'jpeg', 'png'], // Format yang diizinkan
    transformation: [
      { width: 800, height: 600, crop: 'limit' }, // Resize otomatis
      { quality: 'auto' }, // Optimasi kualitas
    ],
    resource_type: 'image',
  },
});

// Multer middleware untuk upload
const uploadPaymentProof = multer({
  storage: paymentStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validasi file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

export default cloudinary;
export { uploadPaymentProof };
