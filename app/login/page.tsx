'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let unsubscribe: (() => void) | undefined
    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth')
        const { getAuth } = await import('@/lib/client.firebase')
        const auth = await getAuth()
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.replace('/dashboard')
          }
        })
      } catch (error: any) {
        console.error('Auth init error:', error)
        // Show error to user if Firebase config is missing
        if (error.message?.includes('configuration') || error.message?.includes('Firebase')) {
          setError('Firebase is not properly configured. Please contact support.')
        }
      }
    }
    initAuth()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [router, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Trunorth Stack Overview</CardTitle>
            <CardDescription>Sign in to access your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { getAuth } = await import('@/lib/client.firebase')
      const auth = await getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Auto-upsert owner with Trunorth
      try {
        const upsertResponse = await fetch('/api/auth/upsert-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseId: userCredential.user.uid,
            email: userCredential.user.email,
          }),
        })
        
        if (!upsertResponse.ok) {
          const errorData = await upsertResponse.json().catch(() => ({}))
          console.error('Upsert owner failed:', errorData)
          // Don't block login if upsert fails - user is still authenticated
        }
      } catch (upsertError) {
        console.error('Upsert owner error:', upsertError)
        // Don't block login if upsert fails - user is still authenticated
      }
      
      router.replace('/dashboard')
    } catch (err: any) {
      console.error('Sign in error:', err)
      // Provide more user-friendly error messages
      let errorMessage = 'Failed to sign in'
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address'
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password'
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (err.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Trunorth Stack Overview</CardTitle>
          <CardDescription>Sign in to access your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
