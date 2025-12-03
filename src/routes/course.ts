import { Router } from 'express';
import {
	coursesListController,
	courseByIdController,
} from '@/controllers/course';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validateParams } from '@/middleware/validateParams';
import { courseIdParamsSchema } from '@/schemas/course';

const router = Router();

/**
 * @swagger
 * /courses/list:
 *   get:
 *     summary: Получить список всех курсов
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Список курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseListItem'
 */
router.get('/list', asyncHandler(coursesListController));

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Получить информацию о курсе по ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Информация о курсе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseFullInfo'
 *       404:
 *         description: Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
	'/:id',
	validateParams(courseIdParamsSchema),
	asyncHandler(courseByIdController),
);

export const courseRouter = router;