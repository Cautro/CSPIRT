import { Router } from 'express'
import users from '../../users.json'

const router = Router()

router.post('/login', (req, res) => {
    const { login, password } = req.body
    console.log('BODY:', req.body)
    console.log('USERS:', users)
    const user = (users as any[]).find(
        u => u.login === login && u.password === password
    )

    if (!user) {
        return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    const { password: _, ...safeUser } = user
    res.json(safeUser)
})

export default router
