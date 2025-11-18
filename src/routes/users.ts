import {NextFunction, Request, Response, Router} from 'express';
import { authenticateToken } from '@/middleware';
import { getUserMe, updateUserMe, } from "@/controllers/users";

const router = Router();

router.use(async (req: Request, res: Response, next: NextFunction) => {
    await authenticateToken(req, res, next)
});

router.get('/me', async (req: Request, res: Response) => {
    await getUserMe(req, res)
});

router.patch('/me/update', async (req: Request, res: Response) => {
    await updateUserMe(req, res)
});

export const userRouter = router;
