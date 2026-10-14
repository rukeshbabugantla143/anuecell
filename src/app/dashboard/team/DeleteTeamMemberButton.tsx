'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteTeamMemberButton({ 
  id, 
  name,
  onDeleted
}: { 
  id: string
  name: string
  onDeleted?: () => void
}) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete "${name}" from the team? This action cannot be undone.`)) {
      return
    }

    try {
      setDeleting(true)
      const { error } = await supabase.from('team_members').delete().eq('id', id)
      if (error) throw new Error(error.message)

      const row = (e.target as HTMLElement).closest('tr')
      if (row) {
        row.style.opacity = '0'
        row.style.transition = 'all 0.3s ease'
        setTimeout(() => row.remove(), 300)
      }

      if (onDeleted) {
        onDeleted()
      } else {
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete team member: ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="px-3 py-2 h-auto text-secondary-text hover:text-functional-error hover:bg-functional-error/10 rounded-lg transition-colors"
      title={`Delete ${name}`}
    >
      {deleting ? (
        <Loader2 className="h-4 w-4 animate-spin text-functional-error" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  )
}
