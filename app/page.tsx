"use client"
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, HelpCircle, PenTool, Shield, MessageCircle } from "lucide-react"

export default function Component() {
  const pages = [
    {
      title: "Visualize",
      description: "Generate images based on your prompts.",
      instructions: "Enter a detailed description of the image you want to create.",
      icon: <Image className="w-6 h-6" />,
      href: "/visualize",
    },
    {
      title: "Guide Me",
      description: "Learn how to use Safe-AI UI effectively.",
      instructions: "Follow our step-by-step guide to get the most out of our platform.",
      icon: <HelpCircle className="w-6 h-6" />,
      href: "/guide",
    },
    {
      title: "Build a Prompt",
      description: "Craft powerful prompts for image generation.",
      instructions: "Use our prompt builder to create detailed and effective prompts.",
      icon: <PenTool className="w-6 h-6" />,
      href: "/build",
    },
    {
      title: "AI Safety and Guidance",
      description: "Understand our AI safety measures and ethical guidelines.",
      instructions: "Learn about how we ensure safe and responsible AI image generation.",
      icon: <Shield className="w-6 h-6" />,
      href: "/learn",
    },
    {
      title: "Contact",
      description: "Get in touch with our support team.",
      instructions: "Reach out to us for any questions, feedback, or assistance.",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "/contact",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">TheTechMargin Safe-AI</h1><em className="text-1xl font-bold mb-8 text-center"> Explore, be curious, expand your thinking.</em>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page, index) => (
            <Card key={index} className="flex flex-col bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-100">
                  {page.icon}
                  {page.title}
                </CardTitle>
                <CardDescription className="text-gray-400">{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-400">{page.instructions}</p>
              </CardContent>
              <CardFooter>
                <Link href={page.href} className="w-full">
                  <Button 
                    className="w-full bg-[#09fff0] text-gray-900 hover:bg-[#08e6d9] transition-colors"
                  >
                    Go to {page.title}
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