import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Calendar, Tag, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata, getAbsoluteImageUrl } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, slug, excerpt, content, cover_image_url, category, tags, published_at, created_at, seo_title, seo_description')
    .eq('slug', decodedSlug)
    .maybeSingle()

  if (post) {
    const title = post.seo_title || post.title
    const description =
      post.seo_description ||
      post.excerpt ||
      post.content?.replace(/<[^>]*>?/gm, '').slice(0, 160) ||
      `Read the full article ${post.title} on ANU E-Cell NEC.`

    return constructMetadata({
      title: `${title} | Blog`,
      description,
      image: getAbsoluteImageUrl(post.cover_image_url),
      imageAlt: `${post.title} - Cover Image`,
      canonicalPath: `/blog/${encodeURIComponent(decodedSlug)}`,
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      tags: post.tags && post.tags.length > 0 ? post.tags : [post.category || 'Entrepreneurship'],
    })
  }

  // Fallback if record not yet saved in DB
  const formattedTitle = decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return constructMetadata({
    title: `${formattedTitle} | Blog`,
    description: `Read insightful founder stories and startup lessons on ${formattedTitle} at ANU E-Cell NEC.`,
    canonicalPath: `/blog/${encodeURIComponent(decodedSlug)}`,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', decodedSlug)
    .maybeSingle()

  const title = post?.title || decodedSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const content = post?.content || post?.excerpt || 'Full article content will be published soon.'
  const category = post?.category || 'Startup Insights'
  const dateStr = post?.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 pt-24 px-4 sm:px-8 lg:px-[6vw]">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-cyan transition-colors mb-8">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Link>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="info" className="border-primary-cyan/30 text-primary-cyan bg-primary-cyan/10">
            {category}
          </Badge>
          {dateStr && (
            <span className="text-secondary-text text-sm flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {dateStr}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary-text mb-8 leading-tight">
          {title}
        </h1>

        {post?.cover_image_url && (
          <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden mb-10 border border-border-color">
            <img 
              src={post.cover_image_url} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none text-secondary-text text-lg leading-relaxed space-y-6">
          <p>{content}</p>
        </div>
      </article>
    </main>
  )
}
