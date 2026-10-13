'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteGalleryImageButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) return
    
    try {
      setDeleting(true)
      const { error } = await supabase.from('gallery_items').delete().eq('id', id)
      if (error) throw new Error(error.message)
      
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert("Failed to delete image: " + err.message)
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
      className="absolute top-2 right-2 p-2 h-auto text-white hover:text-functional-error hover:bg-functional-error/20 bg-black/50 backdrop-blur-sm rounded-lg"
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}
