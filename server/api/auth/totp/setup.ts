import { authenticator } from "otplib";
import qrcode from "qrcode";
import prisma from "~/server/data/prisma";
import errorCodes from "~/utils/codes";
import { symmetricEncrypt } from "~/utils/crypto";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const session = event.context.session;
  const config = useRuntimeConfig();

  if (event.req.method !== "POST") {
    event.res.statusCode = 405;
    return { message: "Method not allowed" };
  }

  if (!session) {
    event.res.statusCode = 401;
    console.log("No session found")
    return { message: "Not authenticated" };
  }

  if (!session.user?.email) {
    console.error("Session is missing a user email.");
    event.res.statusCode = 500;
    return { error: errorCodes.InternalServerError };
  }

  const user = await prisma.user.findOne({ email: session.user.email });

  if (!user) {
    console.error(`Session references user that no longer exists.`);
    event.res.statusCode = 401;
    return { message: "Not authenticated" };
  }

  if (!user.password) {
    event.res.statusCode = 400;
    return { error: errorCodes.UserMissingPassword };
  }

  if (user.twoFactorEnabled) {
    event.res.statusCode = 400;
    return { error: errorCodes.TwoFactorAlreadyEnabled };
  }

  if (!config.ENCRYPTION_KEY) {
    console.error(
      "Missing encryption key; cannot proceed with two-factor setup.",
    );
    event.res.statusCode = 500;
    return { error: errorCodes.InternalServerError };
  }

  const isCorrectPassword = await isPasswordValid(body.password, user.password);

  if (!isCorrectPassword) {
    event.res.statusCode = 400;
    return { error: errorCodes.IncorrectPassword };
  }

  const secret = authenticator.generateSecret(32);
  const encryptedSecret = symmetricEncrypt(secret, config.ENCRYPTION_KEY);

  await prisma.User.updateOne(
    { email: session.user.email },
    {
      twoFactorEnabled: false,
      twoFactorSecret: encryptedSecret,
    },
  );

  const keyUri = authenticator.keyuri(session.user.email, "MyApp", secret);
  const dataUri = await qrcode.toDataURL(keyUri);

  event.res.statusCode = 200;
  return { secret, keyUri, dataUri };
});
function isPasswordValid(password: any, password1: any) {
  throw new Error("Function not implemented.");
}
