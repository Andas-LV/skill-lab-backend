import { z } from 'zod';

export const addToFavoritesSchema = z.object({
	courseId: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

export const removeFromFavoritesParamsSchema = z.object({
	courseId: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

