import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к PostgreSQL — данные сохраняются здесь, не забываются при перезапуске
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                role: string;
                hidden_role?: string | null;
            };
        }
    }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Нет токена' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
};

const checkRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Не аутентифицирован' });
    if (req.user.hidden_role === 'owner' || roles.includes(req.user.role)) return next();
    res.status(403).json({ error: 'Доступ запрещён' });
};

// Регистрация
app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { username, password, role = 'user', fio, class: userClass } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password_hash, role, score, fio, class) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username',
            [username, hash, role, 100, fio, userClass]
        );
        res.json({ message: 'Пользователь создан', username: result.rows[0].username });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});

// Логин
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Неверные данные' });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, hidden_role: user.hidden_role || null },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, fio: user.fio, class: user.class, score: user.score } });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка логина' });
    }
});

// Рейтинг
app.get('/api/ratings', authenticate, async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, username AS name, fio, class, score FROM users ORDER BY score DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения рейтинга' });
    }
});

// Детали юзера
app.get('/api/user/:id', authenticate, checkRole(['admin', 'helper']), async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, username, fio, class, score FROM users WHERE id = $1', [req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения юзера' });
    }
});

// Изменение баллов
app.post('/api/ratings/update', authenticate, checkRole(['admin']), async (req: Request, res: Response) => {
    const { userId, delta } = req.body;
    try {
        await pool.query('UPDATE users SET score = score + $1 WHERE id = $2', [delta, userId]);
        await pool.query(
            'INSERT INTO logs (action, user_id, target_id, details) VALUES ($1, $2, $3, $4)',
            ['update_score', req.user!.id, userId, `Delta: ${delta}`]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления' });
    }
});

// Жалоба
app.post('/api/complaints', authenticate, checkRole(['user']), async (req: Request, res: Response) => {
    const { toUserId, content } = req.body;
    try {
        await pool.query(
            'INSERT INTO complaints (from_user_id, to_user_id, content) VALUES ($1, $2, $3)',
            [req.user!.id, toUserId, content]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка жалобы' });
    }
});

// Заметка
app.post('/api/notes', authenticate, checkRole(['helper', 'admin']), async (req: Request, res: Response) => {
    const { userId, content } = req.body;
    try {
        await pool.query(
            'INSERT INTO notes (user_id, author_id, content) VALUES ($1, $2, $3)',
            [userId, req.user!.id, content]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка заметки' });
    }
});

// Логи
app.get('/api/logs', authenticate, checkRole(['admin']), async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM logs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка логов' });
    }
});

app.listen(PORT, () => console.log(`Сервер на http://localhost:${PORT}`));