import React from 'react';
import '../styles/index.css'

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.login) {
        // Если пользователь не залогинен — перенаправляем на /
        window.location.href = '/';
        return null;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Панель управления</h1>
            <p>Привет, {user.name} ({user.role})!</p>
            <p>Твой класс: {user.class}</p>
            <button onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
            }}>
                Выйти
            </button>
        </div>
    );
};

export default Dashboard;