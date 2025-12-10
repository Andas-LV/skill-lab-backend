export enum Category {
	ALL = 'ALL',
	FRONTEND = 'FRONTEND',
	MOBILE = 'MOBILE',
	BACKEND = 'BACKEND',
	DESIGN = 'DESIGN',
}

export type TCategory = typeof Category[keyof typeof Category];