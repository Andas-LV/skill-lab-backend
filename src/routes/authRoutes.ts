import { Router } from 'express';
import { Request, Response } from "express";
import { registerController, loginController } from "@/controllers/auth";

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    await registerController(req, res)
});

router.post('/login', async (req: Request, res: Response) => {
    await loginController(req, res)
});

export const authRouter = router;
