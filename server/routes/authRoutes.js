import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyResetOtp } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
authRouter.get('/is-auth',userAuth,isAuthenticated)
authRouter.post('/verify-otp',verifyResetOtp)

export default authRouter