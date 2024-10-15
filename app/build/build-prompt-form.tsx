'use client';

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'

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
    numberOfResults: z.string(),
    presentationFormat: z.string(),
  }),
  context: z.string().min(10, {
    message: "Context must be at least 10 characters.",
  }),
  socialPlatforms: z.array(z.string()).optional(),
  businessOptions: z.array(z.string()).optional(),
  lifeOptions: z.array(z.string()).optional(),
})

const socialPlatforms = [
  "Facebook", "Twitter", "Instagram", "LinkedIn", "TikTok", "YouTube", "Pinterest", "Reddit"
]

const businessOptions = [
  "Marketing", "Sales", "Customer Service", "Product Development", "Finance", "Human Resources", "Operations", "Strategy"
]

const lifeOptions = [
  "Health & Wellness", "Personal Finance", "Relationships", "Career Development", "Education", "Hobbies", "Travel", "Personal Growth"
]

interface BuildPromptFormProps {
  onGeneratePrompt: (prompt: string) => void;
  promptSent: boolean;
}

export function BuildPromptForm({ onGeneratePrompt, promptSent }: BuildPromptFormProps) {
  const [step, setStep] = useState(1)

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
        numberOfResults: "1",
        presentationFormat: "paragraph",
      },
      context: "",
      socialPlatforms: [],
      businessOptions: [],
      lifeOptions: [],
    },
  })

  const watchPromptType = form.watch("promptType")

  function onSubmit(values: z.infer<typeof formSchema>) {
    let prompt = `As a ${values.persona.age} year old ${values.persona.gender} ${values.persona.role} with expertise in ${values.persona.expertise}, create ${values.output.numberOfResults} ${values.output.length} ${values.output.format} in a ${values.output.tone} tone about: ${values.context}`

    if (values.promptType === "business") {
      prompt += `\nBusiness focus: ${values.businessOptions?.join(", ")}`
    } else {
      prompt += `\nPersonal life focus: ${values.lifeOptions?.join(", ")}`
    }

    if (values.socialPlatforms && values.socialPlatforms.length > 0) {
      prompt += `\nOptimize for these social platforms: ${values.socialPlatforms.join(", ")}`
    }

    prompt += `\nPresent the results in ${values.output.presentationFormat} format.`

    onGeneratePrompt(prompt)
  }

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  if (promptSent) {
    return null;
  }

  return (
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
                          <SelectTrigger className="bg-gray-800 text-[#09fff0] border-gray-700 focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select a prompt type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="business" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Business</SelectItem>
                          <SelectItem value="personal" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Personal</SelectItem>
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
                          <SelectTrigger className="bg-gray-800 text-[#09fff0] border-gray-700 focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="student" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Student</SelectItem>
                          <SelectItem value="professional" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Professional</SelectItem>
                          <SelectItem value="entrepreneur" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Entrepreneur</SelectItem>
                          <SelectItem value="manager" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Manager</SelectItem>
                          <SelectItem value="executive" className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {/* Add similar FormField components for age, gender, and expertise */}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 3: What kind of output do you want?</h2>
                {/* Add FormField components for output format, tone, length, numberOfResults, and presentationFormat */}
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-4 text-[#E904E5]">Step 4: Provide context for your prompt</h2>
                {watchPromptType === "business" && (
                  <Controller
                    name="businessOptions"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Business Focus Areas</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const newValue = [...(field.value || []), value];
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger className="bg-gray-800 text-[#09fff0] border-gray-700 focus:ring-[#09fff0] focus:ring-opacity-50">
                              <SelectValue placeholder="Select business areas" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {businessOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((option: string) => (
                            <Button
                              key={option}
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const newValue = field.value?.filter((o: string) => o !== option);
                                field.onChange(newValue);
                              }}
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
                  <Controller
                    name="lifeOptions"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Life Focus Areas</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const newValue = [...(field.value || []), value];
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger className="bg-gray-800 text-[#09fff0] border-gray-700 focus:ring-[#09fff0] focus:ring-opacity-50">
                              <SelectValue placeholder="Select life areas" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              {lifeOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-[#09fff0] hover:bg-gray-700 focus:bg-gray-700">{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((option: string) => (
                            <Button
                              key={option}
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const newValue = field.value?.filter((o: string) => o !== option);
                                field.onChange(newValue);
                              }}
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
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="bg-gray-700 text-gray-200 hover:bg-gray-600">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={() => setStep(step + 1)} className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-[#09fff0] text-gray-900 hover:bg-[#09fff0]/90">
              Generate Prompt
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}