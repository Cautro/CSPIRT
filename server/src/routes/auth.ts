import { Router } from 'express'
import users from '../data/users.json'

const router = Router()

router.post('/login', (req, res) => {
    const { login, password } = req.body

    const user = users.find(
        u => u.login === login && u.password === password
    )

    if (!user) {
        return res.status(401).json({ message: 'Неверный логин или пароль' })
    }

    res.json({
        id: user.id,
        login: user.login,
        role: user.role,
        isOwner: user.isOwner,
        fullName: user.fullName,
        class: user.class,
        rating: user.rating
    })
})

export default router
