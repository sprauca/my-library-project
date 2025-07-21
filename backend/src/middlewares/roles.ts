import {Request, Response, NextFunction} from 'express';

interface KeycloakRequest extends Request {
    kauth?: {
        grant?: {
            access_token?: {
                content?: {
                    realm_access?: {
                        roles?: string[];
                    };
                };
            };
        };
    };
}

const getRoles = (req: KeycloakRequest): string[] => {
    return req.kauth?.grant?.access_token?.content?.realm_access?.roles || [];
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const roles = getRoles(req);
    if (!roles.includes("admin")) {
        return res.status(403).json({error: "Access denied. You must be an admin."});
    }
    next();
};

export const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const roles = getRoles(req);
    if (!roles.includes("user")) {
        return res.status(403).json({error: "Access denied. You must be a user."});
    }
    next();
};