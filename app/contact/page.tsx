'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Here you would typically send the form data to your server
      console.log(values)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulating API call
      toast({
        title: "Message sent",
        description: "We've received your message and will get back to you soon.",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 mb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-2 text-gray-400">We&apos;d love to hear from you!</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="bg-gray-700 text-white border-gray-600" />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Please enter your full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email" {...field} className="bg-gray-700 text-white border-gray-600" />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        We&apos;ll never share your email with anyone else.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Type your message here." 
                          className="resize-none bg-gray-700 text-white border-gray-600" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Please provide details about your inquiry.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-[#09fff0] text-gray-900 hover:bg-[#08e6d9]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </main>
      <Toaster />
    </div>
  )
}