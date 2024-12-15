import BadRequestError from "../errors/bad-request-error";

export const sanitizeFilter = (filter: Record<string, any>, path: string = '') => {
    const forbiddenKeys = new Set(['$expr', '$function', '$where']);

    Object.keys(filter).forEach((key) => {
        const fullPath = path ? `${path}.${key}` : key;

        if (forbiddenKeys.has(key)) {
            throw new BadRequestError(`Использование оператора ${key} запрещено в фильтре по пути ${fullPath}`);
        }

        if (typeof filter[key] === 'object' && filter[key] !== null) {
            sanitizeFilter(filter[key], fullPath);
        }
    });
};
