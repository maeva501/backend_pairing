import { Router } from 'express';
import { register, login, logout, getProfile, verifyOTP, resendOTP , getMatchingSuggestions , getUserProfileConnect ,accept  , getUsers, getStat} from '../controllers/authController';
import { authenticateToken } from '../middleware/authentication';

const router = Router();


// Authentication routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOTP);
router.post('/auth/logout', logout);
router.post('/auth/resend-otp', resendOTP);
router.post('/auth/forgot-password', resendOTP);
router.post('/auth/reset-password', resendOTP);

// gestion des profils
router.get('/auth/profile/:id', authenticateToken, getProfile);
router.get('/user/me', authenticateToken, getUserProfileConnect);

// suggestions de profils
router.get('/matching/suggestions', authenticateToken, getMatchingSuggestions);
router.post('/matchings/:id/accept', accept)

// Administration 

router.get('/admin/users', authenticateToken, getUsers);
router.post('admin/metrics', getStat)

export default router;