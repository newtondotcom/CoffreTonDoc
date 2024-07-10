import bcrypt from 'bcryptjs';
import prisma from '~/server/data/prisma';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const user = await prisma.user.findFirst({
        where: { email: body.email },
    });

    if (user) {
        if (user.twoFactorEnabled) {
            return setFail(event, errorCodes.two_factor_already_enabled);
        }
        return setSuccess(event, errorCodes.user_already_exists);
    }

    await prisma.user.create({
        data: {
            email: body.email,
            name: body.name,
            password: await bcrypt.hash(body.password, 12),
        },
    });

    return setSuccess(event, errorCodes.success_user_created);
});
