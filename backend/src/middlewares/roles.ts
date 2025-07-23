import {Request, Response, NextFunction} from 'express';

export const requireRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const tokenContent = (req as any).kauth?.grant?.access_token?.content;

        if (!tokenContent || !tokenContent.realm_access?.roles?.include(role)) {
            return res.status(403).json({error: `Access denied: missing '${role}' role.`});
        }

        next();
    };
};