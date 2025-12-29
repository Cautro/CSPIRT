import { useState } from 'react';
import { api } from '../api';
import { User } from '../types';

interface EditModalProps {
    user: User;
    onClose: () => void;
}

const EditModal = ({ user, onClose }: EditModalProps) => {
    const [deltaValue, setDeltaValue] = useState<number>(0);

    const updateScore = async (direction: 'up' | 'down') => {
        const actualDelta = direction === 'up' ? deltaValue : -deltaValue;
        try {
            await api.post('/ratings/update', { userId: user.id, delta: actualDelta });
            alert('Рейтинг обновлён успешно');
            onClose();
        } catch (err) {
            alert('Ошибка при обновлении рейтинга');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4">{user.fio}</h2>
                <p className="mb-2 text-gray-300">Класс: {user.class}</p>
                <p className="mb-4 text-gray-300">Рейтинг: {user.score}</p>
                <div className="flex items-center mb-4">
                    <input
                        type="number"
                        min="1"
                        max="50"
                        value={deltaValue}
                        onChange={(e) => setDeltaValue(Number(e.target.value))}
                        className="bg-gray-700 text-white p-2 rounded-md mr-2 w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={() => updateScore('down')} className="bg-red-600 px-4 py-2 rounded-md mr-2 hover:bg-red-700 transition duration-200">
                        Понизить
                    </button>
                    <button onClick={() => updateScore('up')} className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
                        Повысить
                    </button>
                </div>
                <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-md w-full hover:bg-gray-500 transition duration-200">
                    Закрыть
                </button>
            </div>
        </div>
    );
};

export default EditModal;