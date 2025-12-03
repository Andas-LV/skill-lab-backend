import { z } from 'zod';

export const courseIdParamsSchema = z.object({
	id: z.coerce
		.number()
		.int('Course ID must be an integer')
		.positive('Course ID must be a positive integer'),
});

