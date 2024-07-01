import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
}

export async function isPasswordValid(
  password: string,
  hashedPassword: string,
) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
