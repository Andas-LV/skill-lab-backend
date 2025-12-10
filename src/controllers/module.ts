import { Request, Response } from 'express';
import {
	getModulesList,
	createModule,
	updateModule,
	deleteModule,
} from '@/service/module';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function modulesListController(req: Request, res: Response) {
	const modules = await getModulesList();
	res.status(HTTP_STATUS.OK).json(modules);
}

export async function createModuleController(req: Request, res: Response) {
	const module = await createModule(req.body);
	res.status(HTTP_STATUS.CREATED).json(module);
}

export async function updateModuleController(req: Request, res: Response) {
	const moduleId = Number(req.params.id);
	const module = await updateModule(moduleId, req.body);
	res.status(HTTP_STATUS.OK).json(module);
}

export async function deleteModuleController(req: Request, res: Response) {
	const moduleId = Number(req.params.id);
	await deleteModule(moduleId);
	res.status(HTTP_STATUS.OK).json({ success: true });
}

