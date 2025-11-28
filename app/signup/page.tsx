'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignUp = async () => {
    if (isSigningUp) return

    setIsSigningUp(true)
    try {
      const { signInWithGoogle } = await import('@/lib/client.firebase')
      const result = await signInWithGoogle()
      const firstName = result.name?.split(' ')[0] || ''
      const lastName = result.name?.split(' ').slice(1).join(' ') || ''

      // Auto-upsert owner with Trunorth
      const response = await fetch('/api/auth/upsert-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseId: result.uid,
          email: result.email,
          firstName,
          lastName,
        }),
      })

      if (!response.ok) {
        throw new Error('Owner creation failed')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Google signup failed:', error)
      alert('Signup failed. Please try again.')
    } finally {
      setIsSigningUp(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="space-y-4">
          <div className="mx-auto flex justify-center">
            <Image
              src="/TruNorth.png"
              alt="Trunorth"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Welcome to Trunorth!
          </h1>
          <p className="text-white/80">
            Sign up to access your project dashboard
          </p>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={isSigningUp}
          className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{isSigningUp ? 'Signing up...' : 'Sign up with Google'}</span>
        </button>

        <p className="text-white/80 text-sm">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-400 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}
