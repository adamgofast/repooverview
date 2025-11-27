'use client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    // Show splash for 1 second, then check auth
    const timer = setTimeout(async () => {
      try {
        // Dynamically import Firebase to avoid build-time execution
        const { onAuthStateChanged } = await import('firebase/auth')
        const { getAuth } = await import('@/lib/client.firebase')
        const auth = await getAuth()
        unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            router.replace('/dashboard')
          } else {
            router.replace('/signup')
          }
        })
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/signup')
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-8 flex justify-center">
          <Image
            src="/TruNorth.png"
            alt="Trunorth"
            width={128}
            height={128}
            className="h-32 w-32 object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Trunorth Stack Overview
        </h1>
        <p className="text-xl text-white/80 mb-4">
          Project Mission Control
        </p>
        <p className="text-lg text-white/60">
          Loading...
        </p>
      </div>
    </div>
  )
}
