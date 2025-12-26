import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
    id: string;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Нет токена' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        req.user = user; // ✅ теперь TS НЕ ОРЁТ
        next();
    } catch {
        res.status(401).json({ message: 'Не авторизован' });
    }
};
