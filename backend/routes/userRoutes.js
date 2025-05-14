import express from 'express';
import { loginUser, signUpUser, adminLogin } from '../controllers/userController.js';

const userRouter = express.Router();

// Register route
userRouter.post('/signup', signUpUser);

// Login route
userRouter.post('/login', loginUser);

// Admin Login route
userRouter.post('/admin-login', adminLogin);

export default userRouter; 