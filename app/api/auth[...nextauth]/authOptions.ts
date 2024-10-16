import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { sql } from "@vercel/postgres"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const authOptions: NextAuthOptions = {
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

          const result = await sql`
            SELECT * FROM users WHERE email = ${validatedCredentials.email}
          `
          const user = result.rows[0]

          if (!user || !user.password) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return { id: user.id, email: user.email, name: user.name }
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors[0].message}`)
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
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.username = account.providerAccountId
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0
      }
      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        // TODO: Implement token refresh logic here if needed
        return token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        if ("username" in session.user) {
          session.user.username = token.username as string;
        }
      }      
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}