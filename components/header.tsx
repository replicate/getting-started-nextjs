'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Menu, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession, signIn, signOut } from "next-auth/react"

const menuItems = [
  { value: "/" , href: '/', label: 'Home' },
  { value: "guide", label: "Create My Ideal Persona", href: "/guide" },
  { value: "build", label: "Build My Perfect Prompt", href: "/build" },
  { value: "visualize", label: "Create Images", href: "/visualize" },
  { value: "learn", label: "Teach Me About AI", href: "/learn" },
  { value: "contact", label: "Contact", href: "/contact" },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")
  const { data: session } = useSession()

  useEffect(() => {
    const currentPath = pathname.split('/')[1]
    setActiveTab(currentPath || "/")
  }, [pathname])

  const handleNavigation = (value: string) => {
    setActiveTab(value)
    router.push(`/${value}`)
  }

  const handleAuthAction = () => {
    if (session) {
      signOut()
    } else {
      signIn()
    }
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
        <nav className="hidden md:flex space-x-2 items-center">
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
          <Button
            variant="outline"
            onClick={handleAuthAction}
            className="ml-2 text-[#09fff0] hover:bg-gray-700 hover:text-[#fff] flex items-center"
          >
            {session ? (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
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
              <Button
                variant="outline"
                onClick={handleAuthAction}
                className="w-full justify-start text-lg text-[#09fff0] hover:bg-gray-700"
              >
                {session ? (
                  <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
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