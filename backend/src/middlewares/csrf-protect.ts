import csurf from 'csurf';
import BadRequestError from '../errors/bad-request-error';
import { Request, Response, NextFunction } from 'express';

interface CSRFError extends Error {
    code?: string;
}

const csrfProtection = csurf({ cookie: true });

const csrfProtect = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.method === 'GET' || req.method === 'HEAD') {
            const csrfToken = req.csrfToken();
            res.cookie('XSRF-TOKEN', csrfToken);
            console.log(`CSRF-токен отправлен клиенту: ${csrfToken}`);
        }
        next();
    } catch (error) {
        const errorWithCode = error as CSRFError;
        if (errorWithCode.code === 'EBADCSRFTOKEN') {
            console.error('CSRF проверка не прошла: неверный токен');
            return next(new BadRequestError('Неверный CSRF токен'));
        } else {
            console.error('Ошибка проверки CSRF:', error);
            next(error);
        }
    }
};


export { csrfProtection, csrfProtect };
