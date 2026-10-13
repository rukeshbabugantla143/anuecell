import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Calendar, ArrowRight, Images, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { constructMetadata, getAbsoluteImageUrl } from '@/lib/seo'
import AlbumLightboxGrid from '@/components/gallery/AlbumLightboxGrid'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  if (decodedSlug === 'general') {
    // Fetch first general item for preview
    const { data: firstGeneral } = await supabase
      .from('gallery_items')
      .select('media_url, title')
      .is('album_id', null)
      .limit(1)
      .maybeSingle()

    return constructMetadata({
      title: 'Campus & E-Cell Moments | Gallery',
      description: 'Candid captures, workshops, and memorable highlights from ANU E-Cell NEC.',
      image: firstGeneral?.media_url || '/E-CELL.png',
      imageAlt: firstGeneral?.title || 'ANU E-Cell Campus Gallery',
      canonicalPath: '/gallery/general',
    })
  }

  const { data: album } = await supabase
    .from('albums')
    .select('id, title, description, cover_image_url, category')
    .eq('slug', decodedSlug)
    .single()

  if (!album) {
    return constructMetadata({
      title: 'Album Not Found',
      description: 'The requested photo album could not be found.',
      canonicalPath: `/gallery/${encodeURIComponent(decodedSlug)}`,
      noIndex: true,
    })
  }

  // If cover_image_url is missing, fallback to the first photo inside this album
  let previewImage = album.cover_image_url
  if (!previewImage) {
    const { data: firstPhoto } = await supabase
      .from('gallery_items')
      .select('media_url')
      .eq('album_id', album.id)
      .limit(1)
      .maybeSingle()
    if (firstPhoto?.media_url) {
      previewImage = firstPhoto.media_url
    }
  }

  const title = album.title
  const description = album.description || `View photo captures and highlights from ${title} at ANU E-Cell NEC.`

  return constructMetadata({
    title: `${title} | Gallery Album`,
    description,
    image: getAbsoluteImageUrl(previewImage),
    imageAlt: `${title} - Album Cover`,
    canonicalPath: `/gallery/${encodeURIComponent(decodedSlug)}`,
    tags: album.category ? [album.category, 'Photo Gallery', 'ANU E-Cell'] : ['Gallery Album'],
  })
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  let albumTitle = ''
  let albumDescription = ''
  let albumCategory = 'Gallery'
  let albumLocation: string | null = null
  let albumDate = ''
  let eventLink = ''
  let items: any[] = []

  if (decodedSlug === 'general') {
    albumTitle = 'Campus & E-Cell Moments'
    albumDescription = 'Candid captures, workshops, and team highlights from ANU E-Cell NEC.'
    albumCategory = 'Campus'
    albumLocation = 'ANU Campus'

    const { data: generalItems } = await supabase
      .from('gallery_items')
      .select('*')
      .is('album_id', null)
      .order('created_at', { ascending: false })

    items = generalItems || []
  } else {
    // 1. Fetch from albums table
    const { data: album, error: albumError } = await supabase
      .from('albums')
      .select('*, events(id, slug)')
      .eq('slug', decodedSlug)
      .single()

    if (albumError || !album) {
      // Fallback: Check if slug is an event slug directly
      const { data: eventFallback } = await supabase
        .from('events')
        .select('*')
        .eq('slug', decodedSlug)
        .single()

      if (!eventFallback) {
        notFound()
      }

      albumTitle = eventFallback.title
      albumDescription = eventFallback.short_description || 'Photo album from this event.'
      albumCategory = eventFallback.category || 'Event'
      albumLocation = eventFallback.venue
      albumDate = new Date(eventFallback.start_datetime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
      eventLink = `/events/${eventFallback.slug}`

      const { data: eventPhotos } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('event_id', eventFallback.id)
        .order('created_at', { ascending: false })

      items = eventPhotos || []
      if (items.length === 0 && eventFallback.cover_image_url) {
        items = [{
          id: `cover-${eventFallback.id}`,
          title: `${eventFallback.title} - Official Cover`,
          media_url: eventFallback.cover_image_url,
          created_at: eventFallback.created_at
        }]
      }
    } else {
      albumTitle = album.title
      albumDescription = album.description || 'Photo memories and captures from this event.'
      albumCategory = album.category || 'Event'
      albumLocation = album.location
      albumDate = album.event_date
        ? new Date(album.event_date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        : ''

      if (album.events?.slug) {
        eventLink = `/events/${album.events.slug}`
      }

      // Fetch photos belonging to this album
      let { data: albumPhotos } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('album_id', album.id)
        .order('created_at', { ascending: false })

      // Fallback to event_id if no photos with album_id yet
      if ((!albumPhotos || albumPhotos.length === 0) && album.event_id) {
        const { data: eventPhotos } = await supabase
          .from('gallery_items')
          .select('*')
          .eq('event_id', album.event_id)
          .order('created_at', { ascending: false })
        albumPhotos = eventPhotos
      }

      items = albumPhotos || []

      // If no photos yet and cover image exists, include cover
      if (items.length === 0 && album.cover_image_url) {
        items = [
          {
            id: `cover-${album.id}`,
            title: `${album.title} - Cover Photo`,
            media_url: album.cover_image_url,
            created_at: album.created_at
          }
        ]
      }
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-primary-cyan/10 rounded-full blur-[160px] -z-10 pointer-events-none"></div>

      {/* Navigation & Header */}
      <div className="pt-24 px-4 sm:px-8 lg:px-[6vw] max-w-7xl mx-auto relative z-10">
        <Link 
          href="/gallery" 
          className="inline-flex items-center text-secondary-text hover:text-primary-cyan transition-colors mb-8 group text-sm font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to all albums
        </Link>

        {/* Album Hero Info Card */}
        <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-cyan/10 blur-[90px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="info" className="px-3 py-1 bg-primary-cyan/10 text-primary-cyan border-primary-cyan/20">
                  {albumCategory}
                </Badge>
                {albumLocation && (
                  <span className="inline-flex items-center text-xs text-neon-magenta bg-neon-magenta/10 px-3 py-1 rounded-full border border-neon-magenta/20 font-medium">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" /> {albumLocation}
                  </span>
                )}
                {albumDate && (
                  <span className="inline-flex items-center text-xs text-secondary-text bg-secondary-bg px-3 py-1 rounded-full border border-border-color">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary-cyan" /> {albumDate}
                  </span>
                )}
                <span className="inline-flex items-center text-xs text-secondary-text bg-secondary-bg px-3 py-1 rounded-full border border-border-color">
                  <Images className="h-3.5 w-3.5 mr-1.5 text-neon-magenta" /> {items.length} {items.length === 1 ? 'Photo' : 'Photos'}
                </span>
              </div>

              <h1 className="hero-heading text-3xl sm:text-5xl text-primary-text font-bold tracking-tight">
                {albumTitle}
              </h1>

              <p className="text-secondary-text text-base sm:text-lg leading-relaxed">
                {albumDescription}
              </p>
            </div>

            {eventLink && (
              <div className="shrink-0">
                <Link href={eventLink}>
                  <Button variant="secondary" className="gap-2 border-border-color hover:border-primary-cyan text-sm">
                    View Event Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Photos Grid with Lightbox */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-primary-text flex items-center gap-2">
              Album Photos <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30">{items.length}</span>
            </h2>
            <p className="text-xs text-muted-text hidden sm:block">Click any photo to view full screen</p>
          </div>

          <AlbumLightboxGrid items={items} eventTitle={albumTitle} />
        </section>
      </div>
    </main>
  )
}
