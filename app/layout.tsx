import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/header"
import { UserContentProvider } from './contexts/UserContentContext'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'TheTechMargin Safe-AI',
  description: 'Technology should feel safe for everyone. Explore with curiosity and security.',
  icons: {
    icon: '/favicon.png',
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
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
