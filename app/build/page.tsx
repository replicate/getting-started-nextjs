'use client';

import { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Send, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Poppins } from 'next/font/google'
import { motion, AnimatePresence } from 'framer-motion'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const formSchema = z.object({
  promptType: z.enum(["business", "personal"]),
  persona: z.object({
    role: z.string(),
    age: z.string(),
    gender: z.string(),
    expertise: z.string(),
  }),
  output: z.object({
    format: z.string(),
    tone: z.string(),
    length: z.string(),
  }),
  context: z.string().min(10, {
    message: "Context must be at least 10 characters.",
  }),
  socialPlatforms: z.array(z.string()).optional(),
  businessOptions: z.array(z.string()).optional(),
  lifeOptions: z.array(z.string()).optional(),
})

export default function PromptCreationForm() {
  const [step, setStep] = useState(1)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptType: "business",
      persona: {
        role: "",
        age: "",
        gender: "",
        expertise: "",
      },
      output: {
        format: "",
        tone: "",
        length: "",
      },
      context: "",
      socialPlatforms: [],
      businessOptions: [],
      lifeOptions: [],
    },
  })

  const watchPromptType = form.watch("promptType")

  const socialPlatforms = [
    "Facebook", "Twitter", "Instagram", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Reddit"
  ]

  const businessOptions = [
    "Marketing", "Sales", "Customer Service", "Product Development", "Finance", "Human Resources", "Operations", "Strategy"
  ]

  const lifeOptions = [
    "Health & Wellness", "Personal Finance", "Relationships", "Career Development", "Education", "Hobbies", "Travel", "Personal Growth"
  ]

  function onSubmit(values: z.infer<typeof formSchema>) {
    let prompt = `As a ${values.persona.age} year old ${values.persona.gender} ${values.persona.role} with expertise in ${values.persona.expertise}, create a ${values.output.length} ${values.output.format} in a ${values.output.tone} tone about: ${values.context}`

    if (values.promptType === "business") {
      prompt += `\nBusiness focus: ${values.businessOptions?.join(", ")}`
    } else {
      prompt += `\nPersonal life focus: ${values.lifeOptions?.join(", ")}`
    }

    if (values.socialPlatforms && values.socialPlatforms.length > 0) {
      prompt += `\nOptimize for these social platforms: ${values.socialPlatforms.join(", ")}`
    }

    setGeneratedPrompt(prompt)
    console.log(prompt)
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "generated_prompt.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const handleSendToAI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: generatedPrompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAiResponse(data.result)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send prompt to AI. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className={`${poppins.className} text-center`}>
          <CardTitle className="text-3xl font-bold text-[#09fff0]">AI Prompt Creator</CardTitle>
          <CardDescription className="text-lg text-gray-400">Create your perfect AI prompt in 4 easy steps.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1-4 content remains the same */}
                  {/* ... */}
                </motion.div>
              </AnimatePresence>
              {generatedPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 p-4 bg-gray-700 rounded-lg shadow-inner"
                >
                  <h2 className="text-xl font-semibold mb-2 text-[#09fff0]">Generated Prompt:</h2>
                  <p className="p-2 bg-gray-600 rounded text-gray-200">{generatedPrompt}</p>
                  <div className="mt-4 flex space-x-2">
                    <Button onClick={handleDownload} variant="outline" className="bg-gray-600 text-gray-200 hover:bg-gray-500">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button onClick={handleSendToAI} disabled={isLoading} className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? "Sending..." : "Send to AI"}
                    </Button>
                  </div>
                </motion.div>
              )}
              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8 p-4 bg-gray-700 rounded-lg shadow-inner"
                >
                  <h2 className="text-xl font-semibold mb-2 text-[#09fff0]">AI Response:</h2>
                  <p className="p-2 bg-gray-600 rounded text-gray-200">{aiResponse}</p>
                </motion.div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
              Generate Prompt
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}