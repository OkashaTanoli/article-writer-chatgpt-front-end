export type IUser = {
    name: string,
    email: string,
    key: string,
    token: string
} | null

export type IData = {
    user: IUser
}

export type IContext = {
    state: IData,
    dispatch: React.Dispatch<any>
}
