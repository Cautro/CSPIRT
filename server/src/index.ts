import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI!)
    .then(() => {
        console.log('✅ MongoDB connected')

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`)
        })
    })
    .catch(err => {
        console.error('❌ Mongo error:', err)
    })
