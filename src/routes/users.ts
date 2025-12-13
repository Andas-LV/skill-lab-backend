import { Router } from 'express';
import { authenticateToken } from '@/middleware';
import {
	getUserMe,
	updateUserMe,
	getAllUsersController,
	changeUserRoleController,
	getUserByIdController,
} from '@/controllers/users';
import { validateRequest } from '@/middleware/validateRequest';
import { updateUserSchema, changeUserRoleSchema } from '@/schemas/users';
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

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Получить список всех пользователей (только для админов)
 *     description: |
 *       Только администраторы могут просматривать список всех пользователей.
 *       Возвращает информацию о всех пользователях системы.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: [ADMIN, USER, TEACHER]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Не авторизован или нет прав доступа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/all', asyncHandler(getAllUsersController));

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Получить информацию о пользователе по ID (только для админов)
 *     description: |
 *       Только администраторы могут просматривать детальную информацию о пользователях.
 *       Возвращает информацию о пользователе, включая список избранных курсов.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER, TEACHER]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 favoriteItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       courseId:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       course:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           image:
 *                             type: string
 *                             nullable: true
 *                           description:
 *                             type: string
 *                             nullable: true
 *                           price:
 *                             type: integer
 *                           category:
 *                             type: string
 *                             enum: [ALL, FRONTEND, MOBILE, BACKEND, DESIGN]
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Не авторизован или нет прав доступа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userId', asyncHandler(getUserByIdController));


/**
 * @swagger
 * /user/{userId}/change-role:
 *   patch:
 *     summary: Изменить роль пользователя (только для админов)
 *     description: |
 *       Только администраторы могут изменять роли пользователей.
 *       Позволяет назначить пользователю одну из ролей: ADMIN, USER, TEACHER.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя, роль которого нужно изменить
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER, TEACHER]
 *                 example: TEACHER
 *                 description: Новая роль для пользователя
 *     responses:
 *       200:
 *         description: Роль пользователя успешно изменена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [ADMIN, USER, TEACHER]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Не авторизован или нет прав доступа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Пользователь не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch(
	'/:userId/change-role',
	validateRequest(changeUserRoleSchema),
	asyncHandler(changeUserRoleController)
);

export const userRouter = router;

