import { Router } from 'express';
import { getMatchingSuggestions,accept} from '../controllers/mathingController';
import { authenticateToken } from '../middleware/authentication';

const router = Router();



// suggestions de profils
router.get('/matching/suggestions', authenticateToken, getMatchingSuggestions);
router.post('/matchings/:id/accept', accept)


export default router;