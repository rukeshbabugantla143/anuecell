import { createClient } from '@/lib/supabase/server'
import GalleryUploader from './GalleryUploader'
import CreateAlbumModal from './CreateAlbumModal'
import GalleryPhotoManager from './GalleryPhotoManager'
import { Images, Folder, Calendar } from 'lucide-react'

export const revalidate = 0 // Always dynamic for admin dashboard

export default async function DashboardGalleryPage() {
  const supabase = await createClient()

  // 1. Fetch all albums
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('event_date', { ascending: false })

  // 2. Fetch gallery items with album details
  const { data: galleryItems } = await supabase
    .from('gallery_items')
    .select('*, albums(id, title)')
    .order('created_at', { ascending: false })

  const totalPhotos = galleryItems?.length || 0
  const totalAlbums = albums?.length || 0

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#101827] p-6 rounded-2xl border border-border-color shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-heading font-bold text-primary-text tracking-tight">Gallery & Albums</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30">
              {totalAlbums} Albums • {totalPhotos} Photos
            </span>
          </div>
          <p className="text-sm text-secondary-text">
            Create custom photo albums for other college fests, external hackathons, workshops, and campus memories.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <CreateAlbumModal />
          <GalleryUploader albums={albums || []} variant="primary" />
        </div>
      </div>

      {/* Stats summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#101827] border border-border-color flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center text-primary-cyan border border-primary-cyan/20">
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-secondary-text">Total Albums</p>
            <p className="text-xl font-bold text-primary-text">{totalAlbums}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-border-color flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-neon-magenta/10 flex items-center justify-center text-neon-magenta border border-neon-magenta/20">
            <Images className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-secondary-text">Total Photos Uploaded</p>
            <p className="text-xl font-bold text-primary-text">{totalPhotos}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-border-color flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-functional-success/10 flex items-center justify-center text-functional-success border border-functional-success/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-secondary-text">Latest Album Date</p>
            <p className="text-sm font-semibold text-primary-text truncate max-w-[180px]">
              {albums && albums.length > 0 && albums[0].event_date
                ? new Date(albums[0].event_date).toLocaleDateString()
                : 'No albums yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Photo & Album Manager */}
      <GalleryPhotoManager 
        albums={albums || []} 
        photos={galleryItems || []} 
      />
    </div>
  )
}
