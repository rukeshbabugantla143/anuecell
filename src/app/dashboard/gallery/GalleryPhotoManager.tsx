'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Search, Filter, FolderClosed, ExternalLink, Calendar, MapPin, Images, Plus, Layers, Grid } from 'lucide-react'
import DeleteGalleryImageButton from './DeleteGalleryImageButton'
import DeleteAlbumButton from './DeleteAlbumButton'
import GalleryUploader from './GalleryUploader'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface AlbumItem {
  id: string
  title: string
  slug: string
  description?: string | null
  cover_image_url?: string | null
  location?: string | null
  category?: string | null
  event_date?: string | null
  photoCount?: number
}

interface GalleryItemWithAlbum {
  id: string
  title: string
  media_url: string
  category: string
  album_id: string | null
  created_at: string
  albums?: { id: string; title: string } | null
}

interface GalleryPhotoManagerProps {
  albums: AlbumItem[]
  photos: GalleryItemWithAlbum[]
}

export default function GalleryPhotoManager({ albums, photos }: GalleryPhotoManagerProps) {
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>('albums')
  const [search, setSearch] = useState('')
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('all')
  const [albumList, setAlbumList] = useState<AlbumItem[]>(albums)
  const [photoList, setPhotoList] = useState<GalleryItemWithAlbum[]>(photos)

  // Keep state synced with props when revalidated
  useState(() => {
    setAlbumList(albums)
    setPhotoList(photos)
  })

  // Filtered Photos
  const filteredPhotos = photoList.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(search.toLowerCase())
    const albumMatch = item.albums?.title?.toLowerCase().includes(search.toLowerCase())
    const matchesSearch = titleMatch || albumMatch

    if (selectedAlbumFilter === 'all') return matchesSearch
    if (selectedAlbumFilter === 'general') return matchesSearch && !item.album_id
    return matchesSearch && item.album_id === selectedAlbumFilter
  })

  // Filtered Albums
  const filteredAlbums = albumList.filter((alb) => {
    return (
      alb.title.toLowerCase().includes(search.toLowerCase()) ||
      alb.location?.toLowerCase().includes(search.toLowerCase()) ||
      alb.category?.toLowerCase().includes(search.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#0a0f17] p-4 rounded-2xl border border-border-color">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-[#151F30] p-1.5 rounded-xl border border-border-color/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('albums')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'albums'
                ? 'bg-primary-cyan text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            Albums ({albums.length})
          </button>
          
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'photos'
                ? 'bg-primary-cyan text-black shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            <Grid className="h-4 w-4" />
            All Photos ({photos.length})
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'albums' ? 'Search albums, college...' : 'Search photos...'}
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
            />
          </div>

          {activeTab === 'photos' && (
            <select
              value={selectedAlbumFilter}
              onChange={(e) => setSelectedAlbumFilter(e.target.value)}
              className="bg-[#151F30] border border-border-color rounded-xl px-3 py-2 text-xs text-primary-text focus:outline-none focus:border-primary-cyan"
            >
              <option value="all">All Albums</option>
              <option value="general">General (No Album)</option>
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  {alb.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: ALBUMS VIEW */}
      {activeTab === 'albums' && (
        <>
          {filteredAlbums.length === 0 ? (
            <Card className="border-border-color bg-main-bg p-16 text-center">
              <div className="h-20 w-20 rounded-2xl bg-secondary-bg flex items-center justify-center mx-auto mb-4 border border-border-color">
                <FolderClosed className="h-10 w-10 text-muted-text opacity-50" />
              </div>
              <p className="text-xl font-heading font-bold text-primary-text mb-2">No albums found</p>
              <p className="text-sm text-secondary-text max-w-md mx-auto mb-6">
                Create a new album for other college visits, hackathons, or campus events.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlbums.map((album) => {
                const count = photos.filter((p) => p.album_id === album.id).length
                return (
                  <div
                    key={album.id}
                    className="bg-[#101827] border border-border-color rounded-2xl overflow-hidden shadow-xl hover:border-primary-cyan/50 transition-all flex flex-col justify-between group"
                  >
                    {/* Cover photo */}
                    <div className="relative aspect-[16/10] bg-secondary-bg border-b border-border-color overflow-hidden">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-text">
                          <Images className="h-10 w-10 opacity-30 mb-1" />
                          <span className="text-xs">No cover image</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-primary-cyan border border-primary-cyan/30">
                          {album.category || 'Event'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center gap-1 shadow">
                          <Images className="h-3 w-3 text-primary-cyan" /> {count} {count === 1 ? 'photo' : 'photos'}
                        </span>
                      </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-5 flex-grow space-y-3">
                      <div>
                        <h3 className="text-lg font-heading font-bold text-primary-text line-clamp-1 mb-1">
                          {album.title}
                        </h3>
                        <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
                          {album.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-text pt-2 border-t border-border-color/50">
                        {album.location && (
                          <span className="flex items-center gap-1 text-neon-magenta">
                            <MapPin className="h-3.5 w-3.5 shrink-0" /> {album.location}
                          </span>
                        )}
                        {album.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-primary-cyan" />{' '}
                            {new Date(album.event_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Album Card Actions */}
                    <div className="p-4 bg-[#0a0f17] border-t border-border-color flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <GalleryUploader 
                          albums={albums} 
                          defaultAlbumId={album.id} 
                          variant="compact" 
                          buttonText="Upload Photos"
                        />
                        <Link 
                          href={`/gallery/${album.slug}`} 
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs text-secondary-text hover:text-primary-cyan transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary-bg"
                        >
                          View Public <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <DeleteAlbumButton 
                        id={album.id} 
                        title={album.title} 
                        onDeleted={(deletedId) => setAlbumList((prev) => prev.filter((a) => a.id !== deletedId))}
                      />
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ALL PHOTOS VIEW */}
      {activeTab === 'photos' && (
        <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
          {filteredPhotos.length === 0 ? (
            <CardContent className="p-16 text-center">
              <div className="h-20 w-20 rounded-2xl bg-secondary-bg flex items-center justify-center mx-auto mb-4 border border-border-color">
                <Images className="h-10 w-10 text-muted-text opacity-50" />
              </div>
              <p className="text-xl font-heading font-bold text-primary-text mb-2">No photos found</p>
              <p className="text-sm text-secondary-text max-w-md mx-auto mb-6">
                Upload photos to an album to see them here.
              </p>
              <GalleryUploader albums={albums} variant="outline" />
            </CardContent>
          ) : (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-border-color bg-secondary-bg hover:border-primary-cyan/60 transition-all shadow-md"
                >
                  <img
                    src={item.media_url}
                    alt={item.title || 'Gallery image'}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Top Album Tag */}
                  <div className="absolute top-2 left-2 max-w-[85%] pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-primary-cyan border border-primary-cyan/30 truncate block shadow">
                      {item.albums?.title ? item.albums.title : 'General'}
                    </span>
                  </div>

                  {/* Hover Overlay with Delete & Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold truncate drop-shadow mb-1">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-muted-text">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <DeleteGalleryImageButton 
                    id={item.id} 
                    onDeleted={(deletedId) => setPhotoList((prev) => prev.filter((p) => p.id !== deletedId))}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
