import { prisma } from '@/lib/prisma';
import { CourseListItem, CourseFullInfo, Module } from '@/types/Course';
import { z } from 'zod';
import { createCourseSchema } from '@/schemas/course';

export async function getCoursesList(
	userId?: number,
	userRole?: 'ADMIN' | 'USER' | 'TEACHER',
	category?: 'ALL' | 'FRONTEND' | 'MOBILE' | 'BACKEND' | 'DESIGN',
): Promise<CourseListItem[]> {
	const where: any = {};

	if (userRole === 'TEACHER' && userId) {
		where.creatorId = userId;
	}

	if (category && category !== 'ALL') {
		where.category = category;
	}

	const courses = await prisma.course.findMany({
		where,
		select: {
			id: true,
			title: true,
			image: true,
			price: true,
			category: true,
			modules: {
				select: {
					id: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});

	return courses.map((course) => ({
		id: course.id,
		title: course.title,
		image: course.image,
		price: course.price,
		category: course.category,
		modulesCount: course.modules.length,
	}));
}

export async function getCourseById(
	id: number,
): Promise<CourseFullInfo | null> {
	const course = await prisma.course.findUnique({
		where: { id },
		include: {
			modules: {
				include: {
					module: {
						select: {
							id: true,
							title: true,
							children: true,
						},
					},
				},
				orderBy: { id: 'asc' },
			},
			creator: {
				select: {
					id: true,
					username: true,
					email: true,
				},
			},
		},
	});

	if (!course) {
		return null;
	}

	return {
		id: course.id,
		title: course.title,
		image: course.image,
		modulesCount: course.modules.length,
		description: course.description,
		result: course.result,
		link: course.link,
		createdAt: course.createdAt,
		updatedAt: course.updatedAt,
		modules: course.modules.map((cm: { module: Module }) => cm.module),
		creator: {
			id: course.creator.id,
			username: course.creator.username,
			email: course.creator.email,
		},
	};
}

export async function createCourse(
	creatorId: number,
	data: z.infer<typeof createCourseSchema>,
): Promise<CourseListItem> {
	const course = await prisma.$transaction(async (tx) => {
		const createdCourse = await tx.course.create({
			data: {
				title: data.title,
				image: data.image ?? null,
				description: data.description ?? null,
				result: data.result,
				link: data.link ?? null,
				price: data.price,
				category: data.category,
				creatorId,
			},
		});

		if (data.moduleIds.length > 0) {
			await tx.courseModule.createMany({
				data: data.moduleIds.map((moduleId) => ({
					courseId: createdCourse.id,
					moduleId,
				})),
				skipDuplicates: true,
			});
		}

		const courseWithModules = await tx.course.findUnique({
			where: { id: createdCourse.id },
			include: {
				modules: {
					select: {
						id: true,
					},
				},
			},
		});

		return courseWithModules!;
	});

	return {
		id: course.id,
		title: course.title,
		image: course.image,
		modulesCount: course.modules.length,
	};
}
