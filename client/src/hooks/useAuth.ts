import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface User {
    id: number
    username: string
    role: string
    hidden_role?: string
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                setUser(jwtDecode<User>(token))
            } catch {}
        }
    }, [])

    const login = (token: string) => {
        localStorage.setItem('token', token)
        setUser(jwtDecode<User>(token))
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return { user, login, logout }
}