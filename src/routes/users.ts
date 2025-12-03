import { Router } from 'express';
import { authenticateToken } from '@/middleware';
import { getUserMe, updateUserMe } from '@/controllers/users';
import { validateRequest } from '@/middleware/validateRequest';
import { updateUserSchema } from '@/schemas/users';
import { asyncHandler } from '@/middleware/asyncHandler';

const router = Router();

router.use(asyncHandler(authenticateToken));

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизован
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', asyncHandler(getUserMe));

/**
 * @swagger
 * /user/me/update:
 *   patch:
 *     summary: Обновить информацию о текущем пользователе
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 example: newusername
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации или данные уже заняты
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
router.patch('/me/update', validateRequest(updateUserSchema), asyncHandler(updateUserMe));

export const userRouter = router;
