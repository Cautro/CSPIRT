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

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/ratings');
                const storedUserId = localStorage.getItem('userId');
                const foundUser = response.data.find((u: User) => u.id === Number(storedUserId));
                if (foundUser) {
                    setCurrentUser(foundUser);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (err) {
                setError('Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentUser();
    }, []);

    if (!localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }

    if (loading) return <div className="text-center py-10">Загрузка...</div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
    if (!currentUser) return <div className="text-center py-10">Нет данных</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">CSPIRT Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.href = '/login';
                    }}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                >
                    Выйти
                </button>
            </header>

            {currentUser.role === 'admin' ? (
                <AdminPanel />
            ) : currentUser.role === 'helper' ? (
                <HelperPanel />
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Твой профиль</h2>
                    <p className="mb-2">ФИО: {currentUser.fio}</p>
                    <p className="mb-2">Класс: {currentUser.class}</p>
                    <p className="mb-2">Рейтинг: {currentUser.score}</p>
                    {/* Добавим жалобы позже */}
                </div>
            )}
        </div>
    );
};

export default Dashboard;