'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Brain, ChevronLeft, ChevronRight, Send } from "lucide-react"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

interface StyleOption {
  label: string
  value: string
}

const styleOptions: StyleOption[] = [
  { label: "Photorealistic", value: "photorealistic" },
  { label: "Digital Art", value: "digital-art" },
  { label: "Oil Painting", value: "oil-painting" },
  { label: "Watercolor", value: "watercolor" },
  { label: "Sketch", value: "sketch" },
]

const colorThemes: StyleOption[] = [
  { label: "Vibrant", value: "vibrant" },
  { label: "Pastel", value: "pastel" },
  { label: "Monochrome", value: "monochrome" },
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
]

export default function Component() {
  const [currentStep, setCurrentStep] = useState(0)
  const [notes, setNotes] = useState(["", "", "", ""])
  const [formattedPrompt, setFormattedPrompt] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("photorealistic")
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>("vibrant")
  const router = useRouter()

  const instructions = [
    {
      title: "Imagine Your Ideal Character",
      description: "Visualize your perfect leader, creator, or problem solver.",
      steps: [
        "Close your eyes and picture your ideal character in your mind.",
        "Consider their appearance, posture, and overall presence.",
        "Think about the environment they might be in.",
      ],
    },
    {
      title: "Define Key Attributes",
      description: "Identify the core qualities that make them exceptional.",
      steps: [
        "List 3-5 key attributes (e.g., wisdom, creativity, determination).",
        "Imagine how these qualities might be visually represented.",
        "Consider symbols or objects that represent these attributes.",
      ],
    },
    {
      title: "Set the Scene",
      description: "Create a context that showcases their abilities.",
      steps: [
        "Decide on a setting that highlights their role (e.g., office, lab, outdoors).",
        "Think about the mood and atmosphere of the scene.",
        "Visualize any tools or equipment they might be using.",
      ],
    },
    {
      title: "Craft Your Prompt",
      description: "Combine your ideas into a clear, detailed prompt.",
      steps: [
        "Start with a brief description of the character and their role.",
        "Include key visual elements: appearance, attributes, and setting.",
        "Add specific details about pose, expression, and any important objects.",
      ],
    },
  ]

  const handlePrevious = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentStep((prev) => (prev < instructions.length - 1 ? prev + 1 : prev))
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = [...notes]
    newNotes[currentStep] = e.target.value
    setNotes(newNotes)
  }

  const generatePrompt = () => {
    const [character, attributes, scene, details] = notes.map(note => note.trim())
    const formattedPrompt = `
      A highly detailed, ${selectedStyle} image of an ideal ${character}.
      
      Key attributes: ${attributes}.
      
      Setting: ${scene}.
      
      Additional details: The character is ${details}.
      
      Style: ${selectedStyle}, ${selectedColorTheme} color theme, high resolution, dramatic lighting.
    `.trim().replace(/\n\s+/g, ' ')
    setFormattedPrompt(formattedPrompt)
  }

  const sendToVisualizePage = () => {
    const encodedPrompt = encodeURIComponent(formattedPrompt)
    router.push(`/visualize?prompt=${encodedPrompt}`)
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 mb-4">
        <CardHeader className={poppins.className}>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-[#09fff0]" />
            <CardTitle className="text-2xl font-bold text-white">{instructions[currentStep].title}</CardTitle>
          </div>
          <CardDescription className="text-gray-300">{instructions[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {instructions[currentStep].steps.map((step, index) => (
              <li key={index} className="text-sm text-gray-200">{step}</li>
            ))}
          </ol>
          <Textarea
            placeholder="Add your thoughts here, your inputs are saved as you go"
            value={notes[currentStep]}
            onChange={handleNoteChange}
            className="w-full bg-gray-700 text-white border-gray-600"
          />
          {currentStep === instructions.length - 1 && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="style" className="text-white">Select Style</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger id="style" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-theme" className="text-white">Select Color Theme</Label>
                <Select value={selectedColorTheme} onValueChange={setSelectedColorTheme}>
                  <SelectTrigger id="color-theme" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorThemes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-300">
            Step {currentStep + 1} of {instructions.length}
          </div>
          {currentStep < instructions.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={generatePrompt}
              className="bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900"
            >
              Generate Prompt
            </Button>
          )}
        </CardFooter>
      </Card>
      {formattedPrompt && (
        <Card className="w-full max-w-md bg-gray-800 border-gray-700 mt-4">
          <CardHeader>
            <CardTitle className="text-white">Generated Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formattedPrompt}
              readOnly
              className="w-full bg-gray-700 text-white border-gray-600 mb-4"
            />
            <Button
              onClick={sendToVisualizePage}
              className="w-full bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900"
            >
              <Send className="mr-2 h-4 w-4" />
              Send to Visualize Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}