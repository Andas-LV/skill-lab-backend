import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '@/utils/errors';
import { HTTP_STATUS } from '@/utils/httpStatus';
import config from '@/config';

export const errorHandler = (
	err: Error | AppError,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof ZodError) {
		return res.status(HTTP_STATUS.BAD_REQUEST).json({
			error: 'Validation error',
			details: err.errors.map((e) => ({
				path: e.path.join('.'),
				message: e.message,
			})),
		});
	}

	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			error: err.message,
		});
	}

	// Log unexpected errors
	console.error('Unexpected error:', err);

	return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
		error:
			config.nodeEnv === 'production'
				? 'Internal server error'
				: err.message,
	});
};

