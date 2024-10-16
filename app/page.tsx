
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./lib/auth"
import HomePage from "@/components/HomePage"
import { sql } from './lib/db'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import ErrorBoundary from "@/components/ErrorBoundary"

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}


async function getUserData(email: string): Promise<User | null> {
  try {
    const { rows } = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userEmail = session.user?.email

  if (!userEmail) {
    throw new Error("User email not found in session")
  }

  const user = await getUserData(userEmail)

  if (!user) {
    throw new Error("User not found in database")
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
      <Suspense fallback={<Loading />}>
        <HomePage user={user} />
      </Suspense>
    </ErrorBoundary>
  )
}