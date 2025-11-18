interface IConfig {
	origins: string[];
	port: string;
	localhost: string;
	nodeEnv: string;
	jwt_key: string;
}

const config: IConfig = {
	origins: [
		process.env.CLIENT_URL!,
		process.env.LOCAL_CLIENT_URL!,
	],
	port: process.env.PORT!,
	localhost: process.env.LOCALHOST!,
	nodeEnv: process.env.NODE_ENV!,
	jwt_key: process.env.JWT_KEY!
};

export default config;
