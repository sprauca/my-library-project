import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {configureKeycloak} from './middlewares/keycloak';
import gameRoutes from './routes/games';
import meRoutes from './routes/me'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const keycloak = configureKeycloak(app);

app.get('/', (_req, res) => res.send('🚀 Backend is running!'));

app.use('/games', keycloak.protect(), gameRoutes);
app.use('/me', meRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend is running at http://localhost:${port}`));