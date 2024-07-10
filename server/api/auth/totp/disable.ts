import { authenticator } from 'otplib';
import prisma from '~/server/data/prisma';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';
import { symmetricDecrypt } from '~/utils/crypto';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const session = event.context.session;
    const config = useRuntimeConfig();

    if (event.node.req.method !== 'POST') {
        return setFail(event, errorCodes.method_not_allowed);
    }

    if (!session) {
        console.error('Session is missing.');
        return setFail(event, errorCodes.not_authenticated);
    }

    if (!session.user?.email) {
        console.error('Session is missing a user email.');
        return setFail(event, errorCodes.missing_id);
    }

    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email,
        },
    });

    if (!user) {
        console.error(`Session references user that no longer exists.`);
        return setFail(event, errorCodes.not_authentificated);
    }

    if (!user.twoFactorEnabled) {
        return setFail(event, errorCodes.No2FACode);
    }

    if (!body.totpCode) {
        return setFail(event, errorCodes.SecondFactorRequired);
    }

    if (!user.twoFactorSecret) {
        console.error(`Two factor is enabled for user ${user.email} but they have no secret`);
        return setFail(event, errorCodes.internal_server_error);
    }

    if (!config.ENCRYPTION_KEY) {
        console.error('Missing encryption key; cannot proceed with two factor login.');
        return setFail(event, errorCodes.internal_server_error);
    }

    const secret = symmetricDecrypt(user.twoFactorSecret, config.ENCRYPTION_KEY);
    if (secret.length !== 32) {
        console.error(
            `Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`,
        );
        return setFail(event, errorCodes.internal_server_error);
    }

    const isValidToken = authenticator.check(body.totpCode, secret);
    if (!isValidToken) {
        return setFail(event, errorCodes.incorrect_two_factor_code);
    }

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
        },
    });
    return setSuccess(event, errorCodes.two_factor_disabled);
});
