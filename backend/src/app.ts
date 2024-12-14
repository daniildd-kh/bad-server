import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { DB_ADDRESS } from './config';
import errorHandler from './middlewares/error-handler';
import serveStatic from './middlewares/serverStatic';
import routes from './routes';
import helmet from 'helmet';
import { csrfProtection, csrfProtect } from './middlewares/csrf-protect';
import rateLimit from 'express-rate-limit'

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: 'Слишком много запросов с вашего IP, попробуйте позже',
});

const app = express();

app.use(limiter);
app.use(cookieParser());

app.use(cors({ origin: true, credentials: true })); 
app.options('*', cors());

app.use(helmet());

app.use(serveStatic(path.join(__dirname, 'public')));

app.use(urlencoded({ extended: true }));
app.use(json());

// app.use(csrfProtection);
// app.use('/csrf-token', csrfProtect);

app.use(routes);

app.use(errors());

app.use(errorHandler);

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS);
        await app.listen(PORT, () => console.log('ok'));
    } catch (error) {
        console.error(error);
    }
};

bootstrap();
