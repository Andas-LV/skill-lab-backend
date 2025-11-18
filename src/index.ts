import express, { Request, Response } from "express";
import 'dotenv/config';
import cors from 'cors';
import { createServer } from 'http';
import config from '@/config';

import { userRouter } from '@/routes/users';
import { authRouter } from '@/routes/authRoutes';
import { courseRouter } from '@/routes/course';

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: config.origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH','DELETE'],
    credentials: true,
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/courses', courseRouter);

httpServer.listen(config.port, () => {
    console.log(`Server running on port ${config.port}, open ${config.localhost}`);
});