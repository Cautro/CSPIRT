import { useState } from 'react';
import { api } from '../api';

const Login = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id.toString());

            // Это работает всегда — полная перезагрузка после сохранения токена
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error || 'Неверный логин или пароль');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-gray-100 text-center">Вход в CSPIRT</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                        className="bg-gray-700 text-gray-100 p-3 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className="bg-gray-700 text-gray-100 p-3 rounded-md mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" disabled={loading} className="bg-blue-600 px-4 py-3 rounded-md w-full text-white font-semibold">
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
                <div className="text-gray-400 mt-6 text-sm text-center">
                    <p>Тестовые аккаунты:</p>
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