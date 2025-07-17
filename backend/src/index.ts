import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/games', gameRoutes);

app.get('/', (_req, res) => {
    res.send('Welcome to the API backend!');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API backend running on http://localhost:${port}`);
});

export default app;