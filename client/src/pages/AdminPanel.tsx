import { useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import EditModal from './EditModal';

const AdminPanel = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/ratings');
                setUsersList(response.data);
            } catch (err) {
                console.error('Ошибка загрузки пользователей');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-100">Загрузка пользователей...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Список пользователей</h2>
            <ul className="space-y-3">
                {usersList.map((userItem) => (
                    <li
                        key={userItem.id}
                        onClick={() => setSelectedUser(userItem)}
                        className="bg-gray-700 p-4 rounded-md cursor-pointer hover:bg-gray-600 transition duration-200"
                    >
                        {userItem.fio} ({userItem.class}) - Рейтинг: {userItem.score}
                    </li>
                ))}
            </ul>
            {selectedUser && (
                <EditModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </div>
    );
};

export default AdminPanel;