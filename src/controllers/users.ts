import { Request, Response } from 'express';
import {
	fetchUserById,
	checkUserExists,
	updateUser,
	getAllUsers,
	updateUserRole,
	fetchUserByIdForAdmin,
} from '@/service/users';
import { NotFoundError, ConflictError, UnauthorizedError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';
import { Role } from '@/types/Role';

export async function getUserMe(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new UnauthorizedError('User ID is missing');
	}

	const user = await fetchUserById(req.user.id);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	res.status(HTTP_STATUS.OK).json(user);
}

export async function updateUserMe(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new UnauthorizedError('User ID is missing');
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

export async function getAllUsersController(req: Request, res: Response) {
	if (!req.user?.role || req.user.role !== Role.ADMIN) {
		throw new UnauthorizedError('Only admins can view all users');
	}

	const users = await getAllUsers();
	res.status(HTTP_STATUS.OK).json(users);
}

export async function changeUserRoleController(req: Request, res: Response) {
	// Check if the requesting user is an admin
	if (!req.user?.role || req.user.role !== Role.ADMIN) {
		throw new UnauthorizedError('Only admins can change user roles');
	}

	const userId = parseInt(req.params.userId, 10);
	if (isNaN(userId)) {
		throw new NotFoundError('Invalid user ID');
	}

	// Check if the target user exists
	const targetUser = await fetchUserById(userId);
	if (!targetUser) {
		throw new NotFoundError('User not found');
	}

	const { role } = req.body;

	// Update the user's role
	const updatedUser = await updateUserRole(userId, role as Role);

	res.status(HTTP_STATUS.OK).json(updatedUser);
}

export async function getUserByIdController(req: Request, res: Response) {
	// Check if the requesting user is an admin
	if (!req.user?.role || req.user.role !== Role.ADMIN) {
		throw new UnauthorizedError('Only admins can view user details');
	}

	const userId = parseInt(req.params.userId, 10);
	if (isNaN(userId)) {
		throw new NotFoundError('Invalid user ID');
	}

	// Fetch the user with favorite courses
	const user = await fetchUserByIdForAdmin(userId);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	res.status(HTTP_STATUS.OK).json(user);
}
