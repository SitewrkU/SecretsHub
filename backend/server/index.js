import express from 'express'
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

import authRoutes from './routers/authRoutes.js';
import secretRoutes from './routers/secretRoutes.js';
import protect from './middleware/authMiddleware.js';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/secrets', secretRoutes);

app.get('/api/profile', protect, (req, res) => {
  res.json({ 
    message: "Доступ до профілю успішний.",
    user: req.user 
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`| Сервер запущено на http://localhost:${PORT}`);
});