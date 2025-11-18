import {
    fetchUserById,
    checkUserExists,
    updateUser,
} from '@/service/users';
import { Request, Response } from "express";

export async function getUserMe(req: Request, res: Response) {
    try {
        if (!req.user?.id) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const user = await fetchUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in /me endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function updateUserMe(req: Request, res: Response) {
    try {
        const { username, email } = req.body;

        if (!req.user?.id) {
            return res.status(400).json({ error: 'User ID or role is missing' });
        }

        if (email || username) {
            const existingUser = await checkUserExists({
                email,
                username,
                excludeUserId: req.user.id
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email or username already taken' });
            }
        }

        const updatedUser = await updateUser(
            req.user.id,
            {
                ...(username && { username }),
                ...(email && { email }),
            }
        );

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

