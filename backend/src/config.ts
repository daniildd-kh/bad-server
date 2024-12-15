import { CookieOptions } from 'express'
import { CorsOptions } from 'cors';
import ms from 'ms'
import 'dotenv/config'

export const { PORT = '3000' } = process.env
export const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek' } = process.env
export const { JWT_SECRET = 'JWT_SECRET' } = process.env
export const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '10m',
}
export const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: ms(process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d'),
            path: '/',
        } as CookieOptions,
    },
}
export const ORIGIN_ALLOW = process.env.ORIGIN_ALLOW || 'http://localhost:3000';

export const CORS_CONFIG = { origin: ORIGIN_ALLOW, credentials: true } as CorsOptions;

export const CSRF_CONFIG = {
    getSecret: () => process.env.CSRF_SECRET || 'secret-dev',
    cookieName: '__WebLarek.x-csrf-token',
    cookieOptions: {
        // httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/',
    } as CookieOptions
};

export const { UPLOAD_PATH_TEMP = 'temp', UPLOAD_PATH = 'uploads' } = process.env;

export const MAX_UPLOAD_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MIN_UPLOAD_FILE_SIZE = 2 * 1024; // 2Kb
