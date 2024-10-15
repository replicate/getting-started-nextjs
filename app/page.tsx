import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle } from 'react-icons/fa'
import { useToast } from "@/hooks/use-toast"
import { Image as ImageIcon, HelpCircle, PenTool, Shield, MessageCircle } from "lucide-react"
import Header from '@/components/header'

const pages = [
  {
    title: "Create My Ideal Persona",
    description: "Harness your intuition to create powerful AI-generated visuals reflecting your ideal persona.",
    instructions: "Let us guide you on a visualization journey to bring your ideal persona to life with AI.",
    icon: <ImageIcon className="w-6 h-6 text-[#9FCF10]" />,
    href: "/guide",
  },
  {
    title: "Create Images",
    description: "Create anything your imagination can dream up.",
    instructions: "Design your prompt and let the AI do the rest. You can share, download, or even use your generated image as a prompt for another AI model.",
    icon: <HelpCircle className="w-6 h-6 text-[#9FCF10]" />,
    href: "/visualize",
  },
  {
    title: "Build a Prompt",
    description: "Craft AI prompts that resonate with your authentic voice and business or personal goals.",
    instructions: "Learn to communicate effectively with AI, leveraging your natural strengths as a leader.",
    icon: <PenTool className="w-6 h-6 text-[#9FCF10]" />,
    href: "/build",
  },
  {
    title: "Teach Me About AI",
    description: "Navigate the AI landscape with confidence, integrity, and purpose.",
    instructions: "Explore ethical AI practices that align with your values as a conscious business leader.",
    icon: <Shield className="w-6 h-6 text-[#9FCF10]" />,
    href: "/learn",
  },
  {
    title: "Contact",
    description: "Connect with a community of visionary individuals leveraging AI for business success.",
    instructions: "Share insights, seek support, and collaborate on innovative AI-driven solutions.",
    icon: <MessageCircle className="w-6 h-6 text-[#9FCF10]" />,
    href: "/contact",
  },
]

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '' }

    if (!email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    }

    if (!password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
      router.push('/')
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' })
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
      {session ? (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-[#09fff0] mb-4">Welcome to Safe-AI</h1>
          <p className="text-xl text-gray-300 mb-8">Explore AI with curiosity, utility, and safety.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, index) => (
              <Card key={index} className="flex flex-col bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-[#09fff0]/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex text-2xl items-center gap-2 text-[#E904E5]">
                    {page.icon}
                    {page.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow py-5">
                  <CardDescription className="text-[#09fff0]">{page.description}</CardDescription>
                  <p className="text-sm text-gray-300">
                    {page.instructions}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={page.href} className="w-full">
                    <Button 
                      className="w-full bg-[#09FFF0] text-gray-900 hover:bg-[#08e6d9] transition-colors"
                    >
                      Explore {page.title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row items-center justify-center p-4 font-sans">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl font-bold text-[#09fff0] mb-4">Welcome to Safe-AI</h1>
            <p className="text-xl text-gray-300">Explore AI with curiosity, utility, and safety.</p>
          </div>
          <Card className="w-full md:w-96 bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="text-center mb-4">
                <Image
                  src="/ttm.png"
                  alt="The Tech Margin Logo"
                  width={60}
                  height={60}
                  className="mx-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-[#09fff0]">Safe-AI</CardTitle>
              <CardDescription className="text-center text-gray-300">Explore AI with curiosity, utility and safety.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-4 text-center text-gray-300">
                <span>Or continue with</span>
              </div>
              <Button
                onClick={handleGoogleLogin}
                className="w-full mt-4 bg-white hover:bg-gray-200 text-gray-900 font-semibold flex items-center justify-center"
              >
                <FaGoogle className="mr-2" />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                variant="link"
                className="text-[#E904E5] hover:text-[#D003D1]"
                onClick={() => router.push('/signup')}
              >
                Don&apos;t have an account? Sign up
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}