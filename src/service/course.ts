import { prisma } from '@/lib/prisma';
import { CourseListItem, CourseFullInfo } from '@/types/Course';

export async function getCoursesList(): Promise<CourseListItem[]> {
	return prisma.course.findMany({
		select: {
			id: true,
			title: true,
			image: true,
			modulesCount: true,
		},
		orderBy: { createdAt: 'desc' },
	});
}

export async function getCourseById(id: number): Promise<CourseFullInfo | null> {
	return prisma.course.findUnique({
		where: { id },
		include: {
			modules: {
				select: {
					id: true,
					title: true,
					children: true,
				},
				orderBy: { id: 'asc' },
			},
		},
	});
}
