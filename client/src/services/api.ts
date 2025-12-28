import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const login = async (username: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // <-- важно: возвращаем .data
    } catch (error) {
        throw error;
    }
};

export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const updateRating = async (userId: number, value: number) => {
    await api.post('/admin/update-rating', { userId, value });
};

export const sendComplaint = async (targetId: number, message: string) => {
    await api.post('/complaints/send', { targetId, message });
};

export const getLogs = async () => {
    const response = await api.get('/logs');
    return response.data;
};

export default api;