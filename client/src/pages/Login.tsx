import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { useNavigate } from 'react-router-dom'
import '../styles/login.css'

export default function Login() {
    const navigate = useNavigate()
    const { login: authLogin } = useAuth()

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login,
                password
            })
        })

        if (!res.ok) {
            setError('Неверный логин или пароль')
            return
        }

        const user = await res.json()
        console.log('LOGGED USER:', user)
    }


    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>CSPIRT</h1>

                <input
                    type="text"
                    placeholder="Логин"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
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
