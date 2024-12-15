import { NextFunction, RequestHandler } from 'express';
import xss from 'xss';

export function sanitizeString(input: string): string {
    return xss(input);
}


export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitizedObj: Partial<T> = {};

    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            sanitizedObj[key] = sanitizeString(obj[key]) as T[typeof key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizedObj[key] = sanitizeObject(obj[key]) as T[typeof key];
        } else {
            sanitizedObj[key] = obj[key];
        }
    }

    return sanitizedObj as T;
}

interface CustomRequestBody {
    [key: string]: any;
}

export const sanitizeMiddleware: RequestHandler<any, any, CustomRequestBody> = (req, _res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    next();
};



export function enforceLimit(value: number, max: number): number {
    return Math.min(value, max);
}


export function isValidString(input: string): boolean {
    const forbiddenPatterns = /(<script|onload|javascript:|data:)/i;
    return !forbiddenPatterns.test(input);
}
