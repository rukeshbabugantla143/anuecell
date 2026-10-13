'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { FolderPlus, Loader2, X, Upload, MapPin, Calendar, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function CreateAlbumModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('External College Fest')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

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

      let coverUrl: string | null = null

      // Upload cover image if provided
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

      // Generate unique slug
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'album'
      const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

      // Insert album
      const { error: insertError } = await supabase
        .from('albums')
        .insert([
          {
            title: title.trim(),
            slug,
            category: category.trim() || 'Event',
            location: location.trim() || null,
            event_date: eventDate || null,
            description: description.trim() || null,
            cover_image_url: coverUrl
          }
        ])

      if (insertError) {
        throw new Error('Database error creating album: ' + insertError.message)
      }

      // Reset and close
      setTitle('')
      setLocation('')
      setDescription('')
      setCoverFile(null)
      setCoverPreview(null)
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error('Create album error:', err)
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all px-5 py-5 text-sm font-bold"
      >
        <FolderPlus className="h-5 w-5" />
        Create New Album
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#101827] border border-border-color rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border-color shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-primary-text">Create New Album</h3>
                  <p className="text-xs text-secondary-text">
                    For other college events, fests, hackathons, or campus memories.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !saving && setIsOpen(false)}
                disabled={saving}
                className="text-muted-text hover:text-white p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-grow">
              
              {/* Album Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-text">
                  Album Name / Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IIT Madras Shaastra Hackathon, Vignan Mahotsav..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={saving}
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                />
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary-text flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-primary-cyan" /> Category / Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={saving}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                  >
                    <option value="External College Fest">External College Fest</option>
                    <option value="Inter-College Hackathon">Inter-College Hackathon</option>
                    <option value="Industrial Visit">Industrial Visit</option>
                    <option value="Campus Event">Campus Event</option>
                    <option value="Workshop & Bootcamp">Workshop & Bootcamp</option>
                    <option value="Celebrations & Meetups">Celebrations & Meetups</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-primary-text flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-neon-magenta" /> Host College / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Madras, Chennai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={saving}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-text flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-functional-success" /> Event / Album Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  disabled={saving}
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-text">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell what happened at this event (e.g. Our team participated in the National Level Hackfest and secured awards)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={saving}
                  className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan resize-none"
                />
              </div>

              {/* Cover Photo */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary-text">
                  Album Cover Picture (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleCoverSelect}
                  disabled={saving}
                  className="hidden"
                />

                {coverPreview ? (
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border-color bg-secondary-bg">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null)
                        setCoverPreview(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-functional-error text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border-color hover:border-primary-cyan/60 bg-[#151F30]/40 rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="h-6 w-6 mx-auto text-muted-text mb-1" />
                    <span className="text-xs text-primary-text font-medium">Click to select cover photo</span>
                    <p className="text-[11px] text-muted-text mt-0.5">If not selected, the first uploaded photo will become the cover.</p>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-color">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={saving}
                  className="text-secondary-text"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating Album...
                    </>
                  ) : (
                    'Create Album'
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
