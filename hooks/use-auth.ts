import { useState, useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (err) {
      setError('An error occurred during Google login.')
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await signOut({ callbackUrl: '/' })
    } catch (err) {
      setError('An error occurred during logout.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    session,
    status,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
  }
}