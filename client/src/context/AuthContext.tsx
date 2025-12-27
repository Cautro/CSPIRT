import { createContext, useContext, useState } from 'react'

interface AuthContextType {
    token: string | null
    role: string | null
    login: (t: string, r: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'))

    const login = (t: string, r: string) => {
        setToken(t)
        setRole(r)
        localStorage.setItem('token', t)
        localStorage.setItem('role', r)
    }

    const logout = () => {
        setToken(null)
        setRole(null)
        localStorage.clear()
    }

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth outside provider')
    return ctx
}
