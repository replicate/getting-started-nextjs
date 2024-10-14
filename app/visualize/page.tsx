import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Mail, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";


interface Prediction {
  id: string;
  status: string;
  output: string[];
  detail: string; 
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function VisualizeContent() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const promptInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
    promptInputRef.current?.focus();
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    let prediction: Prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      setIsLoading(false);
      return;
    }
    setPrediction(prediction);
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch(`/api/predictions/${prediction.id}`);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        setIsLoading(false);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (prediction?.output && prediction.output.length > 0) {
      const link = document.createElement('a');
      link.href = prediction.output[prediction.output.length - 1];
      link.download = 'ai-generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEmail = () => {
    if (prediction?.output && prediction.output.length > 0) {
      const emailBody = encodeURIComponent(`Check out this AI-generated image: ${prediction.output[prediction.output.length - 1]}`);
      window.location.href = `mailto:?subject=AI-Generated Image&body=${emailBody}`;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <CardTitle className="text-center text-white">
          Imagine with AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex space-x-2" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="prompt"
            placeholder="Enter a prompt to display an image"
            ref={promptInputRef}
            className="flex-grow bg-gray-700 text-white placeholder-gray-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit" disabled={isLoading} className="bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Go!"}
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
          <Button onClick={handleDownload} variant="outline" className="text-[#09fff0] border-[#09fff0] hover:bg-[#09fff0] hover:text-gray-900">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleEmail} variant="outline" className="text-[#09fff0] border-[#09fff0] hover:bg-[#09fff0] hover:text-gray-900">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Visualize() {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 p-4 font-sans">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VisualizeContent />
      </Suspense>
    </div>
  );
}