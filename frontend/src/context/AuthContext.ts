import {createContext} from "react";
import type {KeycloakInstance} from "keycloak-js";

type AuthContextType = {
  keycloak: KeycloakInstance;
  initialized: boolean;
  authenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;