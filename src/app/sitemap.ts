import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anuecell.com'
  const currentDate = new Date()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/announcements`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic routes from Supabase
  let eventRoutes: MetadataRoute.Sitemap = []
  let albumRoutes: MetadataRoute.Sitemap = []
  let blogRoutes: MetadataRoute.Sitemap = []

  try {
    const supabase = await createClient()

    // 1. Published events
    const { data: events } = await supabase
      .from('events')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')

    if (events && events.length > 0) {
      eventRoutes = events.map((event) => ({
        url: `${baseUrl}/events/${encodeURIComponent(event.slug)}`,
        lastModified: event.updated_at ? new Date(event.updated_at) : (event.created_at ? new Date(event.created_at) : currentDate),
        changeFrequency: 'weekly',
        priority: 0.85,
      }))
    }

    // 2. Albums
    const { data: albums } = await supabase
      .from('albums')
      .select('slug, created_at')

    if (albums && albums.length > 0) {
      albumRoutes = albums.map((album) => ({
        url: `${baseUrl}/gallery/${encodeURIComponent(album.slug)}`,
        lastModified: album.created_at ? new Date(album.created_at) : currentDate,
        changeFrequency: 'weekly',
        priority: 0.75,
      }))
    }

    // 3. Blog posts
    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('is_published', true)

    if (blogs && blogs.length > 0) {
      blogRoutes = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${encodeURIComponent(blog.slug)}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : (blog.published_at ? new Date(blog.published_at) : currentDate),
        changeFrequency: 'weekly',
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
  }

  return [...staticRoutes, ...eventRoutes, ...albumRoutes, ...blogRoutes]
}
