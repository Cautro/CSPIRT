// server/src/routes/auth.ts
import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const usersPath = path.join(__dirname, '../data/users.json');

router.post('/login', (req, res) => {
    console.log("Login attempt:", req.body); // <-- Добавь для дебага

    const { login, password } = req.body;

    const usersRaw = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersRaw);

    const user = users.find((u: any) => u.login === login && u.password === password);

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
});

export default router; // <-- Убедись, что это есть