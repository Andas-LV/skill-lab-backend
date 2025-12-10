import { z } from 'zod';

export const createModuleSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	children: z.array(z.string()).default([]),
});

export const updateModuleSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	children: z.array(z.string()).optional(),
});

export const moduleIdParamsSchema = z.object({
	id: z.coerce
		.number()
		.int('Module ID must be an integer')
		.positive('Module ID must be a positive integer'),
});

