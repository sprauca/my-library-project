import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import keycloak from "../middlewares/keycloak";
import ensureUser from "../middlewares/ensureUser";
import { Request } from "express";

const router = Router();
const prisma = new PrismaClient();

const gameSchema = z.object({
    title: z.string().min(1),
    platform: z.string().min(1),
    status: z.enum(["installed", "not installed", "in_progress", "completed"]),
    sourceUrl: z.string().url().optional(),
});

router.use(keycloak.protect(), ensureUser());

router.post("/", async (req: Request, res) => {
    const parse = gameSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({error: parse.error.flatten().fieldErrors});
    }

    const { title, platform, status, sourceUrl } = req.body;
    const keycloakId = (req as any).userId;

    try {
        const game = await prisma.game.create({
            data: {
                title,
                platform,
                status,
                sourceUrl,
                userId: (req as any).userId,
            },
        });
        res.status(201).json(game);
    } catch (e) {
        res.status(500).json({error: "Failed to create game."});
    }
});

router.get("/", async (req: Request, res) => {
    const keycloakId = (req as any).userId;

    const games = await prisma.game.findMany({
        where: {userId: keycloakId},
        orderBy: {createdAt: "desc"},
    });

    res.json(games);
});

router.put("/:id", async (req: Request, res) => {
    const keycloakId = (req as any).userId;
    const gameId = parseInt(req.params.id);

    const parsed = gameSchema.safeParse(req.body);
    if (!parsed.success) {
       return res.status(400).json({error: parsed.error.flatten().fieldErrors});
    }

    const updated = await prisma.game.updateMany({
        where: {id: gameId, userId: keycloakId},
        data: parsed.data,
    });

    if (updated.count === 0) {
        return res.status(404).json({error: "Game not found or not owned by user."});
    }

    res.json({message: "Game updated successfully."});
});

router.delete("/:id", async (req: Request, res) => {
    const keycloakId = (req as any).userId;
    const gameId = parseInt(req.params.id);

    const deleted = await prisma.game.deleteMany({
        where: {id: gameId, userId: keycloakId},
    });

    if (deleted.count === 0) {
        return res.status(404).json({error: "Game not found or not owned by user."});
    }

    res.json({message: "Game deleted successfully."});
});

export default router;