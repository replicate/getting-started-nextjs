import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from "@/components/ui/header"
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
      <body className={`${inter.className} bg-background text-foreground`}>
      <div className="flex flex-col min-h-screen">
           <Header />
        {children}
        <footer className="bg-primary text-primary-foreground py-4">
            <div className="container mx-auto px-4 text-center">
              © {new Date().getFullYear()} Safe-AI UI. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
