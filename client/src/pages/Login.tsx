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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-gray-100 text-center">Вход в систему</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-700 text-gray-100 p-3 rounded-md mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-700 text-gray-100 p-3 rounded-md mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                    <button type="submit" className="bg-blue-600 px-4 py-3 rounded-md w-full hover:bg-blue-700 transition duration-200 text-white font-semibold">
                        Войти
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    );
};

export default Login;