import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')  
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)  
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new BadRequestError('Только изображения разрешены'))
        }
        cb(null, true)
    }
}).single('file') 

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    upload(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return next(new BadRequestError('Размер файла превышает допустимый лимит'))
            }
            return next(new BadRequestError('Ошибка загрузки файла'))
        }
        if (err) {
            return next(err)
        }

        if (!req.file) {
            return next(new BadRequestError('Файл не загружен'))
        }

        try {
            const fileName = process.env.UPLOAD_PATH
                ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
                : `/${req.file?.filename}`

            return res.status(constants.HTTP_STATUS_CREATED).send({
                fileName,
                originalName: req.file?.originalname,
            })
        } catch (error) {
            return next(error)
        }
    })
}

export default {}
