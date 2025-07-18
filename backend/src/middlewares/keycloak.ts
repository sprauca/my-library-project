import session from "express-session";
import { Keycloak } from "keycloak-connect";
import { Express } from "express";

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({store: memoryStore});

export { keycloak, memoryStore };