import bcrypt from 'bcryptjs';
import prisma from '~/server/data/prisma';
import errorCodes from '~/utils/codes';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userExists = await prisma.user.findFirst({
    where: { email: body.email },
  });

  if (userExists) {
    return { message: errorCodes.user_already_exists };
  }

  await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: await bcrypt.hash(body.password, 12),
    },
  });

  return { message: errorCodes.success_user_created };
});
