import { Router } from 'express';
import { getProfile, getUserProfileConnect} from '../controllers/authController';
import { authenticateToken } from '../middleware/authentication';

const router = Router();



// gestion des profils
router.get('/auth/profile/:id', authenticateToken, getProfile);
router.get('/user/me', authenticateToken, getUserProfileConnect);


export default router;