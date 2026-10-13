'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, MapPin, Users, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/ui/RichTextEditor'

export default function CreateEventPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [fullDescription, setFullDescription] = useState('')
  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual')
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string || generateSlug(title)
    
    const photoFile = formData.get('cover_image') as File
    let finalPhotoUrl = null
    
    try {
      // 1. Upload cover image if provided
      if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `event_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        // Reusing team-photos bucket since it's already configured as public
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, photoFile, {
            cacheControl: '3600',
            upsert: false
          })
          
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
        
        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(fileName)
          
        finalPhotoUrl = publicUrl
      }

      // 2. Save event to database
      const { error: insertError } = await supabase
        .from('events')
        .insert([
          {
            title: title,
            slug: slug,
            category: formData.get('category'),
            short_description: formData.get('short_description'),
            full_description: fullDescription,
            start_datetime: formData.get('start_datetime'),
            end_datetime: formData.get('end_datetime'),
            venue: formData.get('venue'),
            is_online: formData.get('is_online') === 'on',
            online_url: formData.get('online_url') || null,
            max_participants: formData.get('max_participants') ? parseInt(formData.get('max_participants') as string) : null,
            registration_enabled: registrationEnabled,
            registration_url: formData.get('registration_url') || null,
            registration_close_datetime: formData.get('registration_close_datetime') || null,
            participation_type: participationType,
            team_size_min: participationType === 'team' && formData.get('team_size_min') ? parseInt(formData.get('team_size_min') as string) : 1,
            team_size_max: participationType === 'team' && formData.get('team_size_max') ? parseInt(formData.get('team_size_max') as string) : 1,
            status: formData.get('status'),
            cover_image_url: finalPhotoUrl,
          }
        ])

      if (insertError) {
        if (insertError.code === '23505') throw new Error("An event with this URL slug already exists. Try a different title or slug.")
        throw insertError
      }

      router.push('/dashboard/events')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events">
          <Button variant="ghost" className="p-2 h-auto text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text tracking-tight">Create New Event</h1>
          <p className="text-sm text-secondary-text">Schedule a new hackathon, workshop, or session.</p>
        </div>
      </div>

      <Card className="border-border-color shadow-2xl bg-main-bg">
        <CardContent className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-functional-error/10 border border-functional-error/30 text-functional-error rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Cover Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-primary-text flex items-center gap-2">
                Event Cover Image
              </label>
              <div className="flex items-start gap-6">
                <div className="relative h-32 w-48 sm:w-64 rounded-xl bg-secondary-bg border-2 border-dashed border-border-color overflow-hidden flex items-center justify-center shrink-0">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <CalendarIcon className="h-8 w-8 text-secondary-text mx-auto mb-2 opacity-50" />
                      <span className="text-xs text-muted-text">16:9 ratio recommended</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 justify-center pt-2">
                  <div className="relative">
                    <input 
                      type="file" 
                      name="cover_image" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="primary" className="pointer-events-none gap-2 px-4 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                      <Upload className="h-4 w-4" /> Upload Cover
                    </Button>
                  </div>
                  <p className="text-xs text-secondary-text max-w-xs">Supports JPG, PNG up to 5MB. This will be shown on the events list and details page.</p>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-color">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Event Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  placeholder="e.g. Startup Weekend 2026"
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text flex items-center justify-between">
                  URL Slug
                  <span className="text-[10px] text-muted-text font-normal">(Leave empty to auto-generate)</span>
                </label>
                <input 
                  type="text" 
                  name="slug" 
                  placeholder="startup-weekend-2026"
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Category *</label>
                {isCustomCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="category"
                      required
                      placeholder="Enter custom category"
                      className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                      autoFocus
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsCustomCategory(false)}
                      className="shrink-0 border-border-color"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <select 
                    name="category"
                    required
                    onChange={(e) => {
                      if (e.target.value === 'custom') setIsCustomCategory(true)
                    }}
                    className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Speaker Session">Speaker Session</option>
                    <option value="Networking">Networking</option>
                    <option value="Competition">Competition</option>
                    <option value="custom" className="text-primary-cyan font-bold">➕ Add Custom...</option>
                  </select>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Short Description *</label>
                <textarea 
                  name="short_description" 
                  required
                  rows={2}
                  placeholder="A brief summary for the event cards..."
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                ></textarea>
                <p className="text-xs text-secondary-text mt-1">This will be shown on the event preview cards.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Full Description *</label>
                <RichTextEditor 
                  value={fullDescription} 
                  onChange={setFullDescription} 
                  placeholder="Write the full event details here... Format with bold, headings, bullet lists, etc."
                />
              </div>
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-color">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Start Date & Time *</label>
                <input 
                  type="datetime-local" 
                  name="start_datetime" 
                  required
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">End Date & Time *</label>
                <input 
                  type="datetime-local" 
                  name="end_datetime" 
                  required
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all [color-scheme:dark]"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Venue / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
                  <input 
                    type="text" 
                    name="venue" 
                    placeholder="e.g. Main Auditorium, Block A"
                    className="w-full bg-[#151F30] border border-border-color rounded-lg pl-9 pr-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Capacity (Max Participants / Teams)</label>
                <input 
                  type="number" 
                  name="max_participants" 
                  placeholder="Leave empty for unlimited"
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
              </div>
              
              <div className="flex items-center space-x-3 pt-8">
                <input 
                  type="checkbox" 
                  id="is_online" 
                  name="is_online" 
                  className="w-4 h-4 rounded border-border-color bg-[#151F30] text-primary-cyan focus:ring-primary-cyan/50"
                />
                <label htmlFor="is_online" className="text-sm text-primary-text font-medium cursor-pointer">
                  This is an online / virtual event
                </label>
              </div>
            </div>

            {/* Participation Format & Team Settings */}
            <div className="pt-6 border-t border-border-color space-y-4">
              <h3 className="text-base font-heading font-semibold text-primary-text flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-cyan" /> Participation Format & Team Size
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary-text">Format Type</label>
                  <select 
                    value={participationType}
                    onChange={(e) => setParticipationType(e.target.value as any)}
                    name="participation_type"
                    className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none"
                  >
                    <option value="individual">Individual (Solo Participation)</option>
                    <option value="team">Team Participation</option>
                  </select>
                </div>

                {participationType === 'team' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-text">Min Team Size</label>
                      <input 
                        type="number" 
                        name="team_size_min" 
                        defaultValue={2}
                        min={1}
                        className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-text">Max Team Size</label>
                      <input 
                        type="number" 
                        name="team_size_max" 
                        defaultValue={4}
                        min={1}
                        className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Settings */}
            <div className="pt-6 border-t border-border-color space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-heading font-semibold text-primary-text flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary-cyan" /> Registration Settings
                  </h3>
                  <p className="text-xs text-secondary-text mt-0.5">Control whether attendees can register and provide registration links.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={registrationEnabled}
                    onChange={(e) => setRegistrationEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#151F30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-cyan"></div>
                  <span className="ml-3 text-xs font-medium text-primary-text">
                    {registrationEnabled ? 'Registration Open' : 'Registration Closed'}
                  </span>
                </label>
              </div>

              {registrationEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text">Registration Link / Form URL</label>
                    <input 
                      type="url" 
                      name="registration_url" 
                      placeholder="https://forms.google.com/... or Unstop / Devfolio"
                      className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all text-sm"
                    />
                    <p className="text-xs text-muted-text">If left empty, users will see standard on-site registration.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary-text">Registration Deadline (Closes At)</label>
                    <input 
                      type="datetime-local" 
                      name="registration_close_datetime" 
                      className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all text-sm [color-scheme:dark]"
                    />
                    <p className="text-xs text-muted-text">Registrations will automatically close after this date & time.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Publishing */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-border-color gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <label className="text-sm font-medium text-primary-text">Status:</label>
                <select 
                  name="status"
                  className="bg-[#151F30] border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none text-sm"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Visible to public)</option>
                </select>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Link href="/dashboard/events" className="w-full sm:w-auto">
                  <Button type="button" variant="outline" className="w-full sm:w-auto border-border-color">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="w-full sm:w-auto gap-2 shadow-[0_0_15px_rgba(0,217,255,0.3)] hover:shadow-[0_0_25px_rgba(0,217,255,0.5)]"
                >
                  {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Event</>}
                </Button>
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
