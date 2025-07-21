import {Request, Response, NextFunction} from 'express';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const roles = (req as any).kauth?.grant?.access_token?.content?.realm_access?.roles;

    if (!roles.includes("admin")) {
        return res.status(401).json({error: "Access denied: admin role required."});
    }

    next();
};