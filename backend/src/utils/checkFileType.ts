import { createReadStream } from 'fs'

type BufferEncoding =
    | 'ascii'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'utf-16le'
    | 'ucs2'
    | 'ucs-2'
    | 'base64'
    | 'base64url'
    | 'latin1'
    | 'binary'
    | 'hex'

const magicHex = {
    'image/png': ['89504e47'],
    'image/jpg': ['ffd8ffe0', 'ffd8ffee', 'ffd8ffee1'],
    'image/jpeg': [''],
    'image/gif': ['47494638'],
    'image/svg+xml': (signature: string) => signature.toLowerCase() === '<svg',
}

magicHex['image/jpeg'] = magicHex['image/jpg']

export type Tmimetype = keyof typeof magicHex

type TReadOptions = { highWaterMark: number; encoding: BufferEncoding }

const readPartialFile = async (
    filePath: string,
    { highWaterMark = 4, encoding = 'hex' }: TReadOptions
) => {
    const promise = new Promise<string>((res, rej) => {
        try {
            const readStream = createReadStream(filePath, {
                highWaterMark,
                encoding,
            })
            readStream.on('data', (chunk: string) => {
                res(chunk)
                readStream.close()
            })
        } catch (err: any) {
            rej(err)
        }
    })
    return promise
}

export const checkSignature = async ({
    mimetype,
    filePath,
}: {
    mimetype: Tmimetype
    filePath: string
}) => {
    const check = magicHex[mimetype]
    if (Array.isArray(check)) {
        const signature = await readPartialFile(filePath, {
            highWaterMark: 4,
            encoding: 'hex',
        })
        return check.includes(signature)
    }
    const signature = await readPartialFile(filePath, {
        highWaterMark: 4,
        encoding: 'utf-8',
    })
    return check(signature)
}
