import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import UserPanel from '../pages/UserPanel'
import HelperPanel from '../pages/HelperPanel'
import AdminPanel from '../pages/AdminPanel'
import { useAuth } from '../auth/useAuth'

export default function App() {
    const { user } = useAuth()

    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        )
    }

    if (user.role === 'admin' || user.isOwner) {
        return <AdminPanel />
    }

    if (user.role === 'helper') {
        return <HelperPanel />
    }

    return <UserPanel />
}
