'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
    <header className="border-b border-border bg-[#0a0a29]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/youTubeLogo-BMkXJx4GaqLQwdSXy3SEpdd4AvND3g.png"
            alt="The Tech Margin Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-xl font-bold text-[#ff00ff] font-poppins">The Tech Margin</span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:block">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="bg-[#0a0a29]">
              {menuItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value || ''}
                  className="data-[state=active]:bg-[#09fff0] data-[state=active]:text-[#0a0a29] text-[#09fff0]"
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
          <SheetContent side="right" className="bg-[#0a0a29]">
            <nav className="flex flex-col space-y-4 mt-4">
              {menuItems.map((item) => (
                <Link key={item.value} href={item.href} passHref>
                  <Button
                    variant={activeTab === item.value ? "default" : "ghost"}
                    onClick={() => setActiveTab(item.value)}
                    className={`w-full justify-start ${
                      activeTab === item.value
                        ? "bg-[#09fff0] text-[#0a0a29]"
                        : "text-[#09fff0]"
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="container mx-auto px-4 py-2">
        <p className="font-poppins font-bold text-sm md:text-base text-center md:text-left text-[#09fff0]">
          Safely Explore AI with TheTechMargin Tools - technology should feel safe for everyone.
        </p>
      </div>
    </header>
  )
}