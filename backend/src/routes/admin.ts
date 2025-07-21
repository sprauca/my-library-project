import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { keycloak } from "../middlewares/keycloak";
import { requireAdmin } from "../middlewares/roles";

const prisma = new PrismaClient();
const router = Router();

router.use(keycloak.protect("realm:admin"));

router.get("/", requireAdmin, async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
            },
        });

        const userCount = users.length;
        const gameCount = await prisma.game.count();
        res.json({
            stats: {
                totalUsers: userCount,
                totalGames: gameCount,
            },
            users,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Server error fetching admin data." });
    }
});

export default router;