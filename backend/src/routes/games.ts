import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ensureUser } from "../middlewares/ensureUser";

const router = Router();
const prisma = new PrismaClient();

const gameSchema = z.object({
    title: z.string().min(1),
    platform: z.string().min(1),
    status: z.enum(["installed", "not installed", "in_progress", "completed"]),
    sourceUrl: z.string().url().optional(),
});

router.use(ensureUser);

router.post("/", async (req: Request, res: Response) => {
    const result = gameSchema.safeParse(req.body);
    if (!result.success) {
        return res
            .status(400)
            .json({ error: result.error.flatten().fieldErrors });
    }

    const game = await prisma.game.create({
        data: {
            ...result.data,
            userId: (req as any).userId,
        },
    });

    res.status(201).json(game);
});

router.get("/", async (_req: Request, res: Response) => {
    const userId = (_req as any).userId;
    const games = await prisma.game.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    res.json(games);
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const result = gameSchema.safeParse(req.body);

    if (!result.success) {
        return res
            .status(400)
            .json({ error: result.error.flatten().fieldErrors });
    }

    const updated = await prisma.game.updateMany({
        where: { id, userId: (req as any).userId },
        data: result.data,
    });

    if (updated.count === 0) {
        return res
            .status(404)
            .json({ error: "Game not found or unauthorized." });
    }

    res.json({ message: "Game updated successfully." });
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const deleted = await prisma.game.deleteMany({
        where: { id, userId: (req as any).userId },
    });

    if (deleted.count === 0) {
        return res
            .status(404)
            .json({ error: "Game not found or unauthorized." });
    }

    res.json({ message: "Game deleted successfully" });
});

export default router;
