import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

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
        // Add your own logic here to validate the credentials
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { 
            id: "1", 
            name: "User", 
            email: "user@example.com",
            accessToken: "sample_access_token",
            refreshToken: "sample_refresh_token",
            username: "username"
          }
        }
        return null
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
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.username = account.providerAccountId
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.accessToken = token.accessToken as string
        session.user.refreshToken = token.refreshToken as string
        session.user.username = token.username as string
      }

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}