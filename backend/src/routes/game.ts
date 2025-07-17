import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { number, z } from "zod";
import { verify } from "jsonwebtoken";
import { error } from "console";

const router = Router();
const prisma = new PrismaClient();

const gameSchema = z.object({
    title: z.string().min(1),
    platform: z.string().min(1),
    status: z.enum(["installed", "not installed", "in_progress", "completed"]),
    sourceUrl: z.string().url().optional(),
});

router.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({error: "JWT secret is not defined."});
        }
        const decoded = verify(token, secret);
        if (typeof decoded !== "object" || !("userId" in decoded)) {
            return res.status(401).json({ error: "Invalid token." });
        }
        (req as any).userId = (decoded as {userId: number}).userId;
        next(); 
    } catch {
        res.status(401).json({ error: "Invalid token." });
    }
});

router.post("/", async (req, res) => {
    const userId = (req as any).userId;
    const { title, platform, status, sourceUrl } = req.body;

    if (!title || !platform || !status) {
        return res.status(400).json({error: "Missing required fields."});
    }

    const game = await prisma.game.create({
        data: {
            title,
            platform,
            status,
            sourceUrl,
            userId,
        },
    });
})

router.get("/", async (req, res) => {
    const userId = (req as any).userId;
    const games = await prisma.game.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"},
    });
    res.json(games);
});

router.put("/:id", async (req, res) => {
    const userId = (req as any).userId;
    const gameId = parseInt(req.params.id);
    const { title, platform, status, sourceUrl } = req.body;

    try {
        const updated = await prisma.game.updateMany({
            where: {id: gameId, userId},
            data: {title, platform, status, sourceUrl},
        });

        if (updated.count === 0) return res.status(404).json({error: "Game not found."});
    } catch {
        res.status(400).json({error: "Invalid data or game ID."});
    }
});

router.delete("/:id", async (req, res) => {
    const userId = (req as any).userId;
    const gameId = parseInt(req.params.id);

    try {
        const deleted = await prisma.game.deleteMany({
            where: {id: gameId, userId},
        });

        if (deleted.count === 0) return res.status(404).json({error: "Game not found."});
        res.json({message: "Game deleted successfully."});
    } catch {
        res.status(400).json({error: "Invalid game ID."});
    }
});

export default router;