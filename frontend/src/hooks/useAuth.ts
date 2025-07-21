import { useEffect, useState } from "react";
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "my-library-project",
    clientId: "frontend",
});

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        keycloak
            .init({onLoad: "login-required"})
            .then(auth => {
                setAuthenticated(auth);
                setIsLoading(false);
            })
            .catch(() => {
                setAuthenticated(false);
                setIsLoading(false);
            });
    }, []);

    return {keycloak, authenticated, isLoading};
};

export default useAuth;