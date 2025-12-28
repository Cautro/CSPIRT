import React, { useState, useEffect } from 'react';
import { getLogs } from '../services/api';

const OwnerDashboard = () => {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getLogs();
                setLogs(data);
            } catch (err) {
                alert('Ошибка загрузки логов');
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="dashboard-container">
            <h2>Овнер-панель</h2>
            <h3>Логи изменений</h3>
            {logs.length > 0 ? (
                logs.map(log => (
                    <div key={log.id} className="log-entry">
                        <p>Пользователь {log.adminName} изменил рейтинг у {log.targetName} на {log.change}</p>
                        <small>{log.timestamp}</small>
                    </div>
                ))
            ) : (
                <p>Логов пока нет</p>
            )}
        </div>
    );
};

export default OwnerDashboard;