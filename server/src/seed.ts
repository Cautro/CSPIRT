import 'dotenv/config'
import mongoose from 'mongoose'
import { User } from './models/User'

async function seed() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined')
    }

    await mongoose.connect(process.env.MONGO_URI)

    await User.deleteMany({})

    await User.create([
        {
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            rating: 200
        },
        {
            username: 'user',
            password: 'user123',
            role: 'user',
            rating: 100
        }
    ])

    console.log('✅ Seed completed')
    process.exit(0)
}

seed().catch(err => {
    console.error('❌ Seed error:', err)
    process.exit(1)
})
