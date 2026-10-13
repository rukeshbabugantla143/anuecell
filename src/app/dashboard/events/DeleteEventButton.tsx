'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteEventButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return
    
    try {
      setDeleting(true)
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw new Error(error.message)
      
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert("Failed to delete event: " + err.message)
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
      className="px-3 py-2 h-auto text-secondary-text hover:text-functional-error hover:bg-functional-error/10 rounded-lg"
    >
      {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
      Delete
    </Button>
  )
}
