import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import fs from 'node:fs/promises'
import BadRequestError from '../errors/bad-request-error'
import { fileSizeConfig } from '../config'
import { allowedTypes } from '../middlewares/file'
import { checkType } from '../utils/check-types'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file || !req.file.path) {
        return next(new BadRequestError('Файл не загружен'))
    }

    try {
        if (req.file.size < fileSizeConfig.minSize) {
            await fs.unlink(req.file.path)
            return next(new BadRequestError('Маленький размер файла'))
        }

        const mimeType = await checkType(req.file.path)
        if (!mimeType || !allowedTypes.includes(mimeType)) {
            await fs.unlink(req.file.path)
            return next(new BadRequestError('Некорректный формат файла'))
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        if (req.file?.path) {
            await fs.unlink(req.file.path)
        }
        return next(error)
    }
}

export default {}
