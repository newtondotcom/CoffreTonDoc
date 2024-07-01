import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import bcrypt from 'bcryptjs';
import prisma from '../../data/prisma'
import { PrismaAdapter } from "@next-auth/prisma-adapter"


const config = useRuntimeConfig();
export default NuxtAuthHandler({
  secret: config.AUTH_SECRET,
  session: {
    strategy: 'jwt',
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
          email: { label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com' },
          password: { label: 'Password', type: 'password', placeholder: 'Your super secure password' },
          totpCode: { label: 'Two-factor Code', type: 'input', placeholder: 'Code from authenticator app' },
        },
     
      async authorize (credentials: any) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.username},
        })

        if(!user) {
          throw ({
            statusCode: 403,
            statusMessage: "Credentials not working",
          })

        }

        const isPasswordValid = await bcrypt.compare(credentials?.password, user.password)

        if (!isPasswordValid) {
          throw ({
            statusCode: 403,
            statusMessage: "Credentials not working",
          })
        }
        return user
      }
    })
  ],
  callbacks: {
    // Specify here the payload of your token and session
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) { 
        token.id = user.id
        token.nombre = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user.id = token.id
      session.user.nombre = token.name
      session.user.email = token.email
      return session
    },
  },
  adaptater : PrismaAdapter(prisma)
})