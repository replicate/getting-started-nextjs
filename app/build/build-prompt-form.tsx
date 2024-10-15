'use client';

import { useState } from 'react'
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
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react"
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
  const stepTitles = ["Choose your prompt type", "Who are you asking as?", "What kind of output do you want?", "Provide context for your prompt"];

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-5xl mx-auto">
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
                <h2 className="text-2xl font-semibold mb-4 text-primary">Step {step}: {stepTitles[step - 1]}</h2>
                <FormField
                  control={form.control}
                  name="promptType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Prompt Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select a prompt type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="business" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Business</SelectItem>
                          <SelectItem value="personal" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Personal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Step {step}: {stepTitles[step - 1]}</h2>
                <FormField
                  control={form.control}
                  name="persona.role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="student" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Student</SelectItem>
                          <SelectItem value="professional" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Professional</SelectItem>
                          <SelectItem value="entrepreneur" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Entrepreneur</SelectItem>
                          <SelectItem value="manager" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Manager</SelectItem>
                          <SelectItem value="executive" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Executive</SelectItem>
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
                      <FormLabel className="text-primary">Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter age"
                          className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="persona.gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="male" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Male</SelectItem>
                          <SelectItem value="female" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Female</SelectItem>
                          <SelectItem value="non-binary" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Non-binary</SelectItem>
                          <SelectItem value="other" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Other</SelectItem>
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
                      <FormLabel className="text-primary">Expertise</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter area of expertise"
                          className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Step {step}: {stepTitles[step - 1]}</h2>
                <FormField
                  control={form.control}
                  name="output.format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Output Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="blog-post" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Blog Post</SelectItem>
                          <SelectItem value="social-media-post" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Social Media Post</SelectItem>
                          <SelectItem value="email" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Email</SelectItem>
                          <SelectItem value="article" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Article</SelectItem>
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
                      <FormLabel className="text-primary">Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="formal" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Formal</SelectItem>
                          <SelectItem value="casual" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Casual</SelectItem>
                          <SelectItem value="humorous" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Humorous</SelectItem>
                          <SelectItem value="serious" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Serious</SelectItem>
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
                      <FormLabel className="text-primary">Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="short" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Short</SelectItem>
                          <SelectItem value="medium" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Medium</SelectItem>
                          <SelectItem value="long" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="output.numberOfResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Number of Results</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select number of results" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="1" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">1</SelectItem>
                          <SelectItem value="3" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">3</SelectItem>
                          <SelectItem value="5" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="output.presentationFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Presentation Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select presentation format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#374151] border-[#4B5563]">
                          <SelectItem value="paragraph" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Paragraph</SelectItem>
                          <SelectItem value="bullet-points" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Bullet Points</SelectItem>
                          <SelectItem value="numbered-list" className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">Numbered List</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Step {step}: {stepTitles[step - 1]}</h2>
                {watchPromptType === "business" && (
                  <FormField
                    control={form.control}
                    name="businessOptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary">Business Focus Areas</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const newValue = [...(field.value || []), value];
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                              <SelectValue placeholder="Select business areas" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#374151] border-[#4B5563]">
                              {businessOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">{option}</SelectItem>
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
                              className="bg-[#4B5563] text-white hover:bg-[#6B7280]"
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
                        <FormLabel className="text-primary">Life Focus Areas</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const newValue = [...(field.value || []), value];
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                              <SelectValue placeholder="Select life areas" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#374151] border-[#4B5563]">
                              {lifeOptions.map((option) => (
                                <SelectItem key={option} value={option} className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">{option}</SelectItem>
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
                              className="bg-[#4B5563] text-white hover:bg-[#6B7280]"
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
                  name="socialPlatforms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Social Platforms</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const newValue = [...(field.value || []), value];
                            field.onChange(newValue);
                          }}
                        >
                          <SelectTrigger className="bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50">
                            <SelectValue placeholder="Select social platforms" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#374151] border-[#4B5563]">
                            {socialPlatforms.map((platform) => (
                              <SelectItem key={platform} value={platform} className="text-white hover:bg-[#4B5563] focus:bg-[#4B5563]">{platform}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((platform: string) => (
                          <Button
                            key={platform}
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              const newValue = field.value?.filter((p: string) => p !== platform);
                              field.onChange(newValue);
                            }}
                            className="bg-[#4B5563] text-white hover:bg-[#6B7280]"
                          >
                            {platform} ✕
                          </Button>
                        ))}
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="context"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary">Context</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what you want the AI to create..."
                          className="resize-none bg-[#374151] text-white border-[#4B5563] focus:ring-[#09fff0] focus:ring-opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[#9CA3AF]">
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
        <div className="flex justify-end gap-4 mt-8">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="bg-transparent text-primary hover:bg-accent border-accent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={() => setStep(step + 1)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Generate Prompt
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}