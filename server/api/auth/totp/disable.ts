import { authenticator } from 'otplib';
import prisma from '../../../data/prisma';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const session = event.context.session;
  if (req.method !== 'POST') {
    return errorCodes.method_not_allowed;
  }

  if (!session) {
    return "Not authenticated"
  }

  if (!session.user?.email) {
    console.error('Session is missing a user id.');
    return errorCodes.missing_id;
  }

  const user = await prisma.User.findFirst({
    where : {
        email: session.user.email
    }
  })

  if (!user) {
    console.error(`Session references user that no longer exists.`);
    return errorCodes.not_authentificated;
  }

  if (!user.password) {
    return errorCodes.UserMissingPassword;
  }

  if (!user.twoFactorEnabled) {
    return errorCodes.No2FACode;
  }

  // if user has 2fa
  if (user.twoFactorEnabled) {
    if (!body.totpCode) {
      return errorCodes.SecondFactorRequired;
    }

    if (!user.twoFactorSecret) {
      console.error(`Two factor is enabled for user ${user.email} but they have no secret`);
      throw new Error(errorCodes.InternalServerError);
    }

    if (!process.env.ENCRYPTION_KEY) {
      console.error(`"Missing encryption key; cannot proceed with two factor login."`);
      throw new Error(errorCodes.InternalServerError);
    }

    const secret = symmetricDecrypt(user.twoFactorSecret, process.env.ENCRYPTION_KEY);
    if (secret.length !== 32) {
      console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
      throw new Error(errorCodes.InternalServerError);
    }

    // If user has 2fa enabled, check if body.totpCode is correct
    const isValidToken = authenticator.check(req.body.totpCode, secret);
    if (!isValidToken) {
      return errorCodes.IncorrectTwoFactorCode;
    }
  }

  // If it is, disable users 2fa
  await prisma.User.update({where : {email: session.user?.email},data : {
    twoFactorEnabled: false,
    twoFactorSecret: null,}});

  return errorCodes.TwoFADisabled;
}