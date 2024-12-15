import { Request, Response, NextFunction } from 'express'
import { sanitize } from '../utils/sanitizer';

const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
        return sanitize(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, sanitizeObject(value)])
        );
    }
    return obj;
};


export const sanitizeMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    req.body = sanitizeObject(req.body);
    return next();
};
