import express from 'express';
import { loginUser, signUpUser, adminLogin, getUserProfile, logOutUser, refreshToken, getAuthStats } from '../controllers/userController.js';
import { auth, validateRefreshToken } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post('/signup', signUpUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', auth, logOutUser);
userRouter.get('/profile', auth, getUserProfile);
userRouter.post('/admin', adminLogin);

// Refresh token endpoints
userRouter.post('/refresh-token', validateRefreshToken, refreshToken);

// Monitoring endpoint (optional)
userRouter.get('/auth-stats', auth, getAuthStats);

export default userRouter; 