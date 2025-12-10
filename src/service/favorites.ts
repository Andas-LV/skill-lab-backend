import { prisma } from '@/lib/prisma';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { CourseListItem } from '@/types/Course';

export async function getFavoriteCourses(
	userId: number,
): Promise<CourseListItem[]> {
	const favoriteItems = await prisma.favoriteCourse.findMany({
		where: { userId },
		include: {
			course: {
				select: {
					id: true,
					title: true,
					image: true,
					modules: {
						select: {
							id: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});

	return favoriteItems.map((item) => ({
		id: item.course.id,
		title: item.course.title,
		image: item.course.image,
		modulesCount: item.course.modules.length,
	}));
}

export async function addToFavorites(userId: number, courseId: number) {
	// Проверяем существование курса
	const course = await prisma.course.findUnique({
		where: { id: courseId },
	});

	if (!course) {
		throw new NotFoundError('Course not found');
	}

	// Проверяем, не добавлен ли уже курс в избранное
	const existingItem = await prisma.favoriteCourse.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	if (existingItem) {
		throw new ConflictError('Course already in favorites');
	}

	const favoriteItem = await prisma.favoriteCourse.create({
		data: {
			userId,
			courseId,
		},
		include: {
			course: {
				select: {
					id: true,
					title: true,
					image: true,
					modules: {
						select: {
							id: true,
						},
					},
				},
			},
		},
	});

	return {
		id: favoriteItem.course.id,
		title: favoriteItem.course.title,
		image: favoriteItem.course.image,
		modulesCount: favoriteItem.course.modules.length,
	};
}

export async function removeFromFavorites(userId: number, courseId: number) {
	const favoriteItem = await prisma.favoriteCourse.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	if (!favoriteItem) {
		throw new NotFoundError('Course not found in favorites');
	}

	await prisma.favoriteCourse.delete({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	return { success: true };
}


