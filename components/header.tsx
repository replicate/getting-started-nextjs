'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const menuItems = [
  { value: "/" , href: '/', label: 'Home' },
  { value: "guide", label: "Guide Me", href: "/guide" },
  { value: "build", label: "Build AI", href: "/build" },
  { value: "visualize", label: "Visualize AI", href: "/visualize" },
  { value: "learn", label: "Help Me", href: "/learn" },
  { value: "contact", label: "Contact", href: "/contact" },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    const currentPath = pathname.split('/')[1] // Get the first part of the path
    setActiveTab(currentPath || "/") // Default to "/" if path is empty
  }, [pathname])

  const handleNavigation = (value: string) => {
    setActiveTab(value)
    router.push(`/${value}`)
  }

  return (
    <header className="border-b border-border bg-gray-800 font-poppins">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/ttm.png"
            alt="The Tech Margin Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-2xl md:text-3xl font-bold text-[#ff00ff]">TheTechMargin</span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-2">
          {menuItems.map((item) => (
            <span key={item.value}>
              <Link href={item.href}>
            <Button
              variant={activeTab === item.value ? "default" : "outline"}
              onClick={() => handleNavigation(item.value)}
              className={`${
                activeTab === item.value
                  ? "bg-[#09fff0] text-[#000]"
                  : "text-[#09fff0] hover:bg-gray-700 hover:text-[#fff]"
              }`}
              
            >
              {item.label}
            </Button>
            </Link>
            </span>
          ))}
        </nav>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-800">
            <nav className="flex flex-col space-y-4 mt-4">
              {menuItems.map((item) => (
                <Button
                  key={item.value}
                  variant={activeTab === item.value ? "default" : "outline"}
                  onClick={() => handleNavigation(item.value)}
                  className={`w-full justify-start text-lg ${
                    activeTab === item.value
                      ? "bg-[#09fff0] text-gray-800"
                      : "text-[#09fff0] hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <div className="container mx-auto px-4 py-2">
        <p className="font-bold text-sm md:text-base text-center md:text-left text-[#09fff0]">
          Safely Explore AI with TheTechMargin Tools - technology should feel safe for everyone.
        </p>
      </div>
    </header>
  )
}