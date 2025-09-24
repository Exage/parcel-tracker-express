import { Request, Response } from 'express'
import { User } from '../models/user'

import { COMMON_ERRORS } from '../constants/errors'
import { HTTP_STATUS } from '../constants/http-status'
import { RESPONSE_STATUS } from '../constants/response-status'

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstname } = req.body

    try {
        const user = await User.signup({ email, password, firstname })

        res.status(HTTP_STATUS.OK).json({
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

export const signin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
        const user = await User.signin({ email, password })

        res.status(HTTP_STATUS.OK).json({
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
