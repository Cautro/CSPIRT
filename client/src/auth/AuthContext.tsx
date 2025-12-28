import { createContext, useContext, useState } from 'react'

type User = {
    id: string
    login: string
}

type AuthContextType = {
    user: User | null
    login: (login: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const login = async (login: string, password: string) => {
        // 🔴 ТЕСТОВЫЕ ДАННЫЕ
        if (login === 'admin' && password === '1234') {
            setUser({ id: '1', login })
        } else {
            throw new Error('Invalid credentials')
        }
    }

    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth outside provider')
    return ctx
}
