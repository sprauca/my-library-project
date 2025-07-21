import Keycloak from "keycloak-connect";
import session from "express-session";
import { Express } from "express";


const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({store: memoryStore});

export { keycloak, memoryStore };