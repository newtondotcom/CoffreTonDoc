import { authenticator } from 'otplib';
import prisma from '~/server/data/prisma';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';
import { symmetricDecrypt } from '~/utils/crypto';

export default defineEventHandler(async (event) => {
 const body = await readBody(event);
 const email = body.email;
 const config = useRuntimeConfig();

 if (event.node.req.method !== 'POST') {
  return setFail(event, errorCodes.method_not_allowed);
 }

 if (!email) {
  return setFail(event, errorCodes.not_authenticated);
 }

 const user = await prisma.user.findFirst({
  where: {
   email: email,
  },
 });

 if (!user) {
  return setFail(event, errorCodes.not_authentificated);
 }

 if (!body.totpCode) {
  return setFail(event, errorCodes.second_factor_required);
 }

 if (!user.twoFactorSecret) {
  return setFail(event, errorCodes.internal_server_error);
 }

 if (!config.ENCRYPTION_KEY) {
  return setFail(event, errorCodes.internal_server_error);
 }

 const secret = symmetricDecrypt(user.twoFactorSecret, config.ENCRYPTION_KEY);

 /*
  if (secret.length !== 32) {
    console.log(secret);
    console.error(
      `Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`,
    );
    return {
      statusCode: 500,
      body: { error: errorCodes.internal_server_error },
    };
  }
  */

 const isValidToken = authenticator.check(body.totpCode, secret);
 if (!isValidToken) {
  return setFail(event, errorCodes.incorrect_two_factor_code);
 }

 if (!user.twoFactorEnabled) {
  await prisma.user.update({
   where: { email: body.email },
   data: {
    twoFactorEnabled: true,
   },
  });
 }

 return setSuccess(event, errorCodes.success);
});
