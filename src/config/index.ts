const env = process.env;

export interface IConfig {
	origins: string[];
	port: string;
	localhost: string;
	nodeEnv: 'development' | 'production' | 'test';
	jwt_key: string;
	databaseUrl: string;
}

const config: IConfig = {
	origins: [env.CLIENT_URL!, env.LOCAL_CLIENT_URL!],
	port: env.PORT!,
	localhost: env.LOCALHOST!,
	nodeEnv: env.NODE_ENV! as 'development' | 'production' | 'test',
	jwt_key: env.JWT_KEY!,
	databaseUrl: env.DATABASE_URL!,
};

export default config;
