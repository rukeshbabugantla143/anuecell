'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DeleteBlogPostButton({ id, title }: { id: string; title?: string }) {
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmMsg = title 
      ? `Are you sure you want to delete "${title}"? This action cannot be undone.`
      : 'Are you sure you want to delete this blog post? This action cannot be undone.'

    if (!window.confirm(confirmMsg)) return

    try {
      setDeleting(true)
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw new Error(error.message)

      const row = (e.target as HTMLElement).closest('tr')
      if (row) {
        row.style.opacity = '0'
        row.style.transform = 'translateX(20px)'
        row.style.transition = 'all 0.3s ease'
        setTimeout(() => row.remove(), 300)
      }
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete post: ' + err.message)
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
      className="px-3 py-1.5 h-auto text-secondary-text hover:text-functional-error hover:bg-functional-error/10 rounded-lg text-xs font-semibold transition-colors"
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
      )}
      Delete
    </Button>
  )
}
