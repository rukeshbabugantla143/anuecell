'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  BookOpen, 
  Sparkles, 
  Globe, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/ui/RichTextEditor'

const PRESET_CATEGORIES = [
  'Startup Insights',
  'Founder Stories',
  'Funding & Pitching',
  'Technology & AI',
  'Campus Entrepreneurship',
  'Guides & Frameworks',
  'E-Cell Updates',
  'Other'
]

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const supabase = createClient()
  const router = useRouter()

  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(PRESET_CATEGORIES[0])
  const [customCategory, setCustomCategory] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [showSeoSettings, setShowSeoSettings] = useState(false)

  useEffect(() => {
    async function loadPost() {
      try {
        const { data: post, error: fetchErr } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', resolvedParams.id)
          .single()

        if (fetchErr || !post) {
          throw new Error(fetchErr?.message || 'Article not found.')
        }

        setTitle(post.title || '')
        setSlug(post.slug || '')
        setExcerpt(post.excerpt || '')
        setContent(post.content || '')
        setCoverImageUrl(post.cover_image_url || '')
        setPreviewUrl(post.cover_image_url || null)
        setIsPublished(Boolean(post.is_published))
        
        if (post.published_at) {
          setPublishedAt(new Date(post.published_at).toISOString().slice(0, 16))
        }

        if (post.category) {
          if (PRESET_CATEGORIES.includes(post.category)) {
            setSelectedCategory(post.category)
          } else {
            setSelectedCategory('Other')
            setCustomCategory(post.category)
          }
        }

        if (Array.isArray(post.tags)) {
          setTagsInput(post.tags.join(', '))
        }

        setSeoTitle(post.seo_title || '')
        setSeoDescription(post.seo_description || '')
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load blog post.')
      } finally {
        setFetching(false)
      }
    }

    loadPost()
  }, [resolvedParams.id, supabase])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Article title is required.')
      return
    }
    if (!content.trim()) {
      setError('Article content is required.')
      return
    }

    setLoading(true)
    setError(null)

    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
      .trim()

    let finalPhotoUrl = coverImageUrl.trim() || null

    try {
      // 1. Upload new image if provided
      if (coverImageFile) {
        const fileExt = coverImageFile.name.split('.').pop()
        const fileName = `blog_${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, coverImageFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw new Error(`Cover image upload failed: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(fileName)

        finalPhotoUrl = publicUrl
      }

      // Format tags
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const finalCategory = selectedCategory === 'Other' ? customCategory.trim() || 'General' : selectedCategory

      // 2. Update Supabase
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          title: title.trim(),
          slug: finalSlug,
          excerpt: excerpt.trim() || null,
          content: content.trim(),
          cover_image_url: finalPhotoUrl,
          category: finalCategory,
          tags: tagsArray.length > 0 ? tagsArray : null,
          is_published: isPublished,
          published_at: isPublished 
            ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) 
            : null,
          seo_title: seoTitle.trim() || null,
          seo_description: seoDescription.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', resolvedParams.id)

      if (updateError) {
        if (updateError.code === '23505') {
          throw new Error('A blog post with this URL slug already exists. Please modify the slug.')
        }
        throw new Error(updateError.message)
      }

      router.push('/dashboard/blog')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update blog post.')
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return

    try {
      setDeleting(true)
      const { error } = await supabase.from('blog_posts').delete().eq('id', resolvedParams.id)
      if (error) throw new Error(error.message)
      router.push('/dashboard/blog')
      router.refresh()
    } catch (err: any) {
      alert('Delete failed: ' + err.message)
      setDeleting(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="h-8 w-8 text-primary-cyan animate-spin" />
        <p className="text-secondary-text text-sm">Loading article details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/blog"
            className="p-2.5 rounded-xl bg-secondary-bg hover:bg-secondary-bg/80 text-secondary-text hover:text-primary-cyan border border-border-color transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary-text tracking-tight flex items-center gap-2">
              Edit Article
            </h1>
            <p className="text-sm text-secondary-text">
              Modify content, manage publication status, and update SEO settings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {slug && isPublished && (
            <Link
              href={`/blog/${encodeURIComponent(slug)}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-secondary-text hover:text-primary-cyan bg-[#151F30] rounded-xl border border-border-color transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View Live
            </Link>
          )}

          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleting}
            className="text-functional-error hover:bg-functional-error/10 hover:text-functional-error"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            variant="primary"
            className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] px-6"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-functional-error/10 border border-functional-error/30 text-functional-error flex items-center gap-3 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border-color bg-main-bg p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  Article Title <span className="text-functional-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. How to Validate Your Startup Idea on Campus"
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-lg font-heading font-bold text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  URL Slug
                </label>
                <div className="flex items-center bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-secondary-text focus-within:border-primary-cyan focus-within:ring-1 focus-within:ring-primary-cyan">
                  <span className="text-muted-text select-none">/blog/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="how-to-validate-your-startup-idea"
                    className="w-full bg-transparent border-none text-primary-cyan font-mono text-sm focus:outline-none px-1"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A short punchy teaser that appears on the blog cards and search snippets (1-2 sentences)..."
                  className="w-full bg-[#151F30] border border-border-color rounded-xl p-3 text-sm text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all resize-y"
                />
              </div>

              {/* Rich Markdown Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text">
                    Article Content (Markdown) <span className="text-functional-error">*</span>
                  </label>
                  <span className="text-xs text-muted-text flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-primary-cyan" /> Supports Markdown & formatting
                  </span>
                </div>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your article here..."
                  minHeight="380px"
                />
              </div>
            </Card>

            {/* SEO Settings Card */}
            <Card className="border-border-color bg-main-bg p-6">
              <button
                type="button"
                onClick={() => setShowSeoSettings(!showSeoSettings)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-primary-cyan" />
                  <div>
                    <h3 className="font-heading font-bold text-primary-text text-sm">
                      Search Engine Optimization (SEO)
                    </h3>
                    <p className="text-xs text-muted-text">
                      Customize how this post appears in Google search and social media shares.
                    </p>
                  </div>
                </div>
                <span className="text-xs text-primary-cyan font-medium">
                  {showSeoSettings ? 'Hide' : 'Configure'}
                </span>
              </button>

              {showSeoSettings && (
                <div className="space-y-4 pt-6 mt-6 border-t border-border-color animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || 'Custom SEO title...'}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                      Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || 'Brief description for search engines (max 160 characters)...'}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl p-3 text-sm text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Settings (Right 1 col) */}
          <div className="space-y-6">
            {/* Publishing Status Card */}
            <Card className="border-border-color bg-main-bg p-6 space-y-5">
              <h3 className="font-heading font-bold text-primary-text text-sm border-b border-border-color pb-3">
                Publishing Options
              </h3>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  Status
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#151F30] p-1.5 rounded-xl border border-border-color">
                  <button
                    type="button"
                    onClick={() => setIsPublished(true)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-secondary-text hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPublished(false)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !isPublished
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                        : 'text-secondary-text hover:text-white'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              {/* Publish Date */}
              {isPublished && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                    Publish Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Category & Tags Card */}
            <Card className="border-border-color bg-main-bg p-6 space-y-5">
              <h3 className="font-heading font-bold text-primary-text text-sm border-b border-border-color pb-3">
                Classification
              </h3>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                >
                  {PRESET_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {selectedCategory === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category..."
                    className="w-full mt-2 bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary-text mb-2">
                  Tags <span className="text-muted-text font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Funding, Pitch, AI, Growth"
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-sm text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan transition-all"
                />
              </div>
            </Card>

            {/* Cover Image Card */}
            <Card className="border-border-color bg-main-bg p-6 space-y-4">
              <h3 className="font-heading font-bold text-primary-text text-sm border-b border-border-color pb-3">
                Cover Image
              </h3>

              {previewUrl ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border-color group">
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null)
                      setCoverImageFile(null)
                      setCoverImageUrl('')
                    }}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white px-2.5 py-1 text-xs rounded-lg transition-colors"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border-color hover:border-primary-cyan/50 rounded-xl p-6 cursor-pointer bg-[#151F30]/40 hover:bg-[#151F30] transition-colors text-center group">
                  <Upload className="h-8 w-8 text-secondary-text group-hover:text-primary-cyan mb-2 transition-colors" />
                  <span className="text-xs font-bold text-primary-text">Upload Image</span>
                  <span className="text-[10px] text-muted-text mt-1">PNG, JPG, WebP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-[11px] font-medium text-muted-text mb-1.5">
                  Or paste direct Image URL:
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => {
                    setCoverImageUrl(e.target.value)
                    if (e.target.value.startsWith('http')) {
                      setPreviewUrl(e.target.value)
                      setCoverImageFile(null)
                    }
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-xs text-primary-text placeholder-muted-text/60 focus:outline-none focus:border-primary-cyan transition-all"
                />
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
