import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import * as fs from 'node:fs/promises'
import sanitizeHtml from 'sanitize-html'
import BadRequestError from '../errors/bad-request-error'
import { fileSizeLimits } from '../config'
import { checkSignature, Tmimetype } from '../utils/checkFileType'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    const mimetype = req.file.mimetype as Tmimetype

    if (
        (req.file.size < fileSizeLimits.minSize ||
            !req.file ||
            !req.file.path) &&
        mimetype !== 'image/svg+xml'
    ) {
        await fs.unlink(req.file.path)
        return next(new BadRequestError('Файл слишком мал'))
    }

    const filePath = req.file.path
    const isImage = await checkSignature({ mimetype, filePath })
    if (!isImage) {
        await fs.unlink(filePath)
        return next(new BadRequestError('файл не соответствует типу'))
    }
    if (mimetype === 'image/svg+xml') {
        let svg = await fs.readFile(filePath, { encoding: 'utf-8' })
        svg = sanitizeHtml(svg, {
            allowedTags: [
                'svg',
                'g',
                'defs',
                'linearGradient',
                'stop',
                'circle',
            ],
            allowedAttributes: false,
            parser: {
                lowerCaseTags: false,
                lowerCaseAttributeNames: false,
            },
        })
        fs.writeFile(filePath, svg, { encoding: 'utf-8' })
    }
    try {
        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file?.filename}`
        console.log(req.file)
        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file?.originalname,
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
