import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import { UPLOAD_PATH, MIN_UPLOAD_FILE_SIZE } from '../config';
import BadRequestError from '../errors/bad-request-error'

const magicSignature = ['ffd8ffe0', '89504e47', 'ffd8ffe1', 'ffd8ffe2', '47494638']

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }
    try {
        if (req.file.size < MIN_UPLOAD_FILE_SIZE) {
            return next(new BadRequestError('Минимальный размер файла 2Kб'))
        }

        if (req.file.buffer) {
            const fileSignature = req.file.buffer.subarray(0, 4).toString('hex');
            if (!magicSignature.includes(fileSignature)) {
                return next(new BadRequestError('Невалидная сигнатура файла'))
            }
        }

        const fileName = `/${UPLOAD_PATH}/${crypto.randomUUID().slice(0, 8)}.${req.file.mimetype.split('/')[1]}`;
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
