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

    if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100 text-xl">Загрузка...</div>;
    if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500 text-xl">{error}</div>;
    if (!currentUser) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-100 text-xl">Нет данных</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <header className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold">CSPIRT Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('userId');
                        window.location.href = '/login';
                    }}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-md transition duration-200"
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
                    {/* Жалобы для user */}
                    <ComplaintsSection currentUserId={currentUser.id} />
                </div>
            )}
        </div>
    );
};

const ComplaintsSection = ({ currentUserId }: { currentUserId: number }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [content, setContent] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await api.get('/ratings');
            setUsers(response.data.filter((u: User) => u.id !== currentUserId));
        };
        fetchUsers();
    }, [currentUserId]);

    const sendComplaint = async () => {
        if (selectedUserId && content) {
            await api.post('/complaints', { toUserId: selectedUserId, content });
            alert('Жалоба отправлена');
            setContent('');
            setSelectedUserId(null);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-medium mb-2">Отправить жалобу</h3>
            <select
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="bg-gray-700 p-2 rounded-md mb-2 w-full"
            >
                <option value="">Выберите ученика</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fio}</option>)}
            </select>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Текст жалобы"
                className="bg-gray-700 p-2 rounded-md mb-2 w-full h-24"
            />
            <button onClick={sendComplaint} className="bg-red-600 px-4 py-2 rounded-md w-full hover:bg-red-700 transition duration-200">
                Отправить
            </button>
        </div>
    );
};

export default Dashboard;