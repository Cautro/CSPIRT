import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import AdminPanel from '../pages/AdminPanel'
import { useAuth } from '../auth/AuthContext'
import Navbar from '../components/Navbar'

const App = () => {
    const { user } = useAuth()

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        )
    }

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}

export default App
