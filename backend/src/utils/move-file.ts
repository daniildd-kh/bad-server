import { existsSync, promises as fsPromises } from 'fs';
import { resolve, join, basename, normalize } from 'path';

async function moveFile(imagePath: string, from: string, to: string): Promise<void> {
    const fileName = basename(imagePath);
    const imagePathTemp = join(from, fileName);
    const imagePathPermanent = join(to, fileName);

    const normalizedPathTemp = normalize(imagePathTemp);
    const normalizedPathPermanent = normalize(imagePathPermanent);

    if (!normalizedPathTemp.startsWith(resolve(from))) {
        throw new Error('Неверный путь к временной папке');
    }
    if (!normalizedPathPermanent.startsWith(resolve(to))) {
        throw new Error('Неверный путь к постоянной папке');
    }

    if (!existsSync(normalizedPathTemp)) {
        throw new Error('Ошибка: файл не найден в временной папке');
    }

    try {
        await fsPromises.rename(normalizedPathTemp, normalizedPathPermanent);
    } catch (err: any) {
        throw new Error(`Ошибка при перемещении файла: ${err.message}`);
    }
}

export default moveFile;
