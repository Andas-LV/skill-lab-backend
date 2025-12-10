import { Router } from 'express';
import { authenticateToken } from '@/middleware';
import {
	getBasketController,
	addToBasketController,
	removeFromBasketController,
	clearBasketController,
} from '@/controllers/basket';
import { validateRequest } from '@/middleware/validateRequest';
import { validateParams } from '@/middleware/validateParams';
import {
	addToBasketSchema,
	removeFromBasketParamsSchema,
} from '@/schemas/basket';
import { asyncHandler } from '@/middleware/asyncHandler';

const router = Router();

router.use(asyncHandler(authenticateToken));

/**
 * @swagger
 * /basket:
 *   get:
 *     summary: Получить все курсы в корзине
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список курсов в корзине
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseListItem'
 *       401:
 *         description: Не авторизован
 */
router.get('/', asyncHandler(getBasketController));

/**
 * @swagger
 * /basket/add:
 *   post:
 *     summary: Добавить курс в корзину
 *     tags: [Basket]
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
 *         description: Курс добавлен в корзину
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseListItem'
 *       400:
 *         description: Ошибка валидации или курс уже в корзине
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
	validateRequest(addToBasketSchema),
	asyncHandler(addToBasketController),
);

/**
 * @swagger
 * /basket/{courseId}:
 *   delete:
 *     summary: Удалить курс из корзины
 *     tags: [Basket]
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
 *         description: Курс удален из корзины
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
 *         description: Курс не найден в корзине
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
	'/:courseId',
	validateParams(removeFromBasketParamsSchema),
	asyncHandler(removeFromBasketController),
);

/**
 * @swagger
 * /basket/clear:
 *   delete:
 *     summary: Очистить корзину
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Корзина очищена
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
 */
router.delete('/clear', asyncHandler(clearBasketController));

export const basketRouter = router;

