import { Request, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import fs from 'fs'
import { fileSizeLimits } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const newName = (originalname: string) =>
    String(
        Math.random() * 10000 +
            String(
                new Date(
                    Date.now() + Math.ceil(Math.random() * 100)
                ).toISOString()
            )
    ).replace(/[:,.,-]/g, '') + extname(originalname)

const tempDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(tempDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, tempDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, newName(file.originalname)) // file.originalname
    },
})

const types = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!types.includes(file.mimetype)) {
        return cb(null, false)
    }
    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSizeLimits.maxSize },
})
