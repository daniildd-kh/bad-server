import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { corsOptions, DB_ADDRESS, rateLimiterOptions } from './config'

import errorHandler from './middlewares/error-handler'
import routes from './routes'
import rateLimit from 'express-rate-limit'

const { PORT = 3000 } = process.env

const app = express()

console.log(corsOptions)

app.use(rateLimit(rateLimiterOptions))

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(routes)
app.use(errors())
app.use(errorHandler)

// eslint-disable-next-line no-console

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
