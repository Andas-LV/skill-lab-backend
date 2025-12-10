import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { BadRequestError } from '@/utils/errors';

export const validateQuery =
	(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
		try {
			const parsed = schema.parse(req.query);
			(req as any).validatedQuery = parsed;
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
