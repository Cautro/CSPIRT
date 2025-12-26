import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Неверные данные' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Неверные данные' });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const payload = {
        id: user._id.toString(),
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({ token });
});

export default router;
