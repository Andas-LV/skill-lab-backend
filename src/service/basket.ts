import { prisma } from '@/lib/prisma';
import { NotFoundError, ConflictError } from '@/utils/errors';
import { CourseListItem } from '@/types/Course';

export async function getBasketItems(userId: number): Promise<CourseListItem[]> {
	const basketItems = await prisma.basketItem.findMany({
		where: { userId },
		include: {
			course: {
				select: {
					id: true,
					title: true,
					image: true,
					modulesCount: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});

	return basketItems.map((item) => item.course);
}

export async function addToBasket(userId: number, courseId: number) {
	// Проверяем существование курса
	const course = await prisma.course.findUnique({
		where: { id: courseId },
	});

	if (!course) {
		throw new NotFoundError('Course not found');
	}

	// Проверяем, не добавлен ли уже курс в корзину
	const existingItem = await prisma.basketItem.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	if (existingItem) {
		throw new ConflictError('Course already in basket');
	}

	const basketItem = await prisma.basketItem.create({
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
					modulesCount: true,
				},
			},
		},
	});

	return basketItem.course;
}

export async function removeFromBasket(userId: number, courseId: number) {
	const basketItem = await prisma.basketItem.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	if (!basketItem) {
		throw new NotFoundError('Course not found in basket');
	}

	await prisma.basketItem.delete({
		where: {
			userId_courseId: {
				userId,
				courseId,
			},
		},
	});

	return { success: true };
}

export async function clearBasket(userId: number) {
	await prisma.basketItem.deleteMany({
		where: { userId },
	});

	return { success: true };
}


