import BadRequestError from '../errors/bad-request-error'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {

        const filePath = path.join(baseDir, req.path)

        const resolvedPath = path.resolve(filePath)

        if (!resolvedPath.startsWith(baseDir)) {
            next(new BadRequestError('Доступ заблокирован'))
        }

        fs.access(resolvedPath, fs.constants.F_OK, (err) => {
            if (err) {
                return next()
            }
            return res.sendFile(resolvedPath, (err) => {
                if (err) {
                    next(err)
                }
            })
        })
    }
}
