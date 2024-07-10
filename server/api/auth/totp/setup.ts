import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import prisma from '~/server/data/prisma';
import errorCodes, {setSuccess , setFail} from '~/utils/codes';
import { symmetricEncrypt } from '~/utils/crypto';
import { isPasswordValid } from '~/utils/hash';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig();

    if (event.req.method !== 'POST') {
        event.res.statusCode = 405;
        return { message: 'Method not allowed' };
    }

    const user = await prisma.User.findUnique({ where: { email: body.email } });

    if (!user) {
        console.error(
            `Session references user that no longer exists.` + body.email,
        );
        event.res.statusCode = 401;
        return { message: 'Not authenticated' };
    }

    if (!user.password) {
        event.res.statusCode = 400;
        return { message: errorCodes.user_missing_password };
    }

    if (user.twoFactorEnabled) {
        return { message: errorCodes.two_factor_already_enabled };
    }

    if (!config.ENCRYPTION_KEY) {
        console.error(
            'Missing encryption key; cannot proceed with two-factor setup.',
        );
        event.res.statusCode = 500;
        return { message: errorCodes.internal_server_error };
    }

    const isCorrectPassword = await isPasswordValid(
        body.password,
        user.password,
    );

    if (!isCorrectPassword) {
        event.res.statusCode = 400;
        return { message: errorCodes.incorrect_password };
    }

    const secret = authenticator.generateSecret(32);
    const encryptedSecret = symmetricEncrypt(secret, config.ENCRYPTION_KEY);

    await prisma.User.update({
        where: { email: body.email },
        data: {
            twoFactorEnabled: false,
            twoFactorSecret: encryptedSecret,
        },
    });

    const keyUri = authenticator.keyuri(body.email, config.APP_NAME, secret);
    const dataUri = await qrcode.toDataURL(keyUri);

    event.res.statusCode = 200;
    return { message : errorCodes.totp_setup_success , keyUri, dataUri };
});
