import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Calendar, Tag, User, Clock, ArrowRight, Share2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata, getAbsoluteImageUrl } from '@/lib/seo'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'

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

  if (!post) {
    // If not found in DB
    notFound()
  }

  const title = post.title
  const content = post.content || post.excerpt || 'Full article content will be published soon.'
  const category = post.category || 'Startup Insights'
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  // Calculate read time
  const wordCount = content.trim().split(/\s+/).length
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 pt-24 px-4 sm:px-8 lg:px-[6vw]">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary-cyan/10 blur-[130px] rounded-full pointer-events-none" />

      <article className="max-w-4xl mx-auto relative z-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-secondary-text hover:text-primary-cyan transition-colors mb-8 group text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>

        {/* Meta Header */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <Badge variant="info" className="border-primary-cyan/30 text-primary-cyan bg-primary-cyan/10 font-bold px-3 py-1">
            {category}
          </Badge>
          <span className="text-secondary-text text-xs sm:text-sm flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-text" /> {dateStr}
          </span>
          <span className="text-muted-text text-xs sm:text-sm">•</span>
          <span className="text-secondary-text text-xs sm:text-sm flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-text" /> {readTimeMinutes} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-primary-text mb-6 leading-tight tracking-tight">
          {title}
        </h1>

        {/* Excerpt Lead */}
        {post.excerpt && (
          <p className="text-lg sm:text-xl text-secondary-text font-medium leading-relaxed mb-8 border-l-2 border-primary-cyan/50 pl-4 py-1 italic">
            {post.excerpt}
          </p>
        )}

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative w-full h-[320px] sm:h-[460px] rounded-2xl overflow-hidden mb-12 border border-border-color shadow-2xl">
            <img
              src={post.cover_image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div className="bg-[#101827]/60 backdrop-blur-md border border-border-color rounded-2xl p-6 sm:p-10 shadow-xl mb-12">
          <MarkdownRenderer content={content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-8 border-b border-border-color">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-text flex items-center gap-1 mr-2">
              <Tag className="h-3.5 w-3.5 text-primary-cyan" /> Tags:
            </span>
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-xs bg-[#151F30] text-secondary-text border border-border-color hover:border-primary-cyan/40 hover:text-primary-cyan transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author / Community Callout */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#101827] to-[#151F30] border border-border-color flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-cyan to-blue-600 flex items-center justify-center font-heading font-black text-white text-xl shadow-[0_0_20px_rgba(0,217,255,0.4)] shrink-0">
              E
            </div>
            <div>
              <h4 className="font-heading font-bold text-primary-text text-base">Published by ANU E-Cell</h4>
              <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
                Acharya Nagarjuna University • Empowering student founders and visionaries.
              </p>
            </div>
          </div>
          <Link href="/join">
            <Button variant="primary" size="sm" className="gap-2 shrink-0">
              Join E-Cell Community <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </article>
    </main>
  )
}
