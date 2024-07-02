import { authenticator } from "otplib";
import prisma from "../../../data/prisma";
import errorCodes from "../../../../utils/codes";
import { symmetricDecrypt } from "../../../../utils/crypto"; // Import the decryption utility

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = event.context.session;
  const config = useRuntimeConfig();

  if (event.node.req.method !== "POST") {
    event.node.res.statusCode = 405;
    return { message: "Method not allowed" };
  }

  if (!session) {
    event.node.res.statusCode = 401;
    return { message: "Not authenticated" };
  }

  if (!session.user?.email) {
    console.error("Session is missing a user email.");
    event.node.res.statusCode = 500;
    return { error: errorCodes.missing_id };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    console.error(`Session references user that no longer exists.`);
    event.node.res.statusCode = 401;
    return { error: errorCodes.not_authentificated };
  }

  if (!user.twoFactorEnabled) {
    event.node.res.statusCode = 400;
    return { error: errorCodes.No2FACode };
  }

  if (!body.totpCode) {
    event.node.res.statusCode = 400;
    return { error: errorCodes.SecondFactorRequired };
  }

  if (!user.twoFactorSecret) {
    console.error(
      `Two factor is enabled for user ${user.email} but they have no secret`,
    );
    event.node.res.statusCode = 500;
    return { error: errorCodes.internal_server_error };
  }

  if (!config.ENCRYPTION_KEY) {
    console.error(
      "Missing encryption key; cannot proceed with two factor login.",
    );
    event.node.res.statusCode = 500;
    return { error: errorCodes.internal_server_error };
  }

  const secret = symmetricDecrypt(user.twoFactorSecret, config.ENCRYPTION_KEY);
  if (secret.length !== 32) {
    console.error(
      `Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`,
    );
    event.node.res.statusCode = 500;
    return { error: errorCodes.internal_server_error };
  }

  const isValidToken = authenticator.check(body.totpCode, secret);
  if (!isValidToken) {
    event.node.res.statusCode = 400;
    return { error: errorCodes.incorrect_two_factor_code };
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  event.node.res.statusCode = 200;
  return { message: "Two-factor authentication disabled" };
});
