import { authenticator } from 'otplib';
import prisma from '../../../data/prisma';
import errorCodes from '../../../../utils/codes';
import { symmetricDecrypt } from '../../../../utils/crypto';  // Make sure to import your decryption utility

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = event.context.session;
  const config = useRuntimeConfig();

  if (event.req.method !== 'POST') {
    return {
      statusCode: 405,
      body: { message: 'Method not allowed' }
    };
  }

  if (!session) {
    return {
      statusCode: 401,
      body: { message: 'Not authenticated' }
    };
  }

  if (!session.user?.email) {
    console.error('Session is missing a user email.');
    return {
      statusCode: 500,
      body: { error: errorCodes.InternalServerError }
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    }
  });

  if (!user) {
    console.error(`Session references user that no longer exists.`);
    return {
      statusCode: 401,
      body: { message: 'Not authenticated' }
    };
  }

  if (user.twoFactorEnabled) {
    return {
      statusCode: 400,
      body: { error: errorCodes.TwoFactorAlreadyEnabled }
    };
  }

  if (!user.twoFactorSecret) {
    return {
      statusCode: 400,
      body: { error: errorCodes.TwoFactorSetupRequired }
    };
  }

  if (!config.ENCRYPTION_KEY) {
    console.error('Missing encryption key; cannot proceed with two factor setup.');
    return {
      statusCode: 500,
      body: { error: errorCodes.InternalServerError }
    };
  }

  const secret = symmetricDecrypt(user.twoFactorSecret, config.ENCRYPTION_KEY);
  if (secret.length !== 32) {
    console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
    return {
      statusCode: 500,
      body: { error: errorCodes.InternalServerError }
    };
  }

  const isValidToken = authenticator.check(body.totpCode, secret);
  if (!isValidToken) {
    return {
      statusCode: 400,
      body: { error: errorCodes.IncorrectTwoFactorCode }
    };
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorEnabled: true
    }
  });

  return {
    statusCode: 200,
    body: { message: 'Two-factor enabled' }
  };
});
