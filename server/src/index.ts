import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';

dotenv.config();

interface User {
    id: number;
    username: string;
    password_hash: string;
    role: string;
    hidden_role?: string;
    score: number;
    fio: string;
    class: string;
}

interface Complaint {
    id: number;
    from_user_id: number;
    to_user_id: number;
    content: string;
    created_at: Date;
}

interface Note {
    id: number;
    user_id: number;
    author_id: number;
    content: string;
    created_at: Date;
}

interface Log {
    id: number;
    action: string;
    user_id: number;
    target_id?: number;
    details: string;
    created_at: Date;
}

const app = express();
const PORT = process.env.PORT || 5000;

const USERS_FILE = './data/users.json';
const COMPLAINTS_FILE = './data/complaints.json';
const NOTES_FILE = './data/notes.json';
const LOGS_FILE = './data/logs.json';

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

let users: User[] = [];
let complaints: Complaint[] = [];
let notes: Note[] = [];
let logs: Log[] = [];

if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
if (fs.existsSync(COMPLAINTS_FILE)) {
    complaints = JSON.parse(fs.readFileSync(COMPLAINTS_FILE, 'utf8'));
}
if (fs.existsSync(NOTES_FILE)) {
    notes = JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
}
if (fs.existsSync(LOGS_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf8'));
}

const saveData = () => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(complaints, null, 2));
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
};

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
    const newUser: User = {
        id: users.length + 1,
        username,
        password_hash: hash,
        role,
        score: 100,
        fio,
        class: userClass
    };
    users.push(newUser);
    saveData();
    res.json({ message: 'Пользователь создан', username });
});

// Логин
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find((u: User) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Неверные данные' });
    }
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, hidden_role: user.hidden_role || null },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, fio: user.fio, class: user.class, score: user.score } });
});

// Рейтинг
app.get('/api/ratings', authenticate, (req: Request, res: Response) => {
    res.json(users.map((u: User) => ({ id: u.id, name: u.username, fio: u.fio, class: u.class, score: u.score })).sort((a: any, b: any) => b.score - a.score));
});

// Детали юзера
app.get('/api/user/:id', authenticate, checkRole(['admin', 'helper']), (req: Request, res: Response) => {
    const user = users.find((u: User) => u.id === Number(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Пользователь не найден' });
    }
});

// Изменение баллов
app.post('/api/ratings/update', authenticate, checkRole(['admin']), (req: Request, res: Response) => {
    const { userId, delta } = req.body;
    const user = users.find((u: User) => u.id === userId);
    if (user) {
        user.score += delta;
        const newLog: Log = {
            id: logs.length + 1,
            action: 'update_score',
            user_id: req.user!.id,
            target_id: userId,
            details: `Delta: ${delta}`,
            created_at: new Date()
        };
        logs.push(newLog);
        saveData();
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Пользователь не найден' });
    }
});

// Жалоба
app.post('/api/complaints', authenticate, checkRole(['user']), (req: Request, res: Response) => {
    const { toUserId, content } = req.body;
    const newComplaint: Complaint = {
        id: complaints.length + 1,
        from_user_id: req.user!.id,
        to_user_id: toUserId,
        content,
        created_at: new Date()
    };
    complaints.push(newComplaint);
    saveData();
    res.json({ success: true });
});

// Заметка
app.post('/api/notes', authenticate, checkRole(['helper', 'admin']), (req: Request, res: Response) => {
    const { userId, content } = req.body;
    const newNote: Note = {
        id: notes.length + 1,
        user_id: userId,
        author_id: req.user!.id,
        content,
        created_at: new Date()
    };
    notes.push(newNote);
    saveData();
    res.json({ success: true });
});

// Логи
app.get('/api/logs', authenticate, checkRole(['admin']), (req: Request, res: Response) => {
    res.json(logs);
});

app.listen(PORT, () => console.log(`Сервер на http://localhost:${PORT}`));