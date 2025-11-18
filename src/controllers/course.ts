import { Request, Response } from 'express';
import { getCoursesList, getCourseById } from '@/service/course';

export async function coursesListController(req: Request, res: Response) {
	try {
		const courses = await getCoursesList();
		res.json(courses);
	} catch (error) {
		console.error('Courses list error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}

export async function courseByIdController(req: Request, res: Response) {
	try {
		const id = Number(req.params.id);
		if (isNaN(id)) {
			return res.status(400).json({ error: 'Invalid course ID' });
		}

		const course = await getCourseById(id);
		if (!course) {
			return res.status(404).json({ error: 'Course not found' });
		}

		res.json(course );
	} catch (error) {
		console.error('Course by ID error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
}