import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api';
import { User } from '../types';
import AdminPanel from './AdminPanel';
import HelperPanel from './HelperPanel';

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string>('');

    useEffect(() => {
        console.log('Dashboard: useEffect запущен');
        setDebug('Проверка токена...');

        const token = localStorage.getItem('token');
        console.log('Dashboard: токен из localStorage:', token ? 'есть' : 'нет');

        if (!token) {
            setDebug('Нет токена → редирект на /login');
            setLoading(false);
            return;
        }

        setDebug('Токен есть, загружаем /ratings...');

        const fetchCurrentUser = async () => {
            try {
                console.log('Dashboard: запрос /ratings');
                const response = await api.get('/ratings');
                console.log('Dashboard: ответ /ratings', response.data);

                const storedUserId = localStorage.getItem('userId');
                console.log('Dashboard: userId из localStorage', storedUserId);

                const foundUser = response.data.find((u: User) => u.id === Number(storedUserId));
                if (foundUser) {
                    console.log('Dashboard: пользователь найден', foundUser);
                    setCurrentUser(foundUser);
                    setDebug('Пользователь загружен');
                } else {
                    setError('Пользователь не найден в списке');
                    setDebug('Пользователь не найден');
                }
            } catch (err: any) {
                console.error('Dashboard error:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    setDebug('401 — токен недействителен');
                }
                setError('Ошибка загрузки данных');
                setDebug('Ошибка при запросе');
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);

    if (!localStorage.getItem('token')) {
        console.log('Dashboard: нет токена → Navigate to /login');
        return <Navigate to="/login" replace />;
    }

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100 text-xl">Загрузка... <br /> {debug}</div>;
    if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500 text-xl">{error} <br /> {debug}</div>;
    if (!currentUser) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100 text-xl">Нет данных <br /> {debug}</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <header className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl">
                <h1 className="text-3xl font-bold">CSPIRT Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.href = '/login';
                    }}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md"
                >
                    Выйти
                </button>
            </header>

            {currentUser.role === 'admin' ? (
                <AdminPanel />
            ) : currentUser.role === 'helper' ? (
                <HelperPanel />
            ) : (
                <div className="bg-gray-800 p-6 rounded-xl shadow-md max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Твой профиль</h2>
                    <p className="mb-2 text-gray-300">ФИО: {currentUser.fio}</p>
                    <p className="mb-2 text-gray-300">Класс: {currentUser.class}</p>
                    <p className="mb-4 text-gray-300">Рейтинг: {currentUser.score}</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;