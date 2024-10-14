import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/header"
import { UserContentProvider } from './contexts/UserContentContext'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Safe-AI UI',
  description: 'A dark-themed UI for Safe-AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
              <title>Safe AI by TheTechMargin</title>
        <link rel="icon" href="/favicon.ico" />
      <body className={`${inter.className} bg-background text-foreground`}>
      <div className="flex flex-col min-h-screen">
           <Header />
           <UserContentProvider>
        {children}
        </UserContentProvider>
        </div>
      </body>
    </html>
  )
}
