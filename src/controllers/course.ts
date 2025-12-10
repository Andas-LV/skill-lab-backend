import { Request, Response } from 'express';
import {
	getCoursesList,
	getCourseById,
	createCourse,
} from '@/service/course';
import { NotFoundError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function coursesListController(req: Request, res: Response) {
	const userId = req.user?.id;
	const userRole = req.user?.role;
	const category = req.query.category as
		| 'ALL'
		| 'FRONTEND'
		| 'MOBILE'
		| 'BACKEND'
		| 'DESIGN'
		| undefined;
	const courses = await getCoursesList(userId, userRole, category);
	res.status(HTTP_STATUS.OK).json(courses);
}

export async function courseByIdController(req: Request, res: Response) {
	const courseId = req.params.id as unknown as number;
	const course = await getCourseById(courseId);
	if (!course) {
		throw new NotFoundError('Course not found');
	}
	res.status(HTTP_STATUS.OK).json(course);
}

export async function createCourseController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new Error('User ID is missing');
	}

	const course = await createCourse(req.user.id, req.body);
	res.status(HTTP_STATUS.CREATED).json(course);
}