import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().min(1),
    username: z.string().min(3, "Minimum 3 letters").max(20, "Maximum 20 letters"),
    password: z.string().min(3, "Minimum 3 letters"),
});

export const loginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string()
});