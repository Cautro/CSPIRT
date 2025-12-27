import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
    id: string;
    role: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Нет токена' });

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

        req.user = user;
        next();
    } catch {
        res.status(401).json({ message: 'Не авторизован' });
    }
};
