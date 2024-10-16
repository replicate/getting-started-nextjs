import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from '@vercel/postgres'
import bcrypt from 'bcryptjs'

interface User {
  id: string;
  name: string;
  email: string;
  accessToken?: string;
  refreshToken?: string;
  username?: string;
}

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
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          const { rows } = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          const user = rows[0]

          if (!user) {
            throw new Error('No user found with this email')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: user.access_token,
            refreshToken: user.refresh_token,
            username: user.username
          }
        } catch (error) {
          console.error('Error during authentication:', error)
          throw new Error('Authentication failed')
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
        token.id = user.id
        token.accessToken = account.access_token || (user as User).accessToken
        token.refreshToken = account.refresh_token || (user as User).refreshToken
        token.username = account.providerAccountId || (user as User).username
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : undefined
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token
      }

      // Token has expired, implement token refresh logic here if needed
      // For now, we'll just return the existing token
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        //session.user.accessToken = token.accessToken as string
       // session.user.refreshToken = token.refreshToken as string
       // session.user.username = token.username as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
}