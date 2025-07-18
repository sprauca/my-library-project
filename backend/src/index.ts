import express from 'express';
import session from 'express-session';
import {keycloak, memoryStore} from './middlewares/keycloak';
import gameRoutes from './routes/game';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "change-this-secret",
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);

app.use(keycloak.middleware());

app.use(express.json());

app.use('/games', keycloak.protect(), gameRoutes);

app.get('/', (_req, res) => {
    res.send('Welcome to the API backend!');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API backend running on http://localhost:${port}`);
});

export default app;