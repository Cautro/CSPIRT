import { Router } from 'express'
import { readJSON, writeJSON } from '../utils/jsonStore'
import { v4 as uuid } from 'uuid'

const router = Router()

router.get('/', (req, res) => {
    const notes = readJSON<any[]>('notes.json')
    res.json(notes)
})

router.post('/', (req, res) => {
    const { fromHelperId, toUserId, text } = req.body

    const notes = readJSON<any[]>('notes.json')

    notes.push({
        id: uuid(),
        fromHelperId,
        toUserId,
        text,
        date: new Date().toISOString()
    })

    writeJSON('notes.json', notes)
    res.json({ success: true })
})

export default router
