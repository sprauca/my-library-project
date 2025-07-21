import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { keycloak } from "../middlewares/keycloak";
import { requireAdmin } from "../middlewares/roles";

const router = Router();
const prisma = new PrismaClient();

router.use(keycloak.protect(), requireAdmin);

router.get("/users", async (_req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            keycloakId: true,
        },
        orderBy: {createdAt: "desc"},
    });
    res.json(users);
});

router.get("/stats", async (_req: Request, res: Response) => {
    const userCount = await prisma.user.count();
    const gameCount = await prisma.game.count();
    res.json({
        totalUsers: userCount, 
        totalGames: gameCount
    });
});

export default router;