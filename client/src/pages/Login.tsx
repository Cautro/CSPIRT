import { useState } from 'react';
import { api } from '../api';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id.toString());
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка входа');
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: '#1f2937', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)', maxWidth: '24rem', width: '100%' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#f3f4f6' }}>Вход</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ backgroundColor: '#374151', color: '#f3f4f6', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', width: '100%' }}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ backgroundColor: '#374151', color: '#f3f4f6', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', width: '100%' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#2563eb', padding: '0.5rem 1rem', borderRadius: '0.375rem', width: '100%', color: 'white' }}>
                        Войти
                    </button>
                </form>
                {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}
                <div style={{ color: '#9ca3af', marginTop: '1.5rem' }}>
                    <p>admin / admin123 (owner)</p>
                    <p>helper / helper123</p>
                    <p>pupil1 / pupil1</p>
                    <p>pupil2 / pupil2</p>
                </div>
            </div>
        </div>
    );
};

export default Login;