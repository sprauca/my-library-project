import {Request, Response, NextFunction} from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export const ensureUser = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakId = (req as any).kauth?.grant?.access_token?.content?.sub;

    if (!keycloakId) return res.status(401).json({error: "Missing Keycloak ID"});

    const user = await prisma.user.upsert({
        where: {keycloakId},
        update: {},
        create: {keycloakId, email: `${keycloakId}@placeholder.com`},
    });

    (req as any).userId = user.keycloakId;
    next();
};