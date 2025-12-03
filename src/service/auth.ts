import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import config from '@/config';
import { ConflictError, UnauthorizedError } from '@/utils/errors';
import { Login, Register } from '@/types/User';

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES_IN = '10d';

export async function registerUser(validatedData: Register) {
	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [
				{ email: validatedData.email },
				{ username: validatedData.username },
			],
		},
	});

	if (existingUser) {
		throw new ConflictError('User already exists');
	}

	const hashedPassword = await bcrypt.hash(
		validatedData.password,
		BCRYPT_ROUNDS,
	);

	const user = await prisma.user.create({
		data: {
			email: validatedData.email,
			username: validatedData.username,
			password: hashedPassword,
		},
		select: {
			id: true,
			email: true,
			username: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	const token = jwt.sign({ userId: user.id }, config.jwt_key, {
		expiresIn: JWT_EXPIRES_IN,
	});

	return { token, user };
}

export async function loginUser(validatedData: Login) {
	const user = await prisma.user.findUnique({
		where: { username: validatedData.username },
	});

	if (!user) {
		throw new UnauthorizedError('Invalid credentials');
	}

	const validPassword = await bcrypt.compare(
		validatedData.password,
		user.password,
	);

	if (!validPassword) {
		throw new UnauthorizedError('Invalid credentials');
	}

	const token = jwt.sign({ userId: user.id }, config.jwt_key, {
		expiresIn: JWT_EXPIRES_IN,
	});

	return {
		token,
		user: {
			id: user.id,
			email: user.email,
			username: user.username,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		},
	};
}
