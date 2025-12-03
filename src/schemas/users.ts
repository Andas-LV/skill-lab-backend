import { z } from 'zod';

export const updateUserSchema = z
	.object({
		email: z
			.string()
			.email('Invalid email format')
			.optional(),
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters')
			.max(20, 'Username must not exceed 20 characters')
			.regex(
				/^[a-zA-Z0-9_]+$/,
				'Username can only contain letters, numbers, and underscores',
			)
			.optional(),
	})
	.refine((data) => data.email || data.username, {
		message: 'At least one field (email or username) must be provided',
	});