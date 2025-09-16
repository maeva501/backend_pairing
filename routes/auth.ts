import { Router } from 'express';
import { register, login, logout, verifyOTP, resendOTP} from '../controllers/authController';
import { authenticateToken } from '../middleware/authentication';
import { getUserProfileConnect } from '../controllers/authController';
const auth = Router();


// Authentication routes
auth.post('/register', register);
auth.post('/login', login);
auth.post('/verify-otp', verifyOTP);
auth.post('/logout', logout);
auth.post('/resend-otp', resendOTP);
auth.post('/forgot-password', resendOTP);
auth.post('/reset-password', resendOTP);
auth.get('/me', authenticateToken, getUserProfileConnect);


export default auth;
