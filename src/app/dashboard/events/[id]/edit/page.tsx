'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Save, Upload, Calendar as CalendarIcon, MapPin, Users, Link as LinkIcon, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/ui/RichTextEditor'

const PRESET_CATEGORIES = [
  'Hackathon',
  'Workshop',
  'Speaker Session',
  'Bootcamp',
  'Networking',
  'Pitch Competition',
  'Webinar',
  'Conference',
  'Other'
]

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<any>(null)
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isCustomCategory, setIsCustomCategory] = useState(false)
  const [fullDescription, setFullDescription] = useState('')
  const [participationType, setParticipationType] = useState<'individual' | 'team'>('individual')
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error || !data) {
        setError('Event not found or failed to load.')
      } else {
        setEvent(data)
        setPreviewUrl(data.cover_image_url || null)
        setFullDescription(data.full_description || '')
        setParticipationType(data.participation_type === 'team' ? 'team' : 'individual')
        setRegistrationEnabled(Boolean(data.registration_enabled))
        if (data.category && !PRESET_CATEGORIES.includes(data.category)) {
          setIsCustomCategory(true)
        }
      }
      setFetching(false)
    }

    fetchEvent()
  }, [resolvedParams.id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(event?.cover_image_url || null)
    }
  }

  // Helper to format ISO datetime to datetime-local input string
  const formatForDateTimeInput = (isoString: string | null) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    const offset = d.getTimezoneOffset() * 60000
    const local = new Date(d.getTime() - offset)
    return local.toISOString().slice(0, 16)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const photoFile = formData.get('cover_image') as File
    let finalPhotoUrl = event.cover_image_url

    try {
      // 1. Upload new cover image if provided
      if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `event_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
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

      // 2. Update event in database
      const { error: updateError } = await supabase
        .from('events')
        .update({
          title,
          slug,
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
        })
        .eq('id', resolvedParams.id)

      if (updateError) {
        if (updateError.code === '23505') throw new Error("An event with this URL slug already exists. Try a different title or slug.")
        throw updateError
      }

      router.push('/dashboard/events')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to update event.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-cyan" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-functional-error/10 border border-functional-error/30 text-functional-error rounded-xl">
          {error || 'Event could not be found.'}
        </div>
        <Link href="/dashboard/events">
          <Button variant="secondary">Back to Events</Button>
        </Link>
      </div>
    )
  }

  async function handleDeleteEvent() {
    if (!confirm(`Are you sure you want to delete "${event?.title || 'this event'}"? This action cannot be undone.`)) return
    try {
      setLoading(true)
      const { error } = await supabase.from('events').delete().eq('id', resolvedParams.id)
      if (error) throw error
      router.push('/dashboard/events')
      router.refresh()
    } catch (err: any) {
      alert('Failed to delete event: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/events">
            <Button variant="ghost" className="p-2 h-auto text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-heading font-bold text-primary-text tracking-tight">Edit Event</h1>
            <p className="text-sm text-secondary-text">Modify event details, team settings, and registration status.</p>
          </div>
        </div>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleDeleteEvent}
          disabled={loading}
          className="gap-2 text-functional-error hover:bg-functional-error/10 hover:text-functional-error border border-functional-error/30 px-4 py-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete Event
        </Button>
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
                      <CalendarIcon className="h-8 w-8 text-muted-text mx-auto mb-1 opacity-50" />
                      <span className="text-xs text-muted-text">No cover uploaded</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <div className="inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 h-10 px-4 py-2 text-sm bg-primary-cyan text-main-bg hover:bg-primary-cyan/90 gap-2 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                      <Upload className="h-4 w-4" /> Change Image
                    </div>
                    <input 
                      type="file" 
                      name="cover_image" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-secondary-text mt-2">Leave empty to keep existing cover photo.</p>
                </div>
              </div>
            </div>

            {/* Event Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Event Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  required
                  defaultValue={event.title}
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">URL Slug *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-muted-text select-none">/events/</span>
                  <input 
                    type="text" 
                    name="slug" 
                    required
                    defaultValue={event.slug}
                    className="w-full bg-[#151F30] border border-border-color rounded-lg pl-16 pr-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text flex items-center justify-between">
                  Category *
                  <button 
                    type="button" 
                    onClick={() => setIsCustomCategory(!isCustomCategory)} 
                    className="text-xs text-primary-cyan hover:underline font-bold"
                  >
                    {isCustomCategory ? 'Choose Preset' : '+ Custom Category'}
                  </button>
                </label>
                {isCustomCategory ? (
                  <input 
                    type="text" 
                    name="category" 
                    required
                    defaultValue={event.category}
                    placeholder="e.g. Ideathon" 
                    className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  />
                ) : (
                  <select 
                    name="category" 
                    defaultValue={event.category}
                    className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Short Summary *</label>
                <textarea 
                  name="short_description" 
                  required
                  defaultValue={event.short_description}
                  rows={2}
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
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
                  defaultValue={formatForDateTimeInput(event.start_datetime)}
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all text-sm [color-scheme:dark]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">End Date & Time *</label>
                <input 
                  type="datetime-local" 
                  name="end_datetime" 
                  required
                  defaultValue={formatForDateTimeInput(event.end_datetime)}
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all text-sm [color-scheme:dark]"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Venue / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
                  <input 
                    type="text" 
                    name="venue" 
                    defaultValue={event.venue || ''}
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
                  defaultValue={event.max_participants || ''}
                  placeholder="Leave empty for unlimited"
                  className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                />
              </div>
              
              <div className="flex items-center space-x-3 pt-8">
                <input 
                  type="checkbox" 
                  id="is_online" 
                  name="is_online" 
                  defaultChecked={event.is_online}
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
                        defaultValue={event.team_size_min || 2}
                        min={1}
                        className="w-full bg-[#151F30] border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-primary-text">Max Team Size</label>
                      <input 
                        type="number" 
                        name="team_size_max" 
                        defaultValue={event.team_size_max || 4}
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
                      defaultValue={event.registration_url || ''}
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
                      defaultValue={formatForDateTimeInput(event.registration_close_datetime)}
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
                  defaultValue={event.status || 'draft'}
                  className="bg-[#151F30] border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none text-sm"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Visible to public)</option>
                  <option value="completed">Completed (Archived / Finished)</option>
                  <option value="cancelled">Cancelled</option>
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
                  {loading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
                </Button>
              </div>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}
