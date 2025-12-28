import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

const usersPath = path.join(__dirname, '../data/users.json');

router.post('/login', (req: Request, res: Response) => {
    console.log("Login attempt:", req.body); // Лог для дебага

    const { login, username, password } = req.body;
    const userLogin = login || username; // Поддерживаем оба варианта

    try {
        const usersRaw = fs.readFileSync(usersPath, 'utf8');
        const users = JSON.parse(usersRaw);

        console.log("Users loaded:", users); // <-- Добавь для дебага

        const user = users.find((u: any) => u.login === userLogin && u.password === password);

        console.log("User found:", user); // <-- Добавь для дебага

        if (user) {
            res.json({
                success: true,
                user: {
                    id: user.id,
                    login: user.login,
                    role: user.role,
                    name: user.name,
                    class: user.class,
                },
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Неверный логин или пароль',
            });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default router;