import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/jsonStore'
import { v4 as uuid } from 'uuid'

const router = Router()

router.get('/', (req, res) => {
    const { isOwner } = req.query
    if (isOwner !== 'true') {
        return res.status(403).json({ message: 'Forbidden' })
    }

    const logs = readJSON<any[]>('logs.json')
    res.json(logs)
})

router.post('/', (req, res) => {
    const { actorId, targetId, delta, reason, isOwner } = req.body

    if (!isOwner) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    const logs = readJSON<any[]>('logs.json')

    logs.push({
        id: uuid(),
        actorId,
        targetId,
        delta,
        reason,
        date: new Date().toISOString()
    })

    writeJSON('logs.json', logs)
    res.json({ success: true })
})

export default router
