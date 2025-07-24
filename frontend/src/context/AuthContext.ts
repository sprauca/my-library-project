import {createContext} from "react";
import type Keycloak from "keycloak-js";

type AuthContextType = {
  keycloak: Keycloak;
  initialized: boolean;
  authenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;