import { authenticator } from "otplib";
import prisma from "~/server/data/prisma";
import errorCodes from "~/utils/codes";
import { symmetricDecrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (event.req.method !== "POST") {
    return {
      statusCode: 405,
      body: { message: "Method not allowed" },
    };
  }

  if (!body.email) {
    console.error("Session is missing a user email.");
    return {
      statusCode: 500,
      body: { error: errorCodes.internal_server_error },
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    console.error(`Session references user that no longer exists.`);
    return {
      statusCode: 401,
      body: { message: "Not authenticated" },
    };
  }

  if (user.twoFactorEnabled) {
    return {
      statusCode: 400,
      body: { error: errorCodes.two_factor_already_enabled },
    };
  }

  if (!user.twoFactorSecret) {
    return {
      statusCode: 400,
      body: { error: errorCodes.two_factor_setup_required },
    };
  }

  if (!config.ENCRYPTION_KEY) {
    console.error(
      "Missing encryption key; cannot proceed with two factor setup.",
    );
    return {
      statusCode: 500,
      body: { error: errorCodes.internal_server_error },
    };
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
    return {
      statusCode: 400,
      body: { error: errorCodes.incorrect_two_factor_code },
    };
  }

  await prisma.user.update({
    where: { email: body.email },
    data: {
      twoFactorEnabled: true,
    },
  });

  return {
    statusCode: 200,
    body: { message: errorCodes.two_factor_enabled },
  };
});
