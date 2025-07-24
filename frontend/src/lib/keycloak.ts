import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "my-library-project",
    clientId: "frontend-client",
});

export default keycloak;