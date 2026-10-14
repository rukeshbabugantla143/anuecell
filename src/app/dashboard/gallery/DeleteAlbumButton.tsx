'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteAlbumButton({ 
  id, 
  title,
  onDeleted
}: { 
  id: string
  title: string
  onDeleted?: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm(`Are you sure you want to delete the album "${title}" and all its photos?`)) {
      return
    }

    try {
      setDeleting(true)
      const { error } = await supabase.from('albums').delete().eq('id', id)
      if (error) throw new Error(error.message)
      if (onDeleted) onDeleted(id)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete album: ' + err.message)
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
      className="p-2 h-auto text-muted-text hover:text-functional-error hover:bg-functional-error/20 rounded-lg transition-colors"
      title="Delete Album"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin text-functional-error" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
