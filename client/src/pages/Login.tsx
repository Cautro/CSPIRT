import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!username || !password) {
            setError('Введите логин и пароль')
            return
        }

        try {
            await login(username, password)
            navigate('/dashboard')
        } catch {
            setError('Неверный логин или пароль')
        }
    }

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>CSPIRT</h1>

                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                {error && <div className="error">{error}</div>}

                <button type="submit">Войти</button>
            </form>
        </div>
    )
}
