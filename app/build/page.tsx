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
import { useChat } from 'ai/react'
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

  const { messages, append, isLoading: isChatLoading } = useChat({
    api: '/api/chat',
  })

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
      await append({
        role: 'user',
        content: generatedPrompt,
      })
      setAiResponse("AI is generating a response...")
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

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'assistant') {
        setAiResponse(lastMessage.content)
      }
    }
  }, [messages])

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
                  {step === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 1: Choose your prompt type</h2>
                      <FormField
                        control={form.control}
                        name="promptType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Prompt Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select a prompt type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="business">Business</SelectItem>
                                <SelectItem value="personal">Personal</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 2: Who are you asking as?</h2>
                      <FormField
                        control={form.control}
                        name="persona.role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="persona.age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Age Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select an age group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25-34">25-34</SelectItem>
                                <SelectItem value="35-44">35-44</SelectItem>
                                <SelectItem value="45-54">45-54</SelectItem>
                                <SelectItem value="55+">55+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="persona.gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select a gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="persona.expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Expertise</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select an area of expertise" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="creative">Creative Arts</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 3: What kind of output do you want?</h2>
                      <FormField
                        control={form.control}
                        name="output.format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Format</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select an output format" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="report">Report</SelectItem>
                                <SelectItem value="presentation">Presentation</SelectItem>
                                <SelectItem value="social-post">Social Media Post</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="script">Script</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="output.tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Tone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="formal">Formal</SelectItem>
                                <SelectItem  value="casual">Casual</SelectItem>
                                <SelectItem value="humorous">Humorous</SelectItem>
                                <SelectItem value="inspirational">Inspirational</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                <SelectItem value="empathetic">Empathetic</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="output.length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Length</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select a length" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-700 text-gray-200">
                                <SelectItem value="short">Short (100-300 words)</SelectItem>
                                <SelectItem value="medium">Medium (300-700 words)</SelectItem>
                                <SelectItem value="long">Long (700-1500 words)</SelectItem>
                                <SelectItem value="very-long">Very Long (1500+ words)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="socialPlatforms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Social Platforms (Optional)</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange([...field.value || [], value])}
                                value={field.value?.length ? field.value[field.value.length - 1] : undefined}
                              >
                                <SelectTrigger className="bg-gray-700 text-gray-200">
                                  <SelectValue placeholder="Select social platforms" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 text-gray-200">
                                  {socialPlatforms.map((platform) => (
                                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value?.map((platform) => (
                                <Button
                                  key={platform}
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => field.onChange(field.value?.filter((p) => p !== platform))}
                                >
                                  {platform} ✕
                                </Button>
                              ))}
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 4: Provide context for your prompt</h2>
                      {watchPromptType === "business" && (
                        <FormField
                          control={form.control}
                          name="businessOptions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Business Focus Areas</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange([...field.value || [], value])}
                                  value={field.value?.length ? field.value[field.value.length - 1] : undefined}
                                >
                                  <SelectTrigger className="bg-gray-700 text-gray-200">
                                    <SelectValue placeholder="Select business areas" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-700 text-gray-200">
                                    {businessOptions.map((option) => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((option) => (
                                  <Button
                                    key={option}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => field.onChange(field.value?.filter((o) => o !== option))}
                                  >
                                    {option} ✕
                                  </Button>
                                ))}
                              </div>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      )}
                      {watchPromptType === "personal" && (
                        <FormField
                          control={form.control}
                          name="lifeOptions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Life Focus Areas</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={(value) => field.onChange([...field.value || [], value])}
                                  value={field.value?.length ? field.value[field.value.length - 1] : undefined}
                                >
                                  <SelectTrigger className="bg-gray-700 text-gray-200">
                                    <SelectValue placeholder="Select life areas" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-700 text-gray-200">
                                    {lifeOptions.map((option) => (
                                      <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {field.value?.map((option) => (
                                  <Button
                                    key={option}
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => field.onChange(field.value?.filter((o) => o !== option))}
                                  >
                                    {option} ✕
                                  </Button>
                                ))}
                              </div>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="context"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Context</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what you want the AI to create..."
                                className="resize-none bg-gray-700 text-gray-200 h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400">
                              Provide detailed information about what you want the AI to create.
                            </FormDescription>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
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
                    <Button onClick={handleSendToAI} disabled={isLoading || isChatLoading} className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading || isChatLoading ? "Sending..." : "Send to AI"}
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