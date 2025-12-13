import { User } from '@/types/User';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/Role';

export async function fetchUserById(userId: number) {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			updatedAt: true,
			basketItems: true,
			favoriteItems: true,
		},
	});
}

export async function getAllUsers() {
	return prisma.user.findMany({
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: { createdAt: 'desc' },
	});
}

export async function checkUserExists({
	email,
	username,
	excludeUserId,
}: {
	email?: string;
	username?: string;
	excludeUserId: number;
}) {
	return prisma.user.findFirst({
		where: {
			OR: [email ? { email } : {}, username ? { username } : {}],
			NOT: { id: excludeUserId },
		},
	});
}

export async function updateUser(userId: number, data: Partial<User>) {
	return prisma.user.update({
		where: { id: userId },
		data,
		select: {
			id: true,
			email: true,
			username: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function updateUserRole(userId: number, role: Role) {
	return prisma.user.update({
		where: { id: userId },
		data: { role },
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function fetchUserByIdForAdmin(userId: number) {
	return prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			email: true,
			username: true,
			role: true,
			createdAt: true,
			updatedAt: true,
			favoriteItems: {
				select: {
					id: true,
					courseId: true,
					createdAt: true,
					course: {
						select: {
							id: true,
							title: true,
							image: true,
							description: true,
							price: true,
							category: true,
							createdAt: true,
							updatedAt: true,
						},
					},
				},
			},
		},
	});
}
