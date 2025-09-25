import { Request, Response } from 'express'
import { User } from '../models/user'
import { createToken } from '../utils/jwt'

import { COMMON_ERRORS, USER_ERRORS } from '../constants/errors'
import { HTTP_STATUS } from '../constants/http-status'
import { RESPONSE_STATUS } from '../constants/response-status'
import { AuthRequest } from '../types/auth-request'

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstname } = req.body

    try {
        const user = await User.signup({ email, password, firstname })
        const { _id } = user

        const token = createToken({ _id })

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .status(HTTP_STATUS.OK)
            .json({
                status: RESPONSE_STATUS.OK,
                code: HTTP_STATUS.OK,
                token,
            })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const signin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
        const user = await User.signin({ email, password })
        const { _id } = user

        const token = createToken({ _id })

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .status(HTTP_STATUS.OK)
            .json({
                status: RESPONSE_STATUS.OK,
                code: HTTP_STATUS.OK,
                token,
            })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}

export const profile = async (req: AuthRequest, res: Response) => {
    const userId = req.userId
    try {
        if (!userId) {
            throw new Error(USER_ERRORS.ID_REQUIRED)
        }

        const user = await User.getUser({ _id: userId })

        const token = createToken({ _id: userId })

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
            .status(HTTP_STATUS.OK)
            .json({
                status: RESPONSE_STATUS.OK,
                code: HTTP_STATUS.OK,
                user,
            })
    } catch (error) {
        const message = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED

        res.status(HTTP_STATUS.BAD_REQUEST).json({
            status: RESPONSE_STATUS.ERROR,
            code: HTTP_STATUS.BAD_REQUEST,
            message,
        })
    }
}
