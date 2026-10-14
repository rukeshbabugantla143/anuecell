'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Search, 
  Plus, 
  Edit, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Tag, 
  FileText,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react'
import DeleteBlogPostButton from './DeleteBlogPostButton'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  category: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

export default function BlogTable({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const categories = useMemo(() => {
    const set = new Set<string>()
    initialPosts.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [initialPosts])

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Status filter
      if (statusFilter === 'published' && !post.is_published) return false
      if (statusFilter === 'draft' && post.is_published) return false

      // Category filter
      if (categoryFilter !== 'all' && post.category !== categoryFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = post.title.toLowerCase().includes(query)
        const matchExcerpt = post.excerpt?.toLowerCase().includes(query) || false
        const matchCategory = post.category?.toLowerCase().includes(query) || false
        const matchSlug = post.slug.toLowerCase().includes(query)
        if (!matchTitle && !matchExcerpt && !matchCategory && !matchSlug) return false
      }

      return true
    })
  }, [initialPosts, searchQuery, statusFilter, categoryFilter])

  const totalCount = initialPosts.length
  const publishedCount = initialPosts.filter((p) => p.is_published).length
  const draftCount = totalCount - publishedCount

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0a0f17] border border-border-color rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-text">Total Articles</span>
            <div className="h-8 w-8 rounded-lg bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-primary-text mt-3">{totalCount}</p>
          <span className="text-xs text-muted-text mt-1 block">Articles written</span>
        </div>

        <div className="bg-[#0a0f17] border border-border-color rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-text">Published</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-primary-text mt-3">{publishedCount}</p>
          <span className="text-xs text-muted-text mt-1 block">Live on website</span>
        </div>

        <div className="bg-[#0a0f17] border border-border-color rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-text">Drafts</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-heading font-black text-primary-text mt-3">{draftCount}</p>
          <span className="text-xs text-muted-text mt-1 block">Unpublished articles</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-border-color bg-[#0a0f17] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title, category, keywords..."
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-primary-text placeholder-muted-text/70 focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex items-center bg-[#151F30] border border-border-color rounded-xl p-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-cyan text-main-bg font-bold shadow-sm'
                    : 'text-secondary-text hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'published'
                    ? 'bg-primary-cyan text-main-bg font-bold shadow-sm'
                    : 'text-secondary-text hover:text-white'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === 'draft'
                    ? 'bg-primary-cyan text-main-bg font-bold shadow-sm'
                    : 'text-secondary-text hover:text-white'
                }`}
              >
                Drafts
              </button>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#151F30] border border-border-color text-secondary-text rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-cyan transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f1522] border-b border-border-color">
              <tr>
                <th className="px-6 py-4 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">
                  Article Details
                </th>
                <th className="px-6 py-4 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">
                  Category & Tags
                </th>
                <th className="px-6 py-4 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">
                  Status
                </th>
                <th className="px-6 py-4 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">
                  Published Date
                </th>
                <th className="px-6 py-4 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-main-bg">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-text">
                      <div className="h-16 w-16 rounded-full bg-secondary-bg flex items-center justify-center mb-3 shadow-inner">
                        <BookOpen className="h-8 w-8 text-secondary-text opacity-40" />
                      </div>
                      <p className="text-lg font-heading font-bold text-primary-text mb-1">
                        {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? 'No matching blog posts found'
                          : 'No blog posts yet'}
                      </p>
                      <p className="text-xs text-secondary-text max-w-sm">
                        {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? 'Try adjusting your search query or filters to find what you are looking for.'
                          : 'Start sharing founder stories, startup frameworks, and campus insights by creating your first post.'}
                      </p>
                      {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
                        <Link href="/dashboard/blog/new" className="mt-4">
                          <Button variant="primary" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> Create First Post
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#151F30]/60 transition-colors group">
                    {/* Article Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-16 rounded-lg bg-[#1A2639] flex items-center justify-center overflow-hidden border border-border-color shrink-0 shadow-inner">
                          {post.cover_image_url ? (
                            <img
                              src={post.cover_image_url}
                              alt={post.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <FileText className="h-5 w-5 text-secondary-text opacity-60" />
                          )}
                        </div>
                        <div className="max-w-md">
                          <span className="block font-bold text-primary-text text-sm truncate group-hover:text-primary-cyan transition-colors">
                            {post.title}
                          </span>
                          <span className="block text-xs text-muted-text truncate mt-0.5">
                            {post.excerpt || `/${post.slug}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Tags */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge
                          variant="info"
                          className="text-[10px] uppercase font-bold tracking-wider py-0.5 px-2 bg-primary-cyan/10 border-primary-cyan/20 text-primary-cyan"
                        >
                          {post.category || 'General'}
                        </Badge>
                        {post.tags && post.tags.length > 0 && (
                          <span className="text-[11px] text-muted-text flex items-center gap-1">
                            <Tag className="h-2.5 w-2.5" />
                            {post.tags.slice(0, 2).join(', ')}
                            {post.tags.length > 2 ? ` +${post.tags.length - 2}` : ''}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {post.is_published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Published Date */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-primary-text font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-text" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : new Date(post.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                        </span>
                        <span className="text-[10px] text-muted-text">
                          {post.published_at ? 'Published' : 'Created'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {post.is_published && (
                          <Link
                            href={`/blog/${encodeURIComponent(post.slug)}`}
                            target="_blank"
                            title="View Public Post"
                            className="p-2 text-secondary-text hover:text-primary-cyan hover:bg-[#151F30] rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/dashboard/blog/${post.id}/edit`}
                          title="Edit Post"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 rounded-lg transition-colors border border-transparent hover:border-primary-cyan/30"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <DeleteBlogPostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
