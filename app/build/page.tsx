'use client'

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
import { Download, Send } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useChat } from 'ai/react'

const formSchema = z.object({
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
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const prompt = `As a ${values.persona.age} year old ${values.persona.gender} ${values.persona.role} with expertise in ${values.persona.expertise}, create a ${values.output.length} ${values.output.format} in a ${values.output.tone} tone about: ${values.context}`
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

  return (
    
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
     <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle>AI Prompt Creator</CardTitle>
            <CardDescription>Create your perfect AI prompt in 3 easy steps.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Step 1: Who are you asking as?</h2>
                    <FormField
                      control={form.control}
                      name="persona.role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="researcher">Researcher</SelectItem>
                              <SelectItem value="educator">Educator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="persona.age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Group</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an age group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="18-24">18-24</SelectItem>
                              <SelectItem value="25-34">25-34</SelectItem>
                              <SelectItem value="35-44">35-44</SelectItem>
                              <SelectItem value="45+">45+</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="persona.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="non-binary">Non-binary</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="persona.expertise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expertise</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an area of expertise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="arts">Arts</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Step 2: What kind of output do you want?</h2>
                    <FormField
                      control={form.control}
                      name="output.format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Format</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an output format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="report">Report</SelectItem>
                              <SelectItem value="presentation">Presentation</SelectItem>
                              <SelectItem value="blog-post">Blog Post</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="output.tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="formal">Formal</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="humorous">Humorous</SelectItem>
                              <SelectItem value="serious">Serious</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="output.length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a length" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="short">Short (100-300 words)</SelectItem>
                              <SelectItem value="medium">Medium (300-700 words)</SelectItem>
                              <SelectItem value="long">Long (700-1500 words)</SelectItem>
                              <SelectItem value="very-long">Very Long (1500+ words)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Step 3: Provide context for your prompt</h2>
                    <FormField
                      control={form.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Context</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what you want the AI to create..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide detailed information about what you want the AI to create.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {generatedPrompt && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Generated Prompt:</h2>
                    <p className="p-2 bg-gray-100 rounded text-gray-900">{generatedPrompt}</p>
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={handleSendToAI} disabled={isLoading || isChatLoading}>
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading || isChatLoading ? "Sending..." : "Send to AI"}
                      </Button>
                    </div>
                  </div>
                )}
                {aiResponse && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">AI Response:</h2>
                    <p className="p-2 bg-gray-100 rounded text-gray-900">{aiResponse}</p>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Generate Prompt
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
      </div>
    </div>
  )
}