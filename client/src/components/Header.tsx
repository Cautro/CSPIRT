import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'  // относительный путь

const Header: React.FC = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header>
            <div className="container">
                <h1>
                    <Link to="/">CSPIRT</Link>
                </h1>
                <nav>
                    <Link to="/">Главная</Link>
                    <Link to="/rating">Рейтинг</Link>

                    {user ? (
                        <>
              <span style={{ marginLeft: '30px', fontWeight: 'bold' }}>
                Привет, {user.username} ({user.role}{user.hidden_role === 'owner' ? ' / owner' : ''})
              </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    marginLeft: '20px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    textDecoration: 'underline',
                                }}
                            >
                                Выйти
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Вход</Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header