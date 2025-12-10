import { z } from 'zod';

export const courseIdParamsSchema = z.object({
	id: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

export const createCourseSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	image: z.string().url('Image must be a valid URL').optional().nullable(),
	description: z.string().optional().nullable(),
	result: z.array(z.string()).default([]),
	link: z.string().url('Link must be a valid URL').optional().nullable(),
	price: z.coerce.number().int().min(0).default(0),
	category: z.enum(['ALL', 'FRONTEND', 'MOBILE', 'BACKEND', 'DESIGN']).default('ALL'),
	moduleIds: z.array(z.coerce.number().int().positive()).default([]),
});

export const courseListQuerySchema = z.object({
	category: z.enum(['ALL', 'FRONTEND', 'MOBILE', 'BACKEND', 'DESIGN']).optional(),
});

