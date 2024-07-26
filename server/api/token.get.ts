import { getToken } from '#auth';
export default defineEventHandler(async (event) => {
    //const token = await getToken({ event });
    const token = '4';
    return token || 'no token present';
});
