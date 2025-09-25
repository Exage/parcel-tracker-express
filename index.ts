import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import healthRouter from './routes/health.routes'
import userRouter from './routes/user.routes'

import { logger } from './middlewares/logger.middleware'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use(logger)

app.use('/api/health', healthRouter)
app.use('/api/user', userRouter)

mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port: ${process.env.PORT}`)
        })
    })
    .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Unexpected error'
        console.log('Error:', msg)
    })
