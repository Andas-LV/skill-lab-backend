import { prisma } from '@/lib/prisma';
import { Module } from '@/types/Course';
import { z } from 'zod';
import { createModuleSchema } from '@/schemas/module';

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

