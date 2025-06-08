import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import connnectCloudinary from './config/cloudinary.js';
// import productRoutes from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Config
const app = express();
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/catalog', productRoutes);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);

// API Endpoints
app.get('/', (req, res) => {
  res.send('API is running')
})
  
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log(err.message)
  res.status(500).json({ message: 'Server Error' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 