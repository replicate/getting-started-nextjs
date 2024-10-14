'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const menuItems = [
  { value: "/" , href: '/', label: 'Home' },
  { value: "build", label: "Build AI", href: "/build" },
  { value: "visualize", label: "Visualize AI", href: "/visualize" },
  { value: "contact", label: "Contact", href: "/contact" },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    const currentPath = pathname.split('/')[1] // Get the first part of the path
    setActiveTab(currentPath || "build-ai") // Default to "build-ai" if path is empty
  }, [pathname])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`/${value}`)
  }
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="Safe-AI UI Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-xl font-bold text-foreground">Safe-AI UI</span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:block">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              {menuItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value || ''}
                  className="data-[state=active]:primary-button"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-4">
              {menuItems.map((item) => (
                <Link key={item.value} href={item.href} passHref>
                  <Button
                    variant={activeTab === item.value ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.value)}
                    className={activeTab === item.value ? "primary-button w-full justify-start" : "w-full justify-start"}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}