import Link from 'next/link'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import BlogTable, { BlogPost } from './BlogTable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardBlogPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, category, tags, is_published, published_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts for dashboard:', error)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary-bg/50 p-6 rounded-2xl border border-border-color shadow-sm backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary-cyan" />
            Blog & Articles Management
          </h1>
          <p className="text-sm text-secondary-text">
            Publish, edit, and curate articles, startup frameworks, and founder stories for ANU E-Cell.
          </p>
        </div>
        <Link href="/dashboard/blog/new">
          <Button
            variant="primary"
            className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all px-6 py-5 text-sm font-bold"
          >
            <Plus className="h-5 w-5" /> Write New Article
          </Button>
        </Link>
      </div>

      {/* Interactive Table with Search, Filter & Stats */}
      <BlogTable initialPosts={(posts as BlogPost[]) || []} />
    </div>
  )
}
