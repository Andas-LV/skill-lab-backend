export type CourseListItem = {
	id: number;
	title: string;
	image: string | null;
	price: number;
	category: string;
	modulesCount: number;
};

export type CourseFullInfo = CourseListItem & {
	description: string | null;
	result: string[];
	link: string | null;
	createdAt: Date;
	updatedAt: Date;
	modules: Module[];
	questions: Question[];
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
};

export type QuestionOption = {
	answerName: string;
	right: boolean;
};

export type Question = {
	id: number;
	title: string;
	options: QuestionOption[];
};