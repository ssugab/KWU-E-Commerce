import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';

import userRouter from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Config
const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Allow cookies
}));
app.use(cookieParser()); // Parse cookies
app.use(express.json());

// Routes
app.use('/api/catalog', productRoutes);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

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