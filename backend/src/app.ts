import rateLimit from 'express-rate-limit'
import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import cors from 'cors'
import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { allowedOrigins, DB_ADDRESS, rateLimitConfig } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(rateLimit(rateLimitConfig))

app.use(helmet())

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    })
)

app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(express.json({ limit: '10kb' }))

app.use(mongoSanitize())

app.use((req: Request, _res: Response, next: NextFunction) => {
    next()
})

app.use(serveStatic(path.join(__dirname, 'public')))

app.use((err: Error, _req: Request, _res: Response, next: NextFunction) => {
    next(err)
})

app.use(routes)

app.use(errors())

app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS, {})

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error('Error connecting to the database:', error)
    }
}

bootstrap()
