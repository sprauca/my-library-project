import Keycloak from "keycloak-connect";
import session from "express-session";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, {
    clientId: "backend-client",
    bearerOnly: "true",
    serverUrl: "http://localhost:8080",
    realm: "my-library-project",
    credentials: {
        secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    },
} as any);

export function configureKeycloak(app: Express) {
    app.use(
        session({
            secret: "!LGDHRF&aLH5@!CG7aQLAnYf$sQPsn9d",
            resave: false,
            saveUninitialized: true,
            store: memoryStore,
        })
    );
    app.use(keycloak.middleware());
    return keycloak;
}
