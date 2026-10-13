import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, MapPin, Globe, Users, ExternalLink, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { constructMetadata, getAbsoluteImageUrl } from '@/lib/seo'

export const revalidate = 60 // Revalidate every minute

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient()
  const resolvedParams = await params
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const { data: event } = await supabase
    .from('events')
    .select('title, short_description, full_description, cover_image_url, start_datetime, end_datetime, venue, category')
    .eq('slug', decodedSlug)
    .single()

  if (!event) {
    return constructMetadata({
      title: 'Event Not Found',
      description: 'The requested event could not be found.',
      canonicalPath: `/events/${encodeURIComponent(decodedSlug)}`,
      noIndex: true,
    })
  }

  const title = event.title
  const description =
    event.short_description ||
    event.full_description?.replace(/<[^>]*>?/gm, '').slice(0, 160) ||
    'Join our upcoming entrepreneurship event at ANU E-Cell NEC.'

  const imageUrl = getAbsoluteImageUrl(event.cover_image_url)

  return constructMetadata({
    title: `${title} | Events`,
    description,
    image: imageUrl,
    imageAlt: `${title} - ANU E-Cell Event Poster`,
    canonicalPath: `/events/${encodeURIComponent(decodedSlug)}`,
    type: 'article',
    publishedTime: event.start_datetime,
    tags: event.category ? [event.category, 'Startup Event', 'ANU E-Cell'] : ['Startup Event'],
  })
}

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()

  // Next.js 15+ dynamic route params must be awaited
  const resolvedParams = await params;

  // Fix: The slug might be URI encoded (e.g. startup%20weekend), so we decode it.
  const decodedSlug = decodeURIComponent(resolvedParams.slug)

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', decodedSlug)
    .single()

  if (error || !event) {
    notFound()
  }

  const startDate = new Date(event.start_datetime)
  const endDate = new Date(event.end_datetime)
  
  // Formatting dates nicely
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
  
  const formattedDate = startDate.toLocaleDateString('en-US', dateOptions)
  const startTime = startDate.toLocaleTimeString('en-US', timeOptions)
  const endTime = endDate.toLocaleTimeString('en-US', timeOptions)

  const isRegistrationOpen = event.registration_enabled && 
    (!event.registration_close_datetime || new Date(event.registration_close_datetime) > new Date())

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary-cyan/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      
      {/* Back Button */}
      <div className="pt-24 px-4 sm:px-8 lg:px-[6vw] max-w-7xl mx-auto relative z-10">
        <Link href="/events" className="inline-flex items-center text-secondary-text hover:text-primary-cyan transition-colors mb-8 group">
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to all events
        </Link>
      </div>

      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-[6vw] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content (Left side) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header / Title area */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge variant="info" className="px-3 py-1 bg-primary-cyan/10 text-primary-cyan border-primary-cyan/20">
                  {event.category}
                </Badge>
                {event.status === 'completed' && (
                  <Badge variant="success" className="px-3 py-1">Completed</Badge>
                )}
              </div>
              <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-primary-text mb-6 leading-tight">
                {event.title}
              </h1>
            </div>

            {/* Cover Image */}
            {event.cover_image_url ? (
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border-color shadow-[0_0_30px_rgba(0,217,255,0.1)]">
                <img 
                  src={event.cover_image_url} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[21/9] rounded-2xl bg-secondary-bg border border-border-color flex items-center justify-center shadow-inner">
                <Calendar className="h-16 w-16 text-muted-text opacity-50" />
              </div>
            )}

            {/* Full Detailed Description */}
            <div className="prose prose-invert prose-cyan max-w-none pt-4">
              <h3 className="text-2xl font-heading font-bold text-primary-text mb-4 border-b border-border-color pb-2">
                About The Event
              </h3>
              <div 
                className="text-secondary-text leading-relaxed text-base sm:text-lg space-y-4 whitespace-pre-wrap [&_a]:text-primary-cyan [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold"
                dangerouslySetInnerHTML={{ __html: event.full_description || event.short_description }}
              />
            </div>
          </div>

          {/* Sticky Sidebar (Right side) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Event Details Card */}
              <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-cyan/10 blur-[50px] rounded-full pointer-events-none"></div>
                
                <h3 className="text-lg font-heading font-bold text-primary-text mb-6">Event Details</h3>
                
                <div className="space-y-6">
                  {/* Participation Type / Team Size */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center shrink-0 border border-primary-cyan/20">
                      {event.participation_type === 'team' ? (
                        <Users className="h-5 w-5 text-primary-cyan" />
                      ) : (
                        <Users className="h-5 w-5 text-primary-cyan" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-text">Participation Format</p>
                      <p className="text-sm text-secondary-text mt-1">
                        {event.participation_type === 'team' ? (
                          <span className="text-primary-cyan font-medium">
                            Team Event ({(event.team_size_min || 1) === (event.team_size_max || 1) ? `${event.team_size_min || 1} Members` : `${event.team_size_min || 1} - ${event.team_size_max || 4} Members`})
                          </span>
                        ) : (
                          'Individual (Solo)'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center shrink-0 border border-primary-cyan/20">
                      <Calendar className="h-5 w-5 text-primary-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-text">Date</p>
                      <p className="text-sm text-secondary-text mt-1">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-neon-magenta/10 flex items-center justify-center shrink-0 border border-neon-magenta/20">
                      <Clock className="h-5 w-5 text-neon-magenta" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-text">Time</p>
                      <p className="text-sm text-secondary-text mt-1">{startTime} - {endTime}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-functional-success/10 flex items-center justify-center shrink-0 border border-functional-success/20">
                      {event.is_online ? <Globe className="h-5 w-5 text-functional-success" /> : <MapPin className="h-5 w-5 text-functional-success" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-text">{event.is_online ? 'Online Event' : 'Venue'}</p>
                      <p className="text-sm text-secondary-text mt-1">
                        {event.is_online ? (
                          event.online_url ? <a href={event.online_url} className="text-primary-cyan hover:underline break-all" target="_blank" rel="noreferrer">Meeting Link</a> : 'Link provided upon registration'
                        ) : (
                          event.venue || 'TBA'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
                  {event.max_participants && (
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-lg bg-functional-warning/10 flex items-center justify-center shrink-0 border border-functional-warning/20">
                        <Users className="h-5 w-5 text-functional-warning" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary-text">Overall Capacity</p>
                        <p className="text-sm text-secondary-text mt-1">Limited to {event.max_participants} {event.participation_type === 'team' ? 'teams/participants' : 'participants'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration / CTA Card */}
              <div className="bg-[#101827]/80 backdrop-blur-md border border-primary-cyan/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,217,255,0.1)] text-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary-cyan/10 to-transparent pointer-events-none"></div>
                
                {event.status === 'completed' ? (
                  <>
                    <h3 className="text-xl font-heading font-bold text-primary-text mb-2">Event Concluded</h3>
                    <p className="text-sm text-secondary-text mb-6">This event has already taken place. Thank you to everyone who participated!</p>
                    <Link href="/gallery">
                      <Button variant="outline" className="w-full border-border-color">Check Gallery</Button>
                    </Link>
                  </>
                ) : isRegistrationOpen ? (
                  <>
                    <h3 className="text-xl font-heading font-bold text-primary-text mb-2">Registration is Open!</h3>
                    <p className="text-sm text-secondary-text mb-6">Secure your spot for {event.title} now before seats fill up.</p>
                    {event.registration_url ? (
                      <a href={event.registration_url} target="_blank" rel="noreferrer" className="w-full block">
                        <Button variant="primary" className="w-full shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] gap-2 py-6 text-lg">
                          Register Now <ExternalLink className="h-5 w-5" />
                        </Button>
                      </a>
                    ) : (
                      <Button variant="primary" className="w-full shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] py-6 text-lg">
                        Register Now
                      </Button>
                    )}
                    {event.registration_close_datetime && (
                      <p className="text-xs text-functional-error mt-4 font-medium">
                        Closes: {new Date(event.registration_close_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-heading font-bold text-primary-text mb-2">Registration Closed</h3>
                    <p className="text-sm text-secondary-text">We are no longer accepting registrations for this event.</p>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
