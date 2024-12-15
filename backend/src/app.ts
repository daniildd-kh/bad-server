import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
// import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import { rateLimit } from 'express-rate-limit';
import mongoSanitizer from 'express-mongo-sanitize'
import path from 'path'
import { DB_ADDRESS, CORS_CONFIG, PORT } from './config'
import errorHandler from './middlewares/error-handler'
// import serveStatic from './middlewares/serverStatic'
import routes from './routes'

const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 40,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
})

app.use(cookieParser());

app.use(cors(CORS_CONFIG));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json({ limit: '10mb' }))
app.use(limiter);
app.use(mongoSanitizer());
app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS);
        app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
