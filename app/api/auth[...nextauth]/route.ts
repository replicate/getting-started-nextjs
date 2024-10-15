import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided")
        }

        try {
          const validatedCredentials = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email: validatedCredentials.email },
          })

          if (!user || !user.password) {
            throw new Error("Invalid credentials")
          }

          const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message)
          }
          throw error
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }