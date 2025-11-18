import { z } from 'zod';
import { registerSchema, loginSchema } from '@/schemas/auth';
import { registerUser, loginUser } from '@/service/auth';
import {Request, Response} from "express";

export async function registerController(req: Request, res: Response) {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { token, user } = await registerUser(validatedData);
        res.json({ token, user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        if (error instanceof Error && error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function loginController(req: Request, res: Response) {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { token, user } = await loginUser(validatedData);
        res.json({ token, user });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
