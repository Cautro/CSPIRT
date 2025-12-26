import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Мок-данные в памяти (вместо БД)
let users = [
    { id: 1, username: 'admin', password_hash: await bcrypt.hash('admin123', 10), role: 'admin', hidden_role: 'owner', score: 100 },
    { id: 2, username: 'teacher', password_hash: await bcrypt.hash('teacher123', 10), role: 'teacher', score: 95 },
    { id: 3, username: 'helper', password_hash: await bcrypt.hash('helper123', 10), role: 'helper', score: 90 },
    { id: 4, username: 'pupil1', password_hash: await bcrypt.hash('pupil123', 10), role: 'user', score: 85 },
    { id: 5, username: 'pupil2', password_hash: await bcrypt.hash('pupil123', 10), role: 'user', score: 88 },
]

let complaints: any[] = []
let notes: any[] = []
let logs: any[] = []

// Расширение Request
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                username: string
                role: string
                hidden_role?: string
            }
        }
    }
}

// Аутентификация
const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Нет токена' })

    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Ошибка сервера' })

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET) as Express.Request['user']
        next()
    } catch (err) {
        res.status(401).json({ error: 'Недействительный токен' })
    }
}

// Проверка роли
const checkRole = (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Не авторизован' })

    const hasAccess = roles.includes(req.user.role) || (req.user.hidden_role === 'owner' && roles.includes('admin'))
    hasAccess ? next() : res.status(403).json({ error: 'Доступ запрещён' })
}

// Регистрация (создаёт пользователя в памяти)
app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { username, password, role = 'user' } = req.body
    const hash = await bcrypt.hash(password, 10)
    const newUser = {
        id: users.length + 1,
        username,
        password_hash: hash,
        role,
        score: 100
    }
    users.push(newUser)
    res.json({ message: 'Пользователь создан', username })
})

// Логин
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body
    const user = users.find(u => u.username === username)
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ error: 'Неверные данные' })
    }
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, hidden_role: user.hidden_role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
    )
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
})

// Рейтинг
app.get('/api/ratings', authenticate, (req: Request, res: Response) => {
    const ratingList = users.map(u => ({ id: u.id, name: u.username, score: u.score }))
        .sort((a, b) => b.score - a.score)
    res.json(ratingList)
})

// Изменение баллов
app.post('/api/ratings/update', authenticate, checkRole(['teacher', 'admin']), (req: Request, res: Response) => {
    const { userId, delta } = req.body
    const user = users.find(u => u.id === userId)
    if (user) {
        user.score += delta
        logs.push({ action: 'update_score', user_id: req.user!.id, target_id: userId, details: `Delta: ${delta}` })
        res.json({ success: true })
    } else {
        res.status(404).json({ error: 'Пользователь не найден' })
    }
})

// Жалоба
app.post('/api/complaints', authenticate, checkRole(['user']), (req: Request, res: Response) => {
    const { toUserId, content } = req.body
    complaints.push({ from_user_id: req.user!.id, to_user_id: toUserId, content })
    res.json({ success: true })
})

// Заметка
app.post('/api/notes', authenticate, checkRole(['helper', 'teacher', 'admin']), (req: Request, res: Response) => {
    const { userId, content } = req.body
    notes.push({ user_id: userId, author_id: req.user!.id, content })
    res.json({ success: true })
})

// Логи (для owner/admin)
app.get('/api/logs', authenticate, checkRole(['admin']), (req: Request, res: Response) => {
    res.json(logs)
})

app.listen(PORT, () => console.log(`Сервер на http://localhost:${PORT}`))