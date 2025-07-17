"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const verifToken_1 = require("../middleware/verifToken");
dotenv_1.default.config();
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const { email, password } = parsed.data;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid email" });
        const isValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ error: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
            }
        });
    }
    catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/me', verifToken_1.verifyToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
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
exports.default = router;
