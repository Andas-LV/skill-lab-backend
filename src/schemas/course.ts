import { z } from 'zod';
import { Category } from '@/types/Category';

const categoryEnum = z.nativeEnum(Category);

export const courseIdParamsSchema = z.object({
	id: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

const questionOptionSchema = z.object({
	answerName: z.string().min(1, 'Answer name is required'),
	right: z.boolean(),
});

const questionSchema = z.object({
	title: z.string().min(1, 'Question title is required'),
	options: z
		.array(questionOptionSchema)
		.min(2, 'Question must have at least 2 options')
		.max(10, 'Question can have at most 10 options'),
});

export const createCourseSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	image: z.string().url('Image must be a valid URL').optional().nullable(),
	description: z.string().optional().nullable(),
	result: z.array(z.string()).default([]),
	link: z.string().url('Link must be a valid URL').optional().nullable(),
	price: z.coerce.number().int().min(0).default(0),
	category: categoryEnum.default(Category.ALL),
	moduleIds: z.array(z.coerce.number().int().positive()).default([]),
	questions: z.array(questionSchema).default([]),
});

export const updateCourseSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	image: z.string().url('Image must be a valid URL').optional().nullable(),
	description: z.string().optional().nullable(),
	result: z.array(z.string()).optional(),
	link: z.string().url('Link must be a valid URL').optional().nullable(),
	price: z.coerce.number().int().min(0).optional(),
	category: categoryEnum.optional(),
});

export const courseListQuerySchema = z.object({
	category: categoryEnum.optional(),
});

