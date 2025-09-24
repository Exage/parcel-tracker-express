import { Model } from 'mongoose'

export interface IUser {
    _id: string
    firstname?: string | null
    lastname?: string | null
    email: string
    password: string
    phone?: string | null
    role: 'user' | 'admin'
}

export interface UserStatics {
    signup({
        email,
        password,
        firstname,
    }: {
        email: string
        password: string
        firstname: string
    }): Promise<IUser>
    signin({ email, password }: { email: string; password: string }): Promise<IUser>
}

export type UserModel = Model<IUser> & UserStatics
