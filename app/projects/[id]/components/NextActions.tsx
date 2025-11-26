'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NextActionsProps {
  projectId: string
  type: 'bugs' | 'milestones'
  initialItems: string[]
  onUpdate: () => void
}

export function NextActions({ projectId, type, initialItems, onUpdate }: NextActionsProps) {
  const [items, setItems] = useState<string[]>(initialItems)
  const [newItem, setNewItem] = useState('')
  const [saving, setSaving] = useState(false)

  const title = type === 'bugs' ? 'Open Bugs' : 'Next Milestones'
  const placeholder = type === 'bugs' ? 'Add a bug...' : 'Add a milestone...'

  const handleAdd = async () => {
    if (!newItem.trim()) return

    const updated = [...items, newItem]
    setItems(updated)
    setNewItem('')
    setSaving(true)

    try {
      const field = type === 'bugs' ? 'openBugs' : 'nextMilestones'
      const res = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: updated }),
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

  const handleRemove = async (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    setSaving(true)

    try {
      const field = type === 'bugs' ? 'openBugs' : 'nextMilestones'
      const res = await fetch(`/api/projects/${projectId}/details`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: updated }),
      })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to remove:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={saving || !newItem.trim()}>
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items yet.</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <span className="text-sm">{item}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(idx)}
                  disabled={saving}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

