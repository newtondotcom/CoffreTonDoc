import prisma from '~/server/data/prisma';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const email = body.email;

    await prisma.User.update({
        where: { email: email },
        data: {
            seedCreated: true,
        },
    });

    return setSuccess(event, errorCodes.success_user_created);
});
