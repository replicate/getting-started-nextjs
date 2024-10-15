'use client';

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Instagram, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Prediction {
  id: string;
  status: string;
  output: string[];
  detail: string;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const BackgroundPattern = () => (
  <svg className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" aria-hidden="true">
    <defs>
      <pattern id="pattern-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 20V0h20v20zM10 10h10v10H10z" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#pattern-1)" />
  </svg>
);

export default function VisualizeContent({ initialPrompt }: { initialPrompt: string }) {
  const router = useRouter();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    promptInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setPrediction(null)

    try {
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      })
      let prediction: Prediction = await response.json()
      if (response.status !== 201) {
        throw new Error(prediction.detail)
      }
      setPrediction(prediction)
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000)
        const response = await fetch(`/api/predictions/${prediction.id}`)
        prediction = await response.json()
        if (response.status !== 200) {
          throw new Error(prediction.detail)
        }
        setPrediction(prediction)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (prediction?.output && prediction.output.length > 0) {
      const link = document.createElement('a')
      link.href = prediction.output[prediction.output.length - 1]
      link.download = 'ai-generated-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      })
    }
  }

  const handleInstagramShare = () => {
    if (prediction?.output && prediction.output.length > 0) {
      const imageUrl = encodeURIComponent(prediction.output[prediction.output.length - 1])
      const instagramUrl = `https://www.instagram.com/share?url=${imageUrl}`
      window.open(instagramUrl, '_blank')
      toast({
        title: "Instagram",
        description: "Opening Instagram sharing...",
      })
    }
  }

  const handleImageToText = () => {
    if (prediction?.output && prediction.output.length > 0) {
      const imageUrl = prediction.output[prediction.output.length - 1]
      router.push(`/image-to-text?image=${encodeURIComponent(imageUrl)}`)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 mb-4 relative overflow-hidden">
        <BackgroundPattern />
        <CardHeader>
          <CardTitle className="text-center text-[#E904E5] text-3xl font-bold flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-2 text-lime-400" />
            Imagine with AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex space-x-2 relative z-10" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="prompt"
              placeholder="Enter a prompt to display an image"
              ref={promptInputRef}
              className="flex-grow bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900 font-semibold px-6 py-2 rounded-[12px] transition-colors duration-200"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </form>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
          {prediction && (
            <div className="mt-4">
              {prediction.output && (
                <div className="relative aspect-square w-full">
                  <Image
                    fill
                    src={prediction.output[prediction.output.length - 1]}
                    alt="AI-generated image"
                    sizes="100vw"
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <p className="py-3 text-sm text-gray-300">Status: {prediction.status}</p>
            </div>
          )}
        </CardContent>
        {prediction?.output && prediction.output.length > 0 && (
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              className="text-[#09fff0] border-[#09fff0] hover:bg-[#09fff0] hover:text-gray-900 rounded-[12px]"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              onClick={handleInstagramShare}
              variant="outline"
              className="text-[#09fff0] border-[#09fff0] hover:bg-[#09fff0] hover:text-gray-900 rounded-[12px]"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Share on Instagram
            </Button>
            <Button 
              onClick={handleImageToText} 
              variant="outline" 
              className="text-[#09fff0] border-[#09fff0] hover:bg-[#09fff0] hover:text-gray-900 rounded-[12px]"
            >
              <FileText className="mr-2 h-4 w-4" />
              Image to Text
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}