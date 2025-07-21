import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "my-library-project",
    clientId: "frontend",
});


type AuthContextType = {
    keycloak: Keycloak;
    authenticated: boolean;
    initialized: boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider = ({children} : {children: ReactNode}) => {
    const [initialized, setInitialised] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak
            .init({
                onLoad: 'check-sso', 
                pkceMethod: 'S256', 
                silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
            })
            .then(auth => {
                setAuthenticated(auth);
                setInitialised(true);

                const interval = setInterval(() => {
                    keycloak.updateToken(60).catch(() => {
                        keycloak.logout();
                    });
                }, 10000);

                return () => clearInterval(interval);
        })
            .catch(() => {
                setAuthenticated(false);
                setInitialised(true);
            });
    }, []);

    const logout = () => {
        keycloak.logout({redirectUri: window.location.origin});
    };

    return (
        <AuthContext.Provider value={{keycloak, authenticated, initialized, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};