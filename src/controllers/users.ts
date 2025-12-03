import { Request, Response } from 'express';
import {
	fetchUserById,
	checkUserExists,
	updateUser,
} from '@/service/users';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function getUserMe(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const user = await fetchUserById(req.user.id);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	res.status(HTTP_STATUS.OK).json(user);
}

export async function updateUserMe(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const { username, email } = req.body;

	if (email || username) {
		const existingUser = await checkUserExists({
			email,
			username,
			excludeUserId: req.user.id,
		});

		if (existingUser) {
			throw new ConflictError('Email or username already taken');
		}
	}

	const updatedUser = await updateUser(req.user.id, {
		...(username && { username }),
		...(email && { email }),
	});

	res.status(HTTP_STATUS.OK).json(updatedUser);
}

