import express from 'express';
import { loginUser, signUpUser, adminLogin, getUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

// Register route
userRouter.post('/signup', signUpUser);

// Login route
userRouter.post('/login', loginUser);

// Profile route
userRouter.get('/profile', getUserProfile);

// Admin Login route
userRouter.post('/admin-login', adminLogin);

export default userRouter; 