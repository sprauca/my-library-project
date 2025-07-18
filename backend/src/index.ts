import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import Keycloak from 'keycloak-connect';

import userRoutes from './routes/user';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';

dotenv.config();

const app = express();

const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'secret sauce',
    resave: false,
    saveUninitialized: false,
    store: memoryStore
}));

const keycloak = new Keycloak(
    {store: memoryStore},
    {
        realm: process.env.KEYCLOAK_REALM || 'my-library-project',
        'auth-server-url': process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
        'ssl-required': 'external',
        resource: process.env.KEYCLOAK_CLIENT_ID || 'backend',
        'confidential-port': 0
    }
);

app.use(cors());
app.use(express.json());
app.use(keycloak.middleware());

app.use('/games', keycloak.protect(), gameRoutes);

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (_req, res) => {
    res.send('Welcome to the API backend!');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API backend running on http://localhost:${port}`);
});

export default app;