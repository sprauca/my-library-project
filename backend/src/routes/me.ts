import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ensureUser } from "../middlewares/ensureUser";

const prisma = new PrismaClient();
const router = Router();

router.use(ensureUser);

router.get("/", async (req: Request, res: Response) => {
    const keycloakId = (req as any).userId;

    const user = await prisma.user.findUnique({
        where: { keycloakId },
    });

    if (!user) return res.status(404).json({ error: "User not found." });

    res.json(user);
});

export default router;
