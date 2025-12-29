import axios from 'axios';

export const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use(config => {
    // НЕ добавляем токен к запросу логина
    if (config.url === '/auth/login') {
        return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});