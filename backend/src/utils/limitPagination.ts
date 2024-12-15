export default function limitPagination(limit: number, maxLimit: number = 10) {
    return limit > maxLimit ? maxLimit : limit;
}
