import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/auth/login', { username, password })
            login(res.data.token)
            navigate('/')
        } catch (err) {
            alert('Неверный логин или пароль')
        }
    }

    return (
        <div className="card">
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input className="block w-full mb-4 p-4 rounded" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required />
                <input className="block w-full mb-4 p-4 rounded" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="submit" className="btn">Войти</button>
            </form>
            <p className="mt-4">Тестовые аккаунты:<br />
                admin / admin123 (owner)<br />
                teacher / teacher123<br />
                pupil1 / pupil123</p>
        </div>
    )
}

export default Login