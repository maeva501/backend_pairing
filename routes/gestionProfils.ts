import { Router } from 'express';
import { getProfile, getUserProfileConnect} from '../controllers/profileCtrl';
import { authenticateToken } from '../middleware/authentication';

const users = Router();



// gestion des profils
users.get('/profile/:id', authenticateToken, getProfile);

export default users;