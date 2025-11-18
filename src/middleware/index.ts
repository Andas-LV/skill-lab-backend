import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '@/types/User';
import { prisma } from '@/lib/prisma';
import config from '@/config';

declare global {
	namespace Express {
		interface Request {
			user?: Partial<User>;
		}
	}
}

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(401).json({ error: 'No token provided' });
		}

		const decoded = jwt.verify(token, config.jwt_key) as JwtPayload;
		if (!decoded.userId) {
			return res.status(401).json({ error: 'Invalid token payload' });
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId as number },
		});

		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		req.user = {
			id: user.id,
			email: user.email,
			username: user.username,
		};

		next();
	} catch (error) {
		return res.status(401).json({ error: 'Invalid token' });
	}
};
