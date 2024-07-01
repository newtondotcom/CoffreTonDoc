import bcrypt from "bcryptjs";
import prisma from "../../data/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ email: body.email }, { name: body.name }],
    },
  });

  if (userExists) {
    throw {
      statusCode: 403,
      statusMessage: "User already exists",
    };
  }

  await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password: await bcrypt.hash(body.password, 12),
    },
  });

  return { message: "User created" };
});
