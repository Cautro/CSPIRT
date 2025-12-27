import React, { useState } from 'react';
import { login as loginApi } from '../services/api';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await loginApi(login, password);
            if (data.success) {
                // Сохраняем данные пользователя
                localStorage.setItem('user', JSON.stringify(data.user));
                // Перенаправляем на нужную страницу
                window.location.href = '/dashboard'; // или используй React Router
            } else {
                setError(data.message || 'Ошибка авторизации');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка подключения');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Логин"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Войти</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default Login;