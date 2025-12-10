import { z } from 'zod';

export const createModuleSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	children: z.array(z.string()).default([]),
});

