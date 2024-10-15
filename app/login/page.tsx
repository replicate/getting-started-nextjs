'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FaGoogle } from 'react-icons/fa';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Here you would typically call your API to create a new user
      // For this example, we'll simulate a successful sign-up
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. Please log in.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: error instanceof Error ? error.message : "An error occurred during sign up.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="text-center mb-4">
            <Image
              src="/ttm.png"
              alt="The Tech Margin Logo"
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-[#09fff0]">Sign Up for Safe-AI</CardTitle>
          <CardDescription className="text-center text-gray-300">Create your account to explore AI safely</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-700 text-white border-gray-600 focus:border-[#09fff0] focus:ring-[#09fff0]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#09fff0] hover:bg-[#08e6d8] text-gray-900 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-300">
            <span>Or sign up with</span>
          </div>
          <Button
            onClick={handleGoogleSignUp}
            className="w-full mt-4 bg-white hover:bg-gray-200 text-gray-900 font-semibold flex items-center justify-center"
          >
            <FaGoogle className="mr-2" />
            Sign up with Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-[#E904E5] hover:text-[#D003D1]"
            onClick={() => router.push('/login')}
          >
            Already have an account? Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}