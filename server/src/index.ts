import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import complaintRoutes from './routes/complaints';

mongoose.connect(process.env.MONGO_URI!);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/complaints', complaintRoutes);

app.listen(5000, () => {
    console.log('Server running on 5000');
});
