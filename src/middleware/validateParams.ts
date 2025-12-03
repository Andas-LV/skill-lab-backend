import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '@/utils/errors';

export const validateParams =
	(schema: ZodSchema) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			req.params = schema.parse(req.params);
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

