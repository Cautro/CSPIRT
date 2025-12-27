import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

const router = Router()

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(400).json({ message: 'Нет логина или пароля' })
        }

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ message: 'Неверный логин или пароль' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный логин или пароль' })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not defined')
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                rating: user.rating,
            },
        })
    } catch (err) {
        console.error('LOGIN ERROR:', err)
        res.status(500).json({ message: 'Ошибка сервера' })
    }
})

export default router
