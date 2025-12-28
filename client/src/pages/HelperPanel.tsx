import React, { useState, useEffect } from 'react';
import { getUser, sendComplaint } from '../api/api';

const HelperPanel = () => {
    const [user, setUser] = useState<any>(null);
    const [complaint, setComplaint] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user')!);
        setUser(userData);
    }, []);

    const handleSendComplaint = async () => {
        if (!complaint.trim()) return;
        try {
            await sendComplaint(user.id, complaint);
            alert('Жалоба отправлена!');
            setComplaint('');
        } catch (err) {
            alert('Ошибка при отправке жалобы');
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Профиль хелпера</h2>
            <div className="user-card">
                <div>
                    <h3>{user?.name}</h3>
                    <p>Класс: {user?.class}</p>
                    <p>Рейтинг: {user?.rating || 0}</p>
                </div>
            </div>

            <div className="complaint-form">
                <h3>Отправить заметку (для админов)</h3>
                <textarea
                    placeholder="Опишите поведение ученика"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                />
                <button onClick={handleSendComplaint}>Отправить</button>
            </div>
        </div>
    );
};

export default HelperPanel;