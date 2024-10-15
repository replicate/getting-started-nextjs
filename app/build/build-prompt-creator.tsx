'use client';

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Poppins } from 'next/font/google'
import { BuildPromptForm } from './build-prompt-form'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export function BuildPromptCreator() {
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [promptSent, setPromptSent] = useState(false)

  const handleGeneratePrompt = (prompt: string) => {
    setGeneratedPrompt(prompt)
  }

  const handleSendToAI = async () => {
    setIsLoading(true)
    setPromptSent(true)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: generatedPrompt }),
        signal: controller.signal
      })

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAiResponse(data.result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader className={`${poppins.className} text-center`}>
          <CardTitle className="text-3xl font-bold text-[#09fff0]">AI Prompt Creator</CardTitle>
          <CardDescription className="text-lg text-gray-400">Create your perfect AI prompt in 4 easy steps.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <BuildPromptForm onGeneratePrompt={handleGeneratePrompt} promptSent={promptSent} />
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-4 bg-gray-700 rounded-lg shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-2 text-[#09fff0]">Generated Prompt:</h2>
              <p className="p-2 bg-gray-600 rounded text-gray-200">{generatedPrompt}</p>
              {!promptSent && (
                <div className="mt-4">
                  <Button
                    onClick={handleSendToAI}
                    disabled={isLoading}
                    className="bg-[#09fff0] text-gray-900 px-4 py-2 rounded hover:bg-[#09fff0]/90 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send to AI"}
                  </Button>
                </div>
              )}
            </motion.div>
          )}
          {isLoading && (
            <div className="mt-4 text-center">
              <p className="text-[#09fff0] text-xl">Waiting for AI response...</p>
            </div>
          )}
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 p-4 bg-gray-700 rounded-lg shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-2 text-[#09fff0]">AI Response:</h2>
              <p className="p-2 bg-gray-600 rounded text-gray-200 whitespace-pre-wrap">{aiResponse}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}