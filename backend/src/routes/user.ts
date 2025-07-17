import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { userSchema, userUpdateSchema } from "../validators/user";
import bcrypt from "bcryptjs";

const router = Router();
const prisma = new PrismaClient();

// GET all users
router.get('/', async (_req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            username: true,
            createdAt: true,
        }
    });
    res.json(users);
});

// GET user by id
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({where: {id}});

    if (!user) return res.status(404).json({error: 'User not found'});

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});

// POST Create user (with validation)
router.post('/', async (req, res) => {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({error: parsed.error.flatten().fieldErrors})
    }

    const {email, username, password} = parsed.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        });
    } catch (e) {
        res.status(400).json({error: 'Email already used or invalid data'});
    }
});

// PUT Update user (with validation)
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = userUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({error: parsed.error.flatten().fieldErrors})
    }

    const { email, username, password } = parsed.data;
    
    try {
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {
                email,
                username,
                ...(password && {password: await bcrypt.hash(password, 10)}),
            },
        });

        res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            createdAt: updatedUser.createdAt,
        });
    } catch (e) {
        res.status(404).json({error: 'User not found or invalid data'});
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.delete({where: {id}});
        res.status(204).end();
    } catch (e) {
        res.status(404).json({error: 'User not found'});
    }
});

export default router;