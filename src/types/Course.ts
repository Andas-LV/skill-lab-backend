export type CourseListItem = {
	id: number;
	title: string;
	image: string | null;
	modulesCount: number;
};

export type CourseFullInfo = CourseListItem & {
	description: string | null;
	result: string[];
	link: string | null;
	createdAt: Date;
	updatedAt: Date;
	modules: Module[];
	creator: {
		id: number;
		username: string;
		email: string;
	};
};

export type Module = {
	id: number;
	title: string;
	children: string[];
}