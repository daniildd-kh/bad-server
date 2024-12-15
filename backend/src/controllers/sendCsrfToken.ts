import { Request, Response } from 'express'
import { generateToken } from '../middlewares/csrfProtection';
import { isRegenerateCsrfToken } from '../config';

export const sendCsrfToken = (req: Request, res: Response) => {
  const csrfToken = generateToken(req, res, isRegenerateCsrfToken);
  res.json({ csrfToken });
}