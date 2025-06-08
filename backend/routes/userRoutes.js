import express from 'express';
import { loginUser, signUpUser, adminLogin, getUserProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/signup', signUpUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', getUserProfile);
userRouter.post('/admin', adminLogin);

export default userRouter; 