export type User = {
    id: number,
    email: string,
    username: string,

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