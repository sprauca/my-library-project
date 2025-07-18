import {Request, Response, NextFunction} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const ensureUser = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakId = (req as any).auth?.sub;
    const email = (req as any).auth?.content?.email;
    const username = (req as any).auth?.content?.preferred_username;

    if (!keycloakId) {
        return res.status(401).json({error: "Missing Keycloak ID"});
    }

    try {
        let user = await prisma.user.findUnique({
            where: {keycloakId},
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: email || `no-email-${keycloakId}@example.com`,
                    username,
                    keycloakId,
                    password: "",
                },
            });
        }

        (req as any).userId = user.id;
        next();
    } catch (e) {
        console.error("Error creating user:", e);
        res.status(500).json({error: "Error checking or creating user"});
    }
};