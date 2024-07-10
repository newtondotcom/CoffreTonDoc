import CredentialsProvider from 'next-auth/providers/credentials';
import { NuxtAuthHandler } from '#auth';
import { authenticator } from 'otplib';
import { symmetricDecrypt } from '~/utils/crypto';
import bcrypt from 'bcryptjs';
import prisma from '~/server/data/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import errorCodes, { setSuccess, setFail } from '~/utils/codes';

const config = useRuntimeConfig();
export default NuxtAuthHandler({
 adaptater: PrismaAdapter(prisma),
 secret: config.AUTH_SECRET,
 session: {
  //strategy: "database", // Store sessions in the database and store a sessionToken in the cookie for lookups
  jwt: true,
  maxAge: 30 * 24 * 60 * 60, // 30 Days
 },
 pages: {
  signIn: '/auth/login',
  signOut: '/auth/login',
  error: '/auth/login',
 },
 providers: [
  CredentialsProvider.default({
   id: 'credentials',
   name: 'Credentials',
   credentials: {
    username: {
     label: 'Email Address',
     type: 'email',
     placeholder: 'john.doe@example.com',
    },
    password: {
     label: 'Password',
     type: 'password',
     placeholder: 'Your super secure password',
    },
    totpCode: {
     label: 'Two-factor Code',
     type: 'input',
     placeholder: 'Code from authenticator app',
    },
   },

   async authorize(credentials: any) {
    const { username, password, totpCode } = credentials;
    const email = username;

    if (!email || !password) {
     return setFail({}, errorCodes.not_authenticated);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
     return setFail({}, errorCodes.incorrect_username);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
     return setFail({}, errorCodes.incorrect_password);
    }

    if (!user.twoFactorSecret) {
     return setFail({}, errorCodes.internal_server_error);
    }

    if (!config.ENCRYPTION_KEY) {
     console.error(
      'Missing encryption key; cannot proceed with two factor setup.',
     );
     return setFail({}, errorCodes.internal_server_error);
    }

    const secret = symmetricDecrypt(
     user.twoFactorSecret,
     config.ENCRYPTION_KEY,
    );

    /*
                if (secret.length !== 32) {
                  console.error(`Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`);
                  return setFail({}, errorCodes.internal_server_error);
                }
                */

    const isValidToken = authenticator.check(totpCode, secret);
    if (!isValidToken) {
     return setFail({}, errorCodes.incorrect_two_factor_code);
    }

    if (!user.twoFactorEnabled) {
     await prisma.user.update({
      where: { email },
      data: {
       twoFactorEnabled: true,
      },
     });
    }

    return {
     id: user.id,
     name: user.name,
     email: user.email,
     twoFactorEnabled: user.twoFactorEnabled,
    };
   },
  }),
 ],
 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    token.id = user.id;
    token.name = user.name;
    token.email = user.email;
    console.log('JWT callback - user added to token:', token);
   }
   return token;
  },
  async session({ session, token }) {
   session.user.id = token.id;
   session.user.name = token.name;
   session.user.email = token.email;
   return session;
  },
 },
});
