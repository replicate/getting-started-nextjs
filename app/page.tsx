"use client"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, HelpCircle, PenTool, Shield, MessageCircle } from "lucide-react"

export default function Component() {
  const pages = [
    {
      title: "Create My Ideal Persona",
      description: "Harness your intuition to create powerful AI-generated visuals reflecting your ideal persona.",
      instructions: "Let us guide you on a visualization journey to bring your ideal persona to life with AI.",
      icon: <Image className="w-6 h-6 text-[#9FCF10]" />,
      href: "/guide",
    },
    {
      title: "Create Images",
      description: "Create anything your imagination can dream up.",
      instructions: "Design your promopt and let the AI do the rest. You can share, download, or even use your generated image as a prompt for another AI model.",
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-[#E904E5]">TheTechMargin Safe-AI</h1>
        <p className="text-xl italic mb-8 text-center text-[#09fff0]">Explore AI&apos;s potential with creativity, intuition, and purpose.</p>
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
    </div>
  )
}