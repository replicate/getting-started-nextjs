import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      accessToken?: string
      refreshToken?: string
      username?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    accessToken?: string
    refreshToken?: string
    username?: string
  }
}


declare module "next-auth/jwt" {
  interface JWT {
    id: string
    accessToken?: string
    refreshToken?: string
    username?: string
    accessTokenExpires?: number
  }
}