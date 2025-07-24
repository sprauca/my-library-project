import { useEffect, useState, type ReactNode } from "react";
import keycloak from "../lib/keycloak";
import AuthContext from "../context/AuthContext";

let keycloakInitialized = false;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [initialized, setInitialized] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (keycloakInitialized) return;
        keycloakInitialized = true;

        keycloak
            .init({
                onLoad: "check-sso",
                pkceMethod: "S256",
                silentCheckSsoRedirectUri:
                    window.location.origin + "/silent-check-sso.html",
            })
            .then((auth) => {
                setAuthenticated(auth);
                setInitialized(true);

                const interval = setInterval(() => {
                    keycloak.updateToken(60).catch(() => {
                        keycloak.logout({
                            redirectUri: window.location.origin,
                        });
                    });
                }, 10000);

                return () => clearInterval(interval);
            })
            .catch(() => {
                setAuthenticated(false);
                setInitialized(true);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ keycloak, authenticated, initialized }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
