import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import { AuthProvider, useAuth } from './context/AuthContext'

function Protected({ children }: { children: JSX.Element }) {
    const { token } = useAuth()
    return token ? children : <Navigate to="/login" />
}

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Protected><Dashboard /></Protected>} />
                <Route path="/admin" element={<Protected><Admin /></Protected>} />
            </Routes>
        </AuthProvider>
    )
}
