import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import RatingPage from './pages/RatingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import HelperDashboard from './pages/HelperDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { useAuth } from './hooks/useAuth'

function App() {
    const { user } = useAuth()

    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/rating" element={<RatingPage />} />
                    {user && (
                        <>
                            <Route path="/dashboard" element={
                                user.role === 'admin' || user.hidden_role === 'owner' ? <AdminDashboard /> :
                                    user.role === 'teacher' ? <TeacherDashboard /> :
                                        user.role === 'helper' ? <HelperDashboard /> :
                                            <UserDashboard />
                            } />
                        </>
                    )}
                </Routes>
            </main>
        </>
    )
}

export default App