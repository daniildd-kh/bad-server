import { Request, Express } from 'express'
import { v4 as uuidv4 } from 'uuid'
import multer, { FileFilterCallback } from 'multer'
import fs from 'fs/promises'
import { join, extname } from 'path'
import { fileSizeConfig } from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const tempDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

const createTempDir = async () => {
    try {
        await fs.mkdir(tempDir, { recursive: true })
    } catch (error) {
        throw new Error('Не удалось создать временную директорию для файлов')
    }
}

createTempDir()

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
        cb(null, uuidv4() + extname(file.originalname))
    },
})

export const allowedTypes = [
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
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(null, false) 
    }

    return cb(null, true) 
}

export default multer({
    storage,
    fileFilter,
    limits: { fileSize: fileSizeConfig.maxSize },
})
