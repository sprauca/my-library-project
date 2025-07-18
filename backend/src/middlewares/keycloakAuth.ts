import { expressjwt } from "express-jwt";
import JwksRsa from "jwks-rsa";
import { Request } from "express";

export const keycloakAuth = expressjwt({
    secret: JwksRsa.expressJwtSecret({
        jwksUri: "http://localhost:8080/auth/realms/my-library-project/protocol/openid-connect/certs",
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
    }),
    algorithms: ["RS256"],
    credentialsRequired:true,

    getToken: (req: Request) => {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1];
        }
        return null;
    },
});