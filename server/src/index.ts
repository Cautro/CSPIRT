import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'; // импортируем маршрут auth

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

// Подключаем маршрут auth по префиксу /api/auth
app.use('/api/auth', authRoutes);

// Обработчик 404 для остальных маршрутов
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});