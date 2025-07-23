import {Router} from 'express';
import {requireRole} from '../middlewares/roles';

const router = Router();

router.get("/admin", requireRole("admin"), (req, res) => {
    res.json({message: "Welcome Master 👑"});
});

export default router;