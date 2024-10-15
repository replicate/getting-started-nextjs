'use client'

import { SessionProvider } from 'next-auth/react'
import { UserContentProvider } from './contexts/UserContentContext'
import Header from "@/components/header"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <UserContentProvider>
          {children}
        </UserContentProvider>
      </div>
    </SessionProvider>
  )
}