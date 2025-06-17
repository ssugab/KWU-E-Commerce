import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, logOutUser, refreshToken, changePassword, forgotPassword, resetPassword } from '../controllers/userController.js';
import { auth, validateRefreshToken, requireAdmin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logOutUser);
userRouter.get('/profile', auth, getUserProfile);
userRouter.post('/change-password', auth, changePassword);
userRouter.post('/admin-login', adminLogin);

// Refresh token endpoints
userRouter.post('/refresh-token', validateRefreshToken, refreshToken);

// Forgot password routes
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter; 