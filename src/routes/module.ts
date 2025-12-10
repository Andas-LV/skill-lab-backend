import { Router } from 'express';
import { createModuleController } from '@/controllers/module';
import { asyncHandler } from '@/middleware/asyncHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { authenticateToken } from '@/middleware';
import { createModuleSchema } from '@/schemas/module';

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

export const moduleRouter = router;

