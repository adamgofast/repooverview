'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth')
        const { getAuth } = await import('@/lib/firebase')
        const auth = await getAuth()
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.push('/dashboard')
          }
        })
      } catch (error) {
        console.error('Auth init error:', error)
      }
    }
    initAuth()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      const { getAuth } = await import('@/lib/firebase')
      const auth = await getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Auto-upsert owner with Trunorth
      await fetch('/api/auth/upsert-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseId: userCredential.user.uid,
          email: userCredential.user.email,
        }),
      })
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
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

