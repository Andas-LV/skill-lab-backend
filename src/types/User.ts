export type User = {
    id: number,
    email: string,
    username: string,
    role: 'ADMIN' | 'USER' | 'TEACHER',
    createdAt: Date,
    updatedAt: Date,
}

export type Register = {
    email: string,
    username: string,
    password: string,
}

export type Login = {
    username: string,
    password: string,
}