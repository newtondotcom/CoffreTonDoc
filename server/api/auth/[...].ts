import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
import { authenticator } from "otplib";
import { symmetricDecrypt } from "~/utils/crypto"; 
import bcrypt from "bcryptjs";
import prisma from "~/server/data/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import errorCodes from "~/utils/codes";

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
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider.default({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your super secure password",
        },
        totpCode: {
          label: "Two-factor Code",
          type: "input",
          placeholder: "Code from authenticator app",
        },
      },

      async authorize(credentials: any) {
        console.log("credentials", credentials);
        const user = await prisma.user.findUnique({
          where: { email: credentials?.username },
        });

        if (!user) {
          throw {
            statusCode: 403,
            statusMessage: errorCodes.incorrect_username,
          };
        }

        const isPasswordValid = await bcrypt.compare(
          credentials?.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw {
            statusCode: 403,
            statusMessage: errorCodes.incorrect_password,
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
        if (secret.length !== 32) {
          console.error(
            `Two factor secret decryption failed. Expected key with length 32 but got ${secret.length}`,
          );
          return {
            statusCode: 500,
            body: { error: errorCodes.internal_server_error },
          };
        }
      
        const isValidToken = authenticator.check(credentials.totpCode, secret);
        if (!isValidToken) {
          return {
            statusCode: 400,
            body: { error: errorCodes.incorrect_two_factor_code },
          };
        }
        
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.nombre = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
});
