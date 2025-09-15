import { Router } from 'express';
import { subscribe} from '../controllers/abonnementCtrl';
import { authenticateToken } from '../middleware/authentication';

const router = Router();


//abonnement et monetisation
router.post('/subscriptions/upgrade', authenticateToken, subscribe);


export default router;