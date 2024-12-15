import { NextFunction, Request, Response } from 'express';
import xss from 'xss';

import sanitizeHtml from 'sanitize-html';


const options = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a'],
    allowedAttributes: {
        a: ['href']
    },
};

const sanitize = (html: string) => sanitizeHtml(html, options);

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

export function sanitizeString(input: string): string {
    return xss(input);
}


export const sanitizeMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    req.body = sanitizeObject(req.body);
    return next();
};


export function enforceLimit(value: number, max: number): number {
    return Math.min(value, max);
}


export function isValidString(input: string): boolean {
    const forbiddenPatterns = /(<script|onload|javascript:|data:)/i;
    return !forbiddenPatterns.test(input);
}
