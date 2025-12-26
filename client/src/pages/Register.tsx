// Аналогично Login, но с полем role (select: user, helper, teacher, admin — owner скрыто добавляется backend'ом)
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await axios.post('/api/auth/register', { username, password, role })
            navigate('/login')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white/10 rounded-xl">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="block w-full mb-4 p-2" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="block w-full mb-4 p-2" />
            <select value={role} onChange={e => setRole(e.target.value)} className="block w-full mb-4 p-2">
                <option value="user">Ученик</option>
                <option value="helper">Хелпер</option>
                <option value="teacher">Классный руководитель</option>
                <option value="admin">Админ</option>
            </select>
            <button type="submit" className="bg-green-500 text-white p-2">Register</button>
        </form>
    )
}

export default Register