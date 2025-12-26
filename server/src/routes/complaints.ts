import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Не авторизован' });
    }

    // req.user доступен
    res.json({ message: 'Жалоба создана', userId: req.user._id });
});

export default router;
