'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface ClientOwesProps {
  projectId: string
  initialClientOwes: string
  initialIOwe: string
  onUpdate: () => void
}

export function ClientOwes({ projectId, initialClientOwes, initialIOwe, onUpdate }: ClientOwesProps) {
  const [clientOwes, setClientOwes] = useState(initialClientOwes)
  const [iOwe, setIOwe] = useState(initialIOwe)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientOwesMe: clientOwes, iOweClient: iOwe }),
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Owes Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={clientOwes}
            onChange={(e) => setClientOwes(e.target.value)}
            placeholder="What does the client owe you?"
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>I Owe Client</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={iOwe}
            onChange={(e) => setIOwe(e.target.value)}
            placeholder="What do you owe the client?"
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
      <div className="md:col-span-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

