import { z } from 'zod';

const configSchema = z.object({
	CLIENT_URL: z.string().url(),
	LOCAL_CLIENT_URL: z.string().url(),
	PORT: z.string().min(1),
	LOCALHOST: z.string().min(1),
	NODE_ENV: z.enum(['development', 'production', 'test']),
	JWT_KEY: z.string().min(32, 'JWT_KEY must be at least 32 characters'),
	DATABASE_URL: z.string().url(),
});

const env = configSchema.parse(process.env);

export interface IConfig {
	origins: string[];
	port: string;
	localhost: string;
	nodeEnv: 'development' | 'production' | 'test';
	jwt_key: string;
	databaseUrl: string;
}

const config: IConfig = {
	origins: [env.CLIENT_URL, env.LOCAL_CLIENT_URL],
	port: env.PORT,
	localhost: env.LOCALHOST,
	nodeEnv: env.NODE_ENV,
	jwt_key: env.JWT_KEY,
	databaseUrl: env.DATABASE_URL,
};

export default config;
