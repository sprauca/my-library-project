import Keycloak from 'keycloak-connect';
import session from 'express-session';
import {Express} from 'express';

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({store: memoryStore});

export const configureKeycloak = (app: Express) => {
    app.use(
        session({
            secret: '!LGDHRF&aLH5@!CG7aQLAnYf$sQPsn9d',
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
        })
    );

    app.use(keycloak.middleware());
    return keycloak;
};

export default keycloak;