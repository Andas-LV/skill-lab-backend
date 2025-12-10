import { Router } from 'express';
import {
	coursesListController,
	courseByIdController,
	createCourseController,
} from '@/controllers/course';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validateParams } from '@/middleware/validateParams';
import { validateQuery } from '@/middleware/validateQuery';
import { validateRequest } from '@/middleware/validateRequest';
import { authenticateToken, optionalAuthenticateToken } from '@/middleware';
import {
	courseIdParamsSchema,
	createCourseSchema,
	courseListQuerySchema,
} from '@/schemas/course';

const router = Router();

/**
 * @swagger
 * /courses/list:
 *   get:
 *     summary: Получить список курсов
 *     description: |
 *       Для неавторизованных пользователей возвращает все курсы.
 *       Для пользователей с ролью TEACHER возвращает только курсы, где они являются создателями.
 *       Для пользователей с ролью ADMIN или USER возвращает все курсы.
 *       Можно фильтровать по категории через query параметр category.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ALL, FRONTEND, MOBILE, BACKEND, DESIGN]
 *         description: Фильтр по категории курса
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
router.get(
	'/list',
	validateQuery(courseListQuerySchema),
	asyncHandler(optionalAuthenticateToken),
	asyncHandler(coursesListController),
);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Получить информацию о курсе по ID
 *     description: Возвращает полную информацию о курсе, включая информацию о создателе
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

/**
 * @swagger
 * /courses/add:
 *   post:
 *     summary: Создать новый курс
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Основы программирования"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               description:
 *                 type: string
 *                 example: "Курс для начинающих программистов"
 *               result:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Научитесь программировать", "Поймете основы"]
 *               link:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/course"
 *               price:
 *                 type: integer
 *                 minimum: 0
 *                 default: 0
 *                 example: 2999
 *               category:
 *                 type: string
 *                 enum: [ALL, FRONTEND, MOBILE, BACKEND, DESIGN]
 *                 default: ALL
 *                 example: "FRONTEND"
 *               moduleIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Курс успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListItem'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
	'/add',
	asyncHandler(authenticateToken),
	validateRequest(createCourseSchema),
	asyncHandler(createCourseController),
);

export const courseRouter = router;