import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
import {ensureUser} from '../middlewares/ensureUser';
import keycloak from '../middlewares/keycloak';

const prisma = new PrismaClient();
const router = Router();

router.get("/", keycloak.protect(), ensureUser, async (req, res) => {
    const keycloakId = (req as any).userId;

    const user = await prisma.user.findUnique({
        where: {keycloakId},
    });

    if (!user) return res.status(404).json({error: "User not found."});

    res.json(user);
});

export default router;