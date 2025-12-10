import { Router } from 'express';
import { authenticateToken } from '@/middleware';
import {
	getFavoritesController,
	addToFavoritesController,
	removeFromFavoritesController,
} from '@/controllers/favorites';
import { validateRequest } from '@/middleware/validateRequest';
import { validateParams } from '@/middleware/validateParams';
import {
	addToFavoritesSchema,
	removeFromFavoritesParamsSchema,
} from '@/schemas/favorites';
import { asyncHandler } from '@/middleware/asyncHandler';

const router = Router();

router.use(asyncHandler(authenticateToken));

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Получить все избранные курсы
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список избранных курсов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseListItem'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', asyncHandler(getFavoritesController));

/**
 * @swagger
 * /favorites/add:
 *   post:
 *     summary: Добавить курс в избранное
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Курс добавлен в избранное
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListItem'
 *       400:
 *         description: Ошибка валидации или курс уже в избранном
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
 *       404:
 *         description: Курс не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
	'/add',
	validateRequest(addToFavoritesSchema),
	asyncHandler(addToFavoritesController),
);

/**
 * @swagger
 * /favorites/{courseId}:
 *   delete:
 *     summary: Удалить курс из избранного
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID курса
 *     responses:
 *       200:
 *         description: Курс удален из избранного
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Курс не найден в избранном
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
	'/:courseId',
	validateParams(removeFromFavoritesParamsSchema),
	asyncHandler(removeFromFavoritesController),
);

export const favoritesRouter = router;

