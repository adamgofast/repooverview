'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectList } from './components/ProjectList'
import { Button } from '@/components/ui/button'
import { useFiltersStore } from '@/stores/filters'
import { Input } from '@/components/ui/input'

export default function DashboardClient() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { searchQuery, setSearchQuery } = useFiltersStore()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    const initAuth = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth')
        const { getAuth } = await import('@/lib/firebase')
        const auth = await getAuth()
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUser(user)
            // Ensure owner exists
            try {
              await fetch('/api/auth/upsert-owner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  firebaseId: user.uid,
                  email: user.email,
                }),
              })
            } catch (error) {
              console.error('Failed to upsert owner:', error)
            }
            setLoading(false)
          } else {
            router.push('/auth')
          }
        })
      } catch (error) {
        console.error('Auth init error:', error)
        router.push('/auth')
      }
    }
    initAuth()
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      const { signOut } = await import('firebase/auth')
      const { getAuth } = await import('@/lib/firebase')
      const auth = await getAuth()
      await signOut(auth)
      router.push('/auth')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trunorth Stack Overview</h1>
            <p className="text-gray-600 mt-1">Project Mission Control</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <ProjectList />
      </div>
    </div>
  )
}

