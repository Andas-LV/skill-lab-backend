export enum Role {
	ADMIN = 'ADMIN',
	USER = 'USER',
	TEACHER = 'TEACHER',
}

export type TRole = typeof Role[keyof typeof Role];

