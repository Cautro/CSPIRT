// client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';

const App = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <Routes>
            <Route path="/" element={user.login ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={user.login ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
    );
};

export default App;