import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/jsonStore'
import { v4 as uuid } from 'uuid'

const router = Router()

// Получить жалобы
router.get('/', (req, res) => {
    const complaints = readJSON<any[]>('complaints.json')
    res.json(complaints)
})

// Создать жалобу (анонимно)
router.post('/', (req, res) => {
    const { fromUserId, toUserId, text } = req.body

    const complaints = readJSON<any[]>('complaints.json')

    complaints.push({
        id: uuid(),
        fromUserId,
        toUserId,
        text,
        date: new Date().toISOString(),
        handled: false
    })

    writeJSON('complaints.json', complaints)
    res.json({ success: true })
})

export default router
