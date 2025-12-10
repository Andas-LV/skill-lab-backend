import { prisma } from '@/lib/prisma';
import {
	CourseListItem,
	CourseFullInfo,
	Module,
	QuestionOption,
} from '@/types/Course';
import { Category, TCategory } from '@/types/Category';
import { Role, TRole } from '@/types/Role';
import { z } from 'zod';
import { createCourseSchema, updateCourseSchema } from '@/schemas/course';
import { NotFoundError, UnauthorizedError } from '@/utils/errors';

type CourseListWhere = {
	creatorId?: number;
	category?: TCategory;
};

export async function getCoursesList(
	userId?: number,
	userRole?: TRole,
	category?: TCategory,
): Promise<CourseListItem[]> {
	const where: CourseListWhere = {};

	if (userRole === Role.TEACHER && userId) {
		where.creatorId = userId;
	}

	if (category && category !== Category.ALL) {
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
			questions: {
				select: {
					id: true,
					title: true,
					options: true,
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
		price: course.price,
		category: course.category,
		modulesCount: course.modules.length,
		description: course.description,
		result: course.result,
		link: course.link,
		createdAt: course.createdAt,
		updatedAt: course.updatedAt,
		modules: course.modules.map((cm: { module: Module }) => cm.module),
		questions: course.questions.map((q) => ({
			id: q.id,
			title: q.title,
			options: (q.options as QuestionOption[]) || [],
		})),
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

		if (data.questions.length > 0) {
			await tx.question.createMany({
				data: data.questions.map((question) => ({
					courseId: createdCourse.id,
					title: question.title,
					options: question.options,
				})),
			});
		}

		const courseWithModules = await tx.course.findUnique({
			where: { id: createdCourse.id },
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
		});

		return courseWithModules!;
	});

	return {
		id: course.id,
		title: course.title,
		image: course.image,
		price: course.price,
		category: course.category,
		modulesCount: course.modules.length,
	};
}

export async function updateCourse(
	courseId: number,
	userId: number,
	userRole: TRole,
	data: z.infer<typeof updateCourseSchema>,
): Promise<CourseListItem> {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: {
			creatorId: true,
		},
	});

	if (!course) {
		throw new NotFoundError('Course not found');
	}

	if (userRole !== Role.ADMIN && course.creatorId !== userId) {
		throw new UnauthorizedError(
			'You can only update your own courses',
		);
	}

	const updatedCourse = await prisma.course.update({
		where: { id: courseId },
		data: {
			...(data.title && { title: data.title }),
			...(data.image !== undefined && { image: data.image }),
			...(data.description !== undefined && {
				description: data.description,
			}),
			...(data.result !== undefined && { result: data.result }),
			...(data.link !== undefined && { link: data.link }),
			...(data.price !== undefined && { price: data.price }),
			...(data.category && { category: data.category }),
		},
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
	});

	return {
		id: updatedCourse.id,
		title: updatedCourse.title,
		image: updatedCourse.image,
		price: updatedCourse.price,
		category: updatedCourse.category,
		modulesCount: updatedCourse.modules.length,
	};
}

export async function deleteCourse(
	courseId: number,
	userId: number,
	userRole: TRole,
): Promise<void> {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: {
			creatorId: true,
		},
	});

	if (!course) {
		throw new NotFoundError('Course not found');
	}

	if (userRole !== Role.ADMIN && course.creatorId !== userId) {
		throw new UnauthorizedError(
			'You can only delete your own courses',
		);
	}

	await prisma.course.delete({
		where: { id: courseId },
	});
}
