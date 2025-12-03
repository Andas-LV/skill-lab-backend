import { Request, Response } from 'express';
import {
	getBasketItems,
	addToBasket,
	removeFromBasket,
	clearBasket,
} from '@/service/basket';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function getBasketController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const items = await getBasketItems(req.user.id);
	res.status(HTTP_STATUS.OK).json(items);
}

export async function addToBasketController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const courseId = req.body.courseId as unknown as number;
	const course = await addToBasket(req.user.id, courseId);
	res.status(HTTP_STATUS.CREATED).json(course);
}

export async function removeFromBasketController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const courseId = req.params.courseId as unknown as number;
	await removeFromBasket(req.user.id, courseId);
	res.status(HTTP_STATUS.OK).json({ success: true });
}

export async function clearBasketController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	await clearBasket(req.user.id);
	res.status(HTTP_STATUS.OK).json({ success: true });
}


