// client/src/pages/AdminDashboard.tsx

import React, { useState } from 'react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Иванов Иван",
            class: "9А",
            rating: 85,
            complaints: ["Кричал на уроке", "Бегал по коридору"]
        },
        {
            id: 2,
            name: "Петрова Мария",
            class: "9А",
            rating: 92,
            complaints: []
        },
        {
            id: 3,
            name: "Сидоров Сидор",
            class: "9А",
            rating: 70,
            complaints: ["Не сделал домашку", "Опоздал на урок"]
        }
    ]);

    const handleRatingChange = async (userId: number, value: number) => {
        // Временно просто обновляем локально
        setUsers(users.map(u => u.id === userId ? { ...u, rating: u.rating + value } : u));
    };

    return (
        <div className="dashboard-container">
            <h2>Админ-панель</h2>
            {users.length > 0 ? (
                users.map(user => (
                    <div key={user.id} className="user-card">
                        <div>
                            <h3>{user.name}</h3>
                            <p>Класс: {user.class}</p>
                            <p>Рейтинг: <span className="rating">{user.rating}</span></p>
                            {user.complaints && user.complaints.length > 0 && (
                                <span className="complaint-badge">Есть жалобы</span>
                            )}
                        </div>
                        <div className="slider-container">
                            <input
                                type="range"
                                min="-10"
                                max="10"
                                step="1"
                                onChange={(e) => handleRatingChange(user.id, parseInt(e.target.value))}
                            />
                            <button onClick={() => handleRatingChange(user.id, parseInt((document.activeElement as HTMLInputElement).value) || 0)}>
                                Изменить
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <p>Нет пользователей для отображения.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;