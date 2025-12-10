import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '@/lib/prisma';
import config from '@/config';
import { UnauthorizedError } from '@/utils/errors';
import { TRole } from '@/types/Role';

export interface AuthenticatedUser {
	id: number;
	email: string;
	username: string;
	role: TRole;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
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
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: null;

		if (!token) {
			throw new UnauthorizedError('No token provided');
		}

		const decoded = jwt.verify(token, config.jwt_key) as JwtPayload;
		if (!decoded.userId || typeof decoded.userId !== 'number') {
			throw new UnauthorizedError('Invalid token payload');
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		});

		if (!user) {
			throw new UnauthorizedError('User not found');
		}

		req.user = {
			id: user.id,
			email: user.email,
			username: user.username,
			role: user.role as TRole,
		};
		next();
	} catch (error) {
		if (error instanceof UnauthorizedError) {
			return next(error);
		}
		next(new UnauthorizedError('Invalid token'));
	}
};

export const optionalAuthenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader?.startsWith('Bearer ')
			? authHeader.split(' ')[1]
			: null;

		if (!token) {
			return next();
		}

		const decoded = jwt.verify(token, config.jwt_key) as JwtPayload;
		if (!decoded.userId || typeof decoded.userId !== 'number') {
			return next();
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		});

		if (user) {
			req.user = {
				id: user.id,
				email: user.email,
				username: user.username,
				role: user.role as TRole,
			};
		}

		next();
	} catch (error) {
		next();
	}
};
