import type { Metadata } from 'next'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = constructMetadata({
  title: "Blog & Startup Insights | Founder Stories",
  description:
    "Read insightful articles, startup frameworks, student founder stories, and tech trends published by ANU E-Cell NEC.",
  canonicalPath: "/blog",
  tags: ["Startup Blog", "Founder Stories", "Innovation Guides", "ANU E-Cell"],
})

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image_url, category, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 pt-20 px-4 sm:px-8 lg:px-[6vw]">
      <div className="max-w-6xl mx-auto pt-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-6 inline-flex border-primary-cyan/30 text-primary-cyan px-4 py-1.5 bg-primary-cyan/10">
            Knowledge Base & Stories
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary-text mb-6">
            ANU E-Cell <span className="text-primary-cyan">Blog</span>
          </h1>
          <p className="text-secondary-text text-lg leading-relaxed">
            Articles, founder case studies, and practical guides on turning your campus ideas into high-growth ventures.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${encodeURIComponent(post.slug)}`}
                className="group bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary-cyan/50 hover:shadow-[0_10px_30px_rgba(0,217,255,0.1)] flex flex-col"
              >
                {post.cover_image_url && (
                  <div className="h-48 w-full overflow-hidden relative" suppressHydrationWarning>
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-secondary-text mb-3">
                      <span className="text-primary-cyan font-medium">{post.category || 'Insights'}</span>
                      {post.published_at && (
                        <span suppressHydrationWarning>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-heading font-bold text-primary-text mb-3 group-hover:text-primary-cyan transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-secondary-text text-sm line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex items-center text-primary-cyan text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                    Read Story <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-primary-cyan" />
            </div>
            <h2 className="text-2xl font-heading font-semibold text-primary-text mb-3">Articles Coming Soon</h2>
            <p className="text-secondary-text max-w-md mx-auto">
              Our editorial team and student founders are drafting in-depth startup breakdowns. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
