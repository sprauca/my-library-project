import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from 'zod';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import {verifyToken, AuthRequest} from '../middleware/verifToken';

dotenv.config();

const router = Router();
const prisma = new PrismaClient();

const loginSchema = z.object({
    identifier: z.string().min(2),
    password: z.string().min(1),
});

router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }

    const { identifier, password } = parsed.data;

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier},
                    { username: identifier },
                ],
            },
        });
        if (!user) return res.status(401).json({ error: "Invalid identifier" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET!,
            {expiresIn: '7d'}
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
            }
        });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/me', verifyToken, async (req: AuthRequest, res) => {
    const user = await prisma.user.findUnique({
        where: {id: req.user?.id},
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true
        }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

export default router;