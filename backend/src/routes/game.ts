import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { authenticate, AuthRequest } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

const gameSchema = z.object({
    title: z.string().min(1),
    platform: z.string().min(1),
    status: z.enum(["installed", "not installed", "in_progress", "completed"]),
    sourceUrl: z.string().url().optional(),
});

router.use(authenticate);

router.post("/", async (req:AuthRequest, res) => {
    const parse = gameSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({error: parse.error.flatten().fieldErrors});
    }

    const { title, platform, status, sourceUrl } = req.body;

    const game = await prisma.game.create({
        data: {
            title,
            platform,
            status,
            sourceUrl,
            userId: req.user.userId,
        },
    });
})

router.get("/", async (req: AuthRequest, res) => {
    const games = await prisma.game.findMany({
        where: {userId: req.user.userId},
        orderBy: {createdAt: "desc"},
    });
    res.json(games);
});

router.put("/:id", async (req: AuthRequest, res) => {
    const gameId = parseInt(req.params.id);
    const parse = gameSchema.safeParse(req.body);

    if (!parse.success) {
       return res.status(400).json({error: parse.error.flatten().fieldErrors});
    }

    const updated = await prisma.game.updateMany({
        where: {id: gameId, userId: req.user.userId},
        data: parse.data,
    });

    if (updated.count === 0) {
        return res.json({error: "Game not found or not owned by user."});
    }

    res.json({message: "Game updated successfully."});
});

router.delete("/:id", async (req: AuthRequest, res) => {
    const gameId = parseInt(req.params.id);

    const deleted = await prisma.game.deleteMany({
        where: {id: gameId, userId: req.user.userId},
    });

    if (deleted.count === 0) {
        return res.status(404).json({error: "Game not found or not owned by user."});
    }

    res.json({message: "Game deleted successfully."});
});

export default router;