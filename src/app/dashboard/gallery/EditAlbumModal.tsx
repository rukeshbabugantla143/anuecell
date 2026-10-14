'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { Edit2, Loader2, X, Upload, MapPin, Calendar, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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

interface EditAlbumModalProps {
  album: AlbumItem
  onUpdated?: (updated: AlbumItem) => void
}

const PRESET_CATEGORIES = [
  'Online Event',
  'Campus Event',
  'External College Fest',
  'Inter-College Hackathon',
  'Workshop & Bootcamp',
  'Industrial Visit',
  'Celebrations & Meetups',
  'Other'
]

export default function EditAlbumModal({ album, onUpdated }: EditAlbumModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const [title, setTitle] = useState(album.title || '')
  const [category, setCategory] = useState(album.category || 'External College Fest')
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [location, setLocation] = useState(album.location || '')
  const [eventDate, setEventDate] = useState(album.event_date ? new Date(album.event_date).toISOString().split('T')[0] : '')
  const [description, setDescription] = useState(album.description || '')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(album.cover_image_url || null)
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync state when album prop changes or modal opens
  const handleOpen = () => {
    setTitle(album.title || '')
    const isCustom = Boolean(album.category && !PRESET_CATEGORIES.includes(album.category))
    setIsCustomCategory(isCustom)
    if (isCustom) {
      setCustomCategory(album.category || '')
      setCategory('Other')
    } else {
      setCategory(album.category || 'External College Fest')
      setCustomCategory('')
    }
    setLocation(album.location || '')
    setEventDate(album.event_date ? new Date(album.event_date).toISOString().split('T')[0] : '')
    setDescription(album.description || '')
    setCoverPreview(album.cover_image_url || null)
    setCoverFile(null)
    setIsOpen(true)
  }

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Please enter an album title.')
      return
    }

    try {
      setSaving(true)
      let coverUrl = album.cover_image_url

      // If user selected a new cover image, upload it
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15)
        const fileName = `album_cover_${cleanName}_${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, coverFile, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          throw new Error('Failed to upload cover image: ' + uploadError.message)
        }

        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(fileName)

        coverUrl = publicUrl
      }

      const finalCategory = isCustomCategory
        ? (customCategory.trim() || 'Event')
        : (category.trim() || 'Event')

      // Update album in Supabase
      const { error: updateError } = await supabase
        .from('albums')
        .update({
          title: title.trim(),
          category: finalCategory,
          location: location.trim() || null,
          event_date: eventDate || null,
          description: description.trim() || null,
          cover_image_url: coverUrl
        })
        .eq('id', album.id)

      if (updateError) {
        throw new Error('Database error updating album: ' + updateError.message)
      }

      // Notify parent to update local state
      if (onUpdated) {
        onUpdated({
          ...album,
          title: title.trim(),
          category: finalCategory,
          location: location.trim() || null,
          event_date: eventDate || null,
          description: description.trim() || null,
          cover_image_url: coverUrl
        })
      }

      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update album.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="ghost"
        size="sm"
        className="px-2.5 py-1.5 h-auto text-xs text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 border border-border-color hover:border-primary-cyan/40 rounded-lg flex items-center gap-1.5"
        title="Edit Album Details"
      >
        <Edit2 className="h-3.5 w-3.5" />
        Edit
      </Button>

      {/* Modal Backdrop */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#101827] border border-border-color rounded-2xl shadow-2xl p-6 overflow-hidden my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-color">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-primary-text">Edit Album</h3>
                  <p className="text-xs text-secondary-text">Update album details, location, and cover image</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-muted-text hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1 uppercase tracking-wider">
                  Album Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shaastra 2025 - IIT Madras"
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
                      <Tag className="h-3 w-3 text-primary-cyan" /> Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-xs text-primary-cyan hover:underline font-medium"
                    >
                      {isCustomCategory ? 'Choose Preset' : '+ Type Custom'}
                    </button>
                  </div>

                  {!isCustomCategory ? (
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true)
                        } else {
                          setCategory(e.target.value)
                        }
                      }}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2.5 text-xs sm:text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="__custom__">+ Type Custom Category...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="Type custom category name..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      autoFocus
                      className="w-full bg-[#151F30] border border-primary-cyan/60 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-primary-text focus:outline-none focus:border-primary-cyan animate-in fade-in duration-200"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-text mb-1 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary-cyan" /> Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-3 py-2.5 text-xs sm:text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-neon-magenta" /> Location / Host College
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. IIT Madras, Chennai or Campus Auditorium"
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Memories, student achievements, or event highlights..."
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan resize-none"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1 uppercase tracking-wider">
                  Cover Photo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {coverPreview ? (
                    <div className="relative h-20 w-32 rounded-xl overflow-hidden border border-border-color group">
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-medium transition-opacity"
                      >
                        Change
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border-color hover:border-primary-cyan/60 bg-[#151F30] text-xs text-secondary-text hover:text-primary-cyan transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {coverPreview ? 'Replace Photo' : 'Upload Cover Photo'}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-color">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary-cyan hover:bg-primary-cyan/90 text-black font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
