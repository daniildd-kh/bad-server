import { Request, Response } from 'express';
import { generateToken } from '../middlewares/csrf-handler';

export const generateCSRFToken = (req: Request, res: Response) => {
    const token = generateToken(req, res, false);
    res.send({ token });
}
