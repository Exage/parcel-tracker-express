import { Schema, model, models } from 'mongoose'
import { IUser, UserModel } from '../types/user'
import { comparePassword, hashPassword } from '../utils/hash'
import { USER_ERRORS } from '../constants/errors'

export const userSchema = new Schema<IUser, UserModel>(
    {
        firstname: {
            type: String,
            default: null,
        },
        lastname: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
)

userSchema.statics.signup = async function ({ email, password, firstname }, select = '') {
    if (!email || !password || !firstname) {
        throw Error(USER_ERRORS.REQUIRED_FIELDS)
    }

    if (password.length < 6) {
        throw Error(USER_ERRORS.PASSWORD_SHORT)
    }

    const isExist = await this.findOne({ email })

    if (isExist) {
        throw Error(USER_ERRORS.ALREADY_EXISTS)
    }

    const hashedPassword = await hashPassword(password)

    const user = await this.create({ email, firstname, password: hashedPassword })

    return this.findById(user._id)
        .select(select + ' -password -role')
        .lean()
}

userSchema.statics.signin = async function ({ email, password }, select = '') {
    if (!email || !password) {
        throw Error(USER_ERRORS.REQUIRED_FIELDS)
    }

    if (password.length < 6) {
        throw Error(USER_ERRORS.PASSWORD_SHORT)
    }

    const user = await this.findOne({ email })

    if (!user) {
        throw Error(USER_ERRORS.NOT_FOUND)
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
        throw Error(USER_ERRORS.PASSWORD_INCORRECT)
    }

    return this.findById(user._id)
        .select(select + ' -password -role')
        .lean()
}

userSchema.statics.getUser = async function ({ _id }, select = '') {
    if (!_id) {
        throw Error(USER_ERRORS.ID_REQUIRED)
    }

    const user = this.findById(_id)
        .select(select + ' -password -role')
        .lean()

    if (!user) {
        throw Error(USER_ERRORS.NOT_FOUND)
    }

    return user
}

export const User = (models.User as UserModel) || model<IUser, UserModel>('User', userSchema)
