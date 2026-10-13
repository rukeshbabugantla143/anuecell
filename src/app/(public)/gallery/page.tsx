import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Images, Calendar, ArrowRight, FolderClosed, MapPin } from 'lucide-react'
import { constructMetadata } from '@/lib/seo'

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = constructMetadata({
  title: "Event Albums & Gallery | Visual Highlights",
  description:
    "Explore photo albums, event captures, startup pitches, and celebrations from ANU E-Cell NEC workshops, summits, and student hackathons.",
  canonicalPath: "/gallery",
})

export default async function GalleryPage() {
  const supabase = await createClient()

  // 1. Fetch all albums from albums table
  const { data: albumsData, error: albumsError } = await supabase
    .from('albums')
    .select('*')
    .order('event_date', { ascending: false })

  // 2. Fetch all gallery items to calculate counts & general photos
  const { data: galleryItems, error: itemsError } = await supabase
    .from('gallery_items')
    .select('id, title, media_url, album_id, created_at')
    .order('created_at', { ascending: false })

  // Group photos by album_id
  const albumPhotoMap = new Map<string, any[]>()
  const generalPhotos: any[] = []

  galleryItems?.forEach((item) => {
    if (item.album_id) {
      if (!albumPhotoMap.has(item.album_id)) {
        albumPhotoMap.set(item.album_id, [])
      }
      albumPhotoMap.get(item.album_id)!.push(item)
    } else {
      generalPhotos.push(item)
    }
  })

  // Prepare display albums
  const displayAlbums: Array<{
    id: string
    title: string
    slug: string
    description: string
    coverImage: string | null
    category: string
    location?: string | null
    date?: string
    photoCount: number
  }> = []

  albumsData?.forEach((alb) => {
    const photos = albumPhotoMap.get(alb.id) || []
    const cover = alb.cover_image_url || (photos.length > 0 ? photos[0].media_url : null)
    const count = photos.length > 0 ? photos.length : (cover ? 1 : 0)

    displayAlbums.push({
      id: alb.id,
      title: alb.title,
      slug: alb.slug,
      description: alb.description || 'Memories and photo highlights from this event.',
      coverImage: cover,
      category: alb.category || 'Event',
      location: alb.location,
      date: alb.event_date
        ? new Date(alb.event_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : undefined,
      photoCount: count
    })
  })

  // If there are general photos not assigned to an album, show Campus Moments
  if (generalPhotos.length > 0) {
    displayAlbums.push({
      id: 'general',
      title: 'Campus & E-Cell Moments',
      slug: 'general',
      description: 'Candid memories, workshops, and team highlights from ANU E-Cell NEC.',
      coverImage: generalPhotos[0].media_url,
      category: 'Campus',
      location: 'ANU Campus',
      photoCount: generalPhotos.length
    })
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary-cyan/10 rounded-full blur-[160px] -z-10 pointer-events-none"></div>

      <div className="pt-24 px-4 sm:px-8 lg:px-[6vw] max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="info" className="mb-4 inline-flex border-primary-cyan/40 text-primary-cyan px-3 py-1 bg-primary-cyan/5 backdrop-blur-md">
            Memories & Photo Albums
          </Badge>
          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-primary-text mb-6">
            PHOTO <span className="metallic-text">ALBUMS</span>
          </h1>
          <p className="text-base sm:text-lg text-secondary-text leading-relaxed">
            Capturing our journey across internal events, external college fests, inter-college hackathons, and student startup milestones.
          </p>
        </div>

        {/* Albums Grid */}
        {displayAlbums.length === 0 ? (
          <div className="text-center p-16 bg-[#101827]/80 border border-border-color rounded-2xl max-w-lg mx-auto shadow-2xl backdrop-blur-md">
            <div className="h-20 w-20 rounded-2xl bg-secondary-bg flex items-center justify-center mx-auto mb-4 border border-border-color">
              <FolderClosed className="h-10 w-10 text-muted-text opacity-50" />
            </div>
            <h3 className="text-xl font-heading font-bold text-primary-text mb-2">No Albums Available Yet</h3>
            <p className="text-sm text-secondary-text mb-6">
              Photo albums from past and external college events will appear here as soon as they are uploaded.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayAlbums.map((album) => (
              <Link 
                key={album.id} 
                href={`/gallery/${album.slug}`} 
                className="group block focus:outline-none"
              >
                <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden shadow-xl hover:border-primary-cyan/60 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] transition-all duration-300 flex flex-col h-full group-hover:-translate-y-1">
                  
                  {/* Cover Picture Container */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary-bg border-b border-border-color">
                    {album.coverImage ? (
                      <img 
                        src={album.coverImage} 
                        alt={album.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-bg/60 text-muted-text">
                        <Images className="h-12 w-12 opacity-30 mb-2" />
                        <span className="text-xs">No Cover Photo</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-primary-cyan border border-primary-cyan/30">
                        {album.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md">
                        <Images className="h-3.5 w-3.5 text-primary-cyan" />
                        {album.photoCount} {album.photoCount === 1 ? 'Photo' : 'Photos'}
                      </span>
                    </div>

                    {/* Bottom Tags (Location / Date) */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-secondary-text font-medium pointer-events-none">
                      {album.location ? (
                        <span className="flex items-center gap-1 text-neon-magenta truncate max-w-[60%]">
                          <MapPin className="h-3.5 w-3.5 shrink-0" /> {album.location}
                        </span>
                      ) : (
                        <span></span>
                      )}

                      {album.date && (
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="h-3.5 w-3.5 text-primary-cyan" /> {album.date}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Album Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-primary-text group-hover:text-primary-cyan transition-colors line-clamp-1 mb-2">
                        {album.title}
                      </h3>
                      <p className="text-sm text-secondary-text line-clamp-2 leading-relaxed">
                        {album.description}
                      </p>
                    </div>

                    {/* Card Footer CTA */}
                    <div className="pt-4 border-t border-border-color/60 flex items-center justify-between text-sm font-semibold text-primary-cyan">
                      <span>Open Album</span>
                      <span className="h-8 w-8 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 flex items-center justify-center group-hover:bg-primary-cyan group-hover:text-black transition-all">
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
