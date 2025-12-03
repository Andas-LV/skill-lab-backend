import { Request, Response } from 'express';
import { getCoursesList, getCourseById } from '@/service/course';
import { NotFoundError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';

export async function coursesListController(req: Request, res: Response) {
	const courses = await getCoursesList();
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