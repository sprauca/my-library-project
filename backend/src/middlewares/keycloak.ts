import Keycloak from 'keycloak-connect';
import session from 'express-session';
import {Express} from 'express';
import dotenv from 'dotenv';

dotenv.config();

const memoryStore = new session.MemoryStore();

let keycloak: Keycloak.Keycloak;

export const configureKeycloak = (app: Express) => {
    app.use(
        session({
            secret: '!LGDHRF&aLH5@!CG7aQLAnYf$sQPsn9d',
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
        })
    );

    keycloak = new Keycloak(
        {store: memoryStore},
        {
            "auth-server-url": "http://localhost:8080",
            realm: "my-library-project",
            resource: "backend-client",
            credentials: {
                secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            },
            "ssl-required": "external",
            "confidential-port": 0,
        }
    );

    app.use(keycloak.middleware());
    return keycloak;
};

export {keycloak};