import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const auth = useAuth()
    const nav = useNavigate()

    const submit = async () => {
        setError('')
        try {
            const res = await api.post('/auth/login', { username, password })
            auth.login(res.data.token, res.data.role)
            nav('/')
        } catch (e: any) {
            setError(e.response?.data?.message || 'Ошибка входа')
        }
    }

    return (
        <div className="page-center">
            <div className="card">
                <h1>Вход в систему</h1>

                {error && <div className="error">{error}</div>}

                <label>Логин</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />

                <label>Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button onClick={submit}>Войти</button>
            </div>
        </div>
    )
}
