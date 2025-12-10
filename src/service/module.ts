import { prisma } from '@/lib/prisma';
import { Module } from '@/types/Course';
import { z } from 'zod';
import { createModuleSchema, updateModuleSchema } from '@/schemas/module';
import { NotFoundError, ConflictError } from '@/utils/errors';

export async function getModulesList(): Promise<Module[]> {
	const modules = await prisma.module.findMany({
		select: {
			id: true,
			title: true,
			children: true,
		},
		orderBy: { createdAt: 'desc' },
	});

	return modules;
}

export async function createModule(
	data: z.infer<typeof createModuleSchema>,
): Promise<Module> {
	return prisma.module.create({
		data: {
			title: data.title,
			children: data.children,
		},
		select: {
			id: true,
			title: true,
			children: true,
		},
	});
}

export async function deleteModule(moduleId: number): Promise<void> {
	const module = await prisma.module.findUnique({
		where: { id: moduleId },
		include: {
			courses: {
				select: {
					id: true,
				},
			},
		},
	});

	if (!module) {
		throw new NotFoundError('Module not found');
	}

	if (module.courses.length > 0) {
		throw new ConflictError(
			'Cannot delete module that is used in courses',
		);
	}

	await prisma.module.delete({
		where: { id: moduleId },
	});
}

export async function updateModule(
	moduleId: number,
	data: z.infer<typeof updateModuleSchema>,
): Promise<Module> {
	const module = await prisma.module.findUnique({
		where: { id: moduleId },
	});

	if (!module) {
		throw new NotFoundError('Module not found');
	}

	return prisma.module.update({
		where: { id: moduleId },
		data: {
			...(data.title && { title: data.title }),
			...(data.children !== undefined && { children: data.children }),
		},
		select: {
			id: true,
			title: true,
			children: true,
		},
	});
}

