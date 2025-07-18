import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080/auth",
    realm: "my-library-project",
    clientId: "frontend",
});

export default keycloak;