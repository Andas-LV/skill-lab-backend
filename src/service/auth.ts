import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import config from '@/config';
import { Login, Register } from '@/types/User';

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
		throw new Error('User already exists');
	}

	const hashedPassword = await bcrypt.hash(validatedData.password, 10);

	const user = await prisma.user.create({
		data: {
			email: validatedData.email,
			username: validatedData.username,
			password: hashedPassword,
		},
	});

	const token = jwt.sign({ userId: user.id }, config.jwt_key, {
		expiresIn: '10d',
	});

	return { token, user };
}

export async function loginUser(validatedData: Login) {
	const user = await prisma.user.findUnique({
		where: { username: validatedData.username },
	});

	if (!user) {
		throw new Error('Invalid credentials');
	}

	const validPassword = await bcrypt.compare(
		validatedData.password,
		user.password,
	);
	if (!validPassword) {
		throw new Error('Invalid credentials');
	}

	const token = jwt.sign({ userId: user.id }, config.jwt_key, {
		expiresIn: '10d',
	});

	return { token, user };
}
