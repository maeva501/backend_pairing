import { Router } from 'express';
import { getUsers, getStat} from '../controllers/adminCtrl';
import { authenticateToken } from '../middleware/authentication';

const router = Router();


// Administration 

router.get('/admin/users', authenticateToken, getUsers);
router.get('/admin/metrics', getStat);

export default router;