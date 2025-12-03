import { z } from 'zod';

export const addToBasketSchema = z.object({
	courseId: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

export const removeFromBasketParamsSchema = z.object({
	courseId: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

