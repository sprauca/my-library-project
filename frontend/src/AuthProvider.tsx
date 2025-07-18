import React, { createContext, useState, useEffect, ReactNode } from "react";
import Keycloak from "keycloak-js";

type AuthContextType = {
    keycloak: Keycloak | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const keycloak = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "my-library-project",
    clientId: "frontend",
});

export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        keycloak.init({onLoad: 'check-sso', pkceMethod: 'S256'}).then((auth) => {
            setIsAuthenticated(auth);
        });
    }, []);

    const login = () => keycloak.login();
    const logout = () => keycloak.logout();

    return (
        <AuthContext.Provider value={{keycloak, isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};