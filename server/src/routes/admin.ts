import { Router } from 'express';
import { auth } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { User } from '../models/User';

const router = Router();

router.post('/rating', auth, requireRole(['ADMIN', 'OWNER']), async (req, res) => {
    await User.findByIdAndUpdate(req.body.userId, {
        $inc: { rating: req.body.delta }
    });

    res.sendStatus(200);
});

export default router;
