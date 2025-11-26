'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BuildHistoryProps {
  projectId: string
  initialHistory: string[]
  onUpdate: () => void
}

export function BuildHistory({ projectId, initialHistory, onUpdate }: BuildHistoryProps) {
  const [history, setHistory] = useState<string[]>(initialHistory)
  const [newEntry, setNewEntry] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async () => {
    if (!newEntry.trim()) return

    const updated = [newEntry, ...history]
    setHistory(updated)
    setNewEntry('')
    setSaving(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildHistory: updated }),
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save build history:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Build History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Add build entry..."
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={saving || !newEntry.trim()}>
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No build history yet.</p>
          ) : (
            history.map((entry, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded border text-sm">
                {entry}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

