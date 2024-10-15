import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signup = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'An error occurred during signup.')
      }

      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup.')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return {
    isLoading,
    error,
    signup,
  }
}