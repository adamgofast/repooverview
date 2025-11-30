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
        const { auth } = await import('@/lib/client.firebase')
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

  const handleGoogleSignIn = async () => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const { signInWithPopup } = await import('firebase/auth')
      const { auth, googleProvider } = await import('@/lib/client.firebase')
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Auto-upsert owner with Trunorth
      try {
        const upsertResponse = await fetch('/api/auth/upsert-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseId: user.uid,
            email: user.email,
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
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
      console.error('Google sign in error:', err)
      let errorMessage = 'Failed to sign in with Google'
      if (err.message?.includes('configuration')) {
        errorMessage = 'Firebase is not properly configured. Please contact support.'
      } else if (err.message) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { auth } = await import('@/lib/client.firebase')
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
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </div>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => router.push('/signup')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
