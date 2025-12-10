import { Request, Response } from 'express';
import { createModule } from '@/service/module';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function createModuleController(req: Request, res: Response) {
	const module = await createModule(req.body);
	res.status(HTTP_STATUS.CREATED).json(module);
}

