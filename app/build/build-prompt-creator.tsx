'use client';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Poppins } from 'next/font/google'
import { BuildPromptForm } from './build-prompt-form'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Copy, Download } from 'lucide-react'

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

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(aiResponse)
      .then(() => alert('Output copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  }

  const handleDownloadOutput = () => {
    const element = document.createElement('a');
    const file = new Blob([aiResponse], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'ai_response.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <Card className="w-full max-w-6xl mx-auto border-accent bg-background text-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">AI Prompt Creator</CardTitle>
          <CardDescription className="text-lg text-[#9CA3AF]">Create your perfect AI prompt in 4 easy steps.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <BuildPromptForm onGeneratePrompt={handleGeneratePrompt} promptSent={promptSent} />
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-4 bg-accent/20 rounded-lg shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-2 text-primary">Generated Prompt:</h2>
              <p className="p-2 bg-accent/30 rounded text-foreground">{generatedPrompt}</p>
              {!promptSent && (
                <div className="mt-4">
                  <Button
                    onClick={handleSendToAI}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-50"
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
              className="mt-8 p-4 bg-accent/20 rounded-lg shadow-inner"
            >
              <h2 className="text-xl font-semibold mb-2 text-primary">AI Response:</h2>
              <p className="p-2 bg-accent/30 rounded text-foreground whitespace-pre-wrap">{aiResponse}</p>
              <div className="mt-4 flex space-x-4">
                <Button
                  onClick={handleCopyOutput}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Output
                </Button>
                <Button
                  onClick={handleDownloadOutput}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download as .txt
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
  )
}