import { Request, Response } from 'express';
import {
	getFavoriteCourses,
	addToFavorites,
	removeFromFavorites,
} from '@/service/favorites';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function getFavoritesController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const favorites = await getFavoriteCourses(req.user.id);
	res.status(HTTP_STATUS.OK).json(favorites);
}

export async function addToFavoritesController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const courseId = req.body.courseId as unknown as number;
	const course = await addToFavorites(req.user.id, courseId);
	res.status(HTTP_STATUS.CREATED).json(course);
}

export async function removeFromFavoritesController(
	req: Request,
	res: Response,
) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const courseId = req.params.courseId as unknown as number;
	await removeFromFavorites(req.user.id, courseId);
	res.status(HTTP_STATUS.OK).json({ success: true });
}


