import { Request, Response } from 'express';
import { registerUser, loginUser } from '@/service/auth';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function registerController(req: Request, res: Response) {
	const { token, user } = await registerUser(req.body);
	res.status(HTTP_STATUS.CREATED).json({ token, user });
}

export async function loginController(req: Request, res: Response) {
	const { token, user } = await loginUser(req.body);
	res.status(HTTP_STATUS.OK).json({ token, user });
}
