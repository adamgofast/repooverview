'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface NotesEditorProps {
  projectId: string
  initialNotes: string
  onUpdate: () => void
}

export function NotesEditor({ projectId, initialNotes, onUpdate }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to save notes:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes here (Markdown supported)..."
          className="min-h-[400px] font-mono text-sm"
        />
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Notes'}
        </Button>
      </CardContent>
    </Card>
  )
}

