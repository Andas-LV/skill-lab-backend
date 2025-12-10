import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import config from '@/config';
import { swaggerSpec } from '@/config/swagger';
import { userRouter } from '@/routes/users';
import { authRouter } from '@/routes/authRoutes';
import { courseRouter } from '@/routes/course';
import { moduleRouter } from '@/routes/module';
import { basketRouter } from '@/routes/basket';
import { favoritesRouter } from '@/routes/favorites';
import { errorHandler } from '@/middleware/errorHandler';

const app = express();
const httpServer = createServer(app);

app.use(
	cors({
		origin: config.origins,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
	res.json({
		message: 'Express + TypeScript Server',
		version: '1.0.0',
	});
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', (req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/courses', courseRouter);
app.use('/modules', moduleRouter);
app.use('/basket', basketRouter);
app.use('/favorites', favoritesRouter);

app.use(errorHandler);

httpServer.listen(config.port, () => {
	console.log(
		`Server running on port ${config.port}, open ${config.localhost}`,
	);
});