import { useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types';

const HelperPanel = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [noteContent, setNoteContent] = useState<string>('');
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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

    const addNote = async () => {
        if (selectedUserId && noteContent) {
            try {
                await api.post('/notes', { userId: selectedUserId, content: noteContent });
                alert('Заметка добавлена');
                setNoteContent('');
                setSelectedUserId(null);
            } catch (err) {
                alert('Ошибка добавления заметки');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Загрузка...</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Помощник: Заметки к ученикам</h2>
            <ul className="space-y-4 mb-6">
                {usersList.map((userItem) => (
                    <li
                        key={userItem.id}
                        className="bg-gray-700 p-4 rounded"
                    >
                        {userItem.fio} ({userItem.class})
                        <button
                            onClick={() => setSelectedUserId(userItem.id)}
                            className="ml-4 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                        >
                            Добавить заметку
                        </button>
                    </li>
                ))}
            </ul>
            {selectedUserId && (
                <div className="flex flex-col">
          <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Введите заметку..."
              className="bg-gray-700 text-white p-2 rounded mb-2"
          />
                    <button onClick={addNote} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                        Сохранить заметку
                    </button>
                </div>
            )}
        </div>
    );
};

export default HelperPanel;