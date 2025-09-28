import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import healthRouter from './routes/health.routes'
import userRouter from './routes/user.routes'

import { logger } from './middlewares/logger.middleware'

import { COMMON_ERRORS } from './constants/errors'
import { HTTP_STATUS } from './constants/http-status'
import { RESPONSE_STATUS } from './constants/response-status'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use(logger)

app.use('/api/health', healthRouter)
app.use('/api/user', userRouter)

app.use((_: Request, res: Response) => {
    res.status(HTTP_STATUS.NOT_FOUND).json({
        status: RESPONSE_STATUS.ERROR,
        message: COMMON_ERRORS.ROUTE_NOT_FOUND,
        code: HTTP_STATUS.NOT_FOUND,
    })
})

mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`)
        })
    })
    .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : COMMON_ERRORS.UNEXPECTED
        console.log('Error:', msg)
    })
