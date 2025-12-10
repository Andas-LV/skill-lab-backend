import { Router } from 'express';
import {
	coursesListController,
	courseByIdController,
	createCourseController,
	updateCourseController,
	deleteCourseController,
} from '@/controllers/course';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validateParams } from '@/middleware/validateParams';
import { validateQuery } from '@/middleware/validateQuery';
import { validateRequest } from '@/middleware/validateRequest';
import { authenticateToken, optionalAuthenticateToken } from '@/middleware';
import {
	courseIdParamsSchema,
	createCourseSchema,
	updateCourseSchema,
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
 *       400:
 *         description: Ошибка валидации query параметров
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - options
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Что такое переменная?"
 *                     options:
 *                       type: array
 *                       minItems: 2
 *                       maxItems: 10
 *                       items:
 *                         type: object
 *                         required:
 *                           - answerName
 *                           - right
 *                         properties:
 *                           answerName:
 *                             type: string
 *                             example: "Именованная область памяти"
 *                           right:
 *                             type: boolean
 *                             example: true
 *                 example:
 *                   - title: "Что такое переменная?"
 *                     options:
 *                       - answerName: "Именованная область памяти"
 *                         right: true
 *                       - answerName: "Функция"
 *                         right: false
 *                       - answerName: "Класс"
 *                         right: false
 *                   - title: "Какой тип данных используется для целых чисел?"
 *                     options:
 *                       - answerName: "string"
 *                         right: false
 *                       - answerName: "number"
 *                         right: true
 *                       - answerName: "boolean"
 *                         right: false
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

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Обновить курс
 *     description: |
 *       Обновить курс может только его создатель или администратор.
 *       Можно обновить любое поле курса, кроме модулей и вопросов.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Обновленное название курса"
 *               image:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/new-image.jpg"
 *               description:
 *                 type: string
 *                 example: "Обновленное описание курса"
 *               result:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Новый результат 1", "Новый результат 2"]
 *               link:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/new-course"
 *               price:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3999
 *               category:
 *                 type: string
 *                 enum: [ALL, FRONTEND, MOBILE, BACKEND, DESIGN]
 *                 example: "BACKEND"
 *     responses:
 *       200:
 *         description: Курс успешно обновлен
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
 *         description: Не авторизован или нет прав на обновление
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
	'/:id',
	asyncHandler(authenticateToken),
	validateParams(courseIdParamsSchema),
	validateRequest(updateCourseSchema),
	asyncHandler(updateCourseController),
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Удалить курс
 *     description: |
 *       Удалить курс может только его создатель или администратор.
 *       При удалении курса также удаляются все связанные вопросы, модули и записи в корзине/избранном.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Курс успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Не авторизован или нет прав на удаление
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
	'/:id',
	asyncHandler(authenticateToken),
	validateParams(courseIdParamsSchema),
	asyncHandler(deleteCourseController),
);

export const courseRouter = router;