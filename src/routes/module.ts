import { Router } from 'express';
import {
	createModuleController,
	updateModuleController,
	deleteModuleController,
} from '@/controllers/module';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { validateParams } from '@/middleware/validateParams';
import { authenticateToken } from '@/middleware';
import {
	createModuleSchema,
	updateModuleSchema,
	moduleIdParamsSchema,
} from '@/schemas/module';

const router = Router();

/**
 * @swagger
 * /modules/add:
 *   post:
 *     summary: Создать новый модуль
 *     tags: [Modules]
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
 *                 example: "Введение в программирование"
 *               children:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Урок 1", "Урок 2", "Урок 3"]
 *     responses:
 *       201:
 *         description: Модуль успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 children:
 *                   type: array
 *                   items:
 *                     type: string
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
	validateRequest(createModuleSchema),
	asyncHandler(createModuleController),
);

/**
 * @swagger
 * /modules/{id}:
 *   patch:
 *     summary: Обновить модуль
 *     description: Обновить информацию о модуле
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID модуля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Обновленное название модуля"
 *               children:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Урок 1", "Урок 2", "Урок 3", "Урок 4"]
 *     responses:
 *       200:
 *         description: Модуль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 children:
 *                   type: array
 *                   items:
 *                     type: string
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
 *       404:
 *         description: Модуль не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
	'/:id',
	asyncHandler(authenticateToken),
	validateParams(moduleIdParamsSchema),
	validateRequest(updateModuleSchema),
	asyncHandler(updateModuleController),
);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Удалить модуль
 *     description: |
 *       Модуль можно удалить только если он не используется ни в одном курсе.
 *       Если модуль связан с курсами, будет возвращена ошибка конфликта.
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID модуля
 *     responses:
 *       200:
 *         description: Модуль успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Модуль не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Модуль используется в курсах и не может быть удален
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
	'/:id',
	asyncHandler(authenticateToken),
	validateParams(moduleIdParamsSchema),
	asyncHandler(deleteModuleController),
);

export const moduleRouter = router;

