import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Skill Lab Backend API',
			version: '1.0.0',
			description: 'API документация для Skill Lab Backend',
			contact: {
				name: 'API Support',
			},
		},
		servers: [
			{
				url: 'http://localhost:8000',
				description: 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Введите JWT токен',
				},
			},
			schemas: {
				Error: {
					type: 'object',
					properties: {
						error: {
							type: 'string',
							description: 'Сообщение об ошибке',
						},
						details: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									path: { type: 'string' },
									message: { type: 'string' },
								},
							},
						},
					},
				},
				User: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						email: { type: 'string' },
						username: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				CourseListItem: {
					type: 'object',
					properties: {
						id: { type: 'integer' },
						title: { type: 'string' },
						image: { type: 'string', nullable: true },
						modulesCount: { type: 'integer' },
					},
				},
				CourseFullInfo: {
					allOf: [
						{ $ref: '#/components/schemas/CourseListItem' },
						{
							type: 'object',
							properties: {
								description: { type: 'string', nullable: true },
								result: {
									type: 'array',
									items: { type: 'string' },
								},
								link: { type: 'string', nullable: true },
								createdAt: { type: 'string', format: 'date-time' },
								updatedAt: { type: 'string', format: 'date-time' },
								modules: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'integer' },
											title: { type: 'string' },
											children: {
												type: 'array',
												items: { type: 'string' },
											},
										},
									},
								},
							},
						},
					],
				},
			},
		},
		tags: [
			{ name: 'Auth', description: 'Аутентификация и регистрация' },
			{ name: 'Users', description: 'Управление пользователями' },
			{ name: 'Courses', description: 'Управление курсами' },
			{ name: 'Basket', description: 'Корзина' },
			{ name: 'Favorites', description: 'Избранные курсы' },
		],
	},
	apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

