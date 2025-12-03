import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '@/utils/errors';

export const validateRequest =
	(schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestError(
					`Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
				);
			}
			next(error);
		}
	};

