import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const login = async (login: string, password: string) => {
    try {
        const response = await api.post('/auth/login', {
            login,
            password,
        });
        return response.data;
    } catch (error: any) {
        // Показываем ошибку, если не 200 OK
        console.error("Login error:", error.response?.data || error.message);
        throw error;
    }
};

export default api;