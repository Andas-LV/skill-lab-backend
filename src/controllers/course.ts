import { Request, Response } from 'express';
import {
	getCoursesList,
	getCourseById,
	createCourse,
	updateCourse,
	deleteCourse,
} from '@/service/course';
import { NotFoundError, UnauthorizedError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';
import { Role } from '@/types/Role';
import { Category } from '@/types/Category';

export async function coursesListController(req: Request, res: Response) {
	const userId = req.user?.id;
	const userRole = req.user?.role as Role | undefined;
	const category = req.query.category as Category | undefined;
	const courses = await getCoursesList(userId, userRole, category);
	res.status(HTTP_STATUS.OK).json(courses);
}

export async function courseByIdController(req: Request, res: Response) {
	const courseId = Number(req.params.id);
	const course = await getCourseById(courseId);
	if (!course) {
		throw new NotFoundError('Course not found');
	}
	res.status(HTTP_STATUS.OK).json(course);
}

export async function createCourseController(req: Request, res: Response) {
	if (!req.user?.id) {
		throw new UnauthorizedError('User ID is missing');
	}

	const course = await createCourse(req.user.id, req.body);
	res.status(HTTP_STATUS.CREATED).json(course);
}

export async function updateCourseController(req: Request, res: Response) {
	if (!req.user?.id || !req.user?.role) {
		throw new UnauthorizedError('User ID or role is missing');
	}

	const courseId = Number(req.params.id);
	const course = await updateCourse(
		courseId,
		req.user.id,
		req.user.role as Role,
		req.body,
	);
	res.status(HTTP_STATUS.OK).json(course);
}

export async function deleteCourseController(req: Request, res: Response) {
	if (!req.user?.id || !req.user?.role) {
		throw new UnauthorizedError('User ID or role is missing');
	}

	const courseId = Number(req.params.id);
	await deleteCourse(courseId, req.user.id, req.user.role as Role);
	res.status(HTTP_STATUS.OK).json({ success: true });
}