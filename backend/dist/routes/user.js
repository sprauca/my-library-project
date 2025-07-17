"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const user_1 = require("../validators/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
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
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
        return res.status(404).json({ error: 'User not found' });
    // Exclude password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
});
// POST Create user (with validation)
router.post('/', async (req, res) => {
    const parsed = user_1.userSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, username, password } = parsed.data;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
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
    }
    catch (e) {
        res.status(400).json({ error: 'Email already used or invalid data' });
    }
});
// PUT Update user (with validation)
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = user_1.userUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, username, password } = parsed.data;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                username,
                ...(password && { password: await bcryptjs_1.default.hash(password, 10) }),
            },
        });
        res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username,
            createdAt: updatedUser.createdAt,
        });
    }
    catch (e) {
        res.status(404).json({ error: 'User not found or invalid data' });
    }
});
// DELETE user
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).end();
    }
    catch (e) {
        res.status(404).json({ error: 'User not found' });
    }
});
exports.default = router;
