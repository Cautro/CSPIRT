import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { User } from '../models/User';

const router = Router();

router.get('/', authMiddleware, requireRole(['ADMIN','OWNER']), async (req, res) => {
    const users = await User.find();
    res.json(users);
});

export default router;
