import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { constructMetadata } from '@/lib/seo'

export const revalidate = 60 // Revalidate every minute

export const metadata: Metadata = constructMetadata({
  title: "Events & Workshops | Hackathons & E-Summit",
  description:
    "Explore upcoming and past entrepreneurship events, hackathons, ideathons, startup bootcamps, and workshops hosted by ANU E-Cell NEC.",
  canonicalPath: "/events",
})

export default async function EventsPage() {
  const supabase = await createClient()
  
  // Fetch published events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_datetime', { ascending: true })

  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary-cyan/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative z-10 w-full px-4 sm:px-8 lg:px-[6vw]">
        <div className="text-center mb-16 relative max-w-5xl mx-auto">
          <Badge variant="info" className="mb-6 inline-flex border-primary-cyan/40 text-primary-cyan px-4 py-1.5 bg-primary-cyan/5 backdrop-blur-md">
            Discover & Participate
          </Badge>
          <h1 className="hero-heading text-4xl sm:text-5xl md:text-6xl text-primary-text mb-6 leading-tight">
            UPCOMING <span className="metallic-text">EVENTS</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed border-l-2 border-primary-cyan/30 pl-4">
            Join our hackathons, interactive workshops, and exclusive speaker sessions to level up your entrepreneurial journey.
          </p>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-[6vw]">
        {error ? (
          <div className="text-center text-functional-error p-8 bg-functional-error/10 rounded-lg border border-functional-error/20">
            Failed to load events. Please try again later.
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center p-16 bg-[#101827]/60 backdrop-blur-md border border-border-color rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <Calendar className="mx-auto h-16 w-16 text-primary-cyan/50 mb-6 drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]" />
            <h3 className="text-2xl font-heading font-bold text-primary-text mb-3">No upcoming events</h3>
            <p className="text-secondary-text">Our team is currently planning the next big thing. Check back soon for new opportunities!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.map((event) => (
              <div key={event.id} className="group relative h-full flex flex-col">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-cyan/50 to-neon-blue/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative flex flex-col h-full bg-[#0A101D] border border-border-color rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_15px_30px_-10px_rgba(0,217,255,0.2)] group-hover:border-primary-cyan/40">
                  
                  {/* Event Image Cover */}
                  <div className="relative h-56 overflow-hidden border-b border-border-color group-hover:border-primary-cyan/30 transition-colors">
                    {/* Dark overlay for better text contrast if we had text over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A101D] to-transparent opacity-60 z-10 pointer-events-none"></div>
                    
                    {event.cover_image_url ? (
                      <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#151F30] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                        <span className="font-heading font-bold text-3xl text-border-color tracking-widest uppercase opacity-40 z-10">E-CELL</span>
                      </div>
                    )}
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <Badge variant="info" className="bg-black/40 backdrop-blur-md border border-primary-cyan/50 text-primary-cyan shadow-[0_0_10px_rgba(0,217,255,0.2)]">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex flex-col flex-grow p-6 relative">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/15 transition-colors pointer-events-none"></div>
                    
                    <h2 className="text-2xl font-heading font-bold text-primary-text mb-3 line-clamp-2 group-hover:text-primary-cyan transition-colors">
                      {event.title}
                    </h2>
                    
                    <p className="text-secondary-text text-sm mb-6 line-clamp-3 leading-relaxed">
                      {event.short_description}
                    </p>
                    
                    <div className="space-y-4 text-sm text-secondary-text mt-auto pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-primary-cyan/10 border border-primary-cyan/20">
                          <Calendar className="h-4 w-4 text-primary-cyan" />
                        </div>
                        <span className="font-medium">{new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-primary-cyan/10 border border-primary-cyan/20">
                          <MapPin className="h-4 w-4 text-primary-cyan" />
                        </div>
                        <span className="font-medium line-clamp-1">{event.venue || 'Venue TBA'}</span>
                      </div>
                      {event.max_participants && (
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-primary-cyan/10 border border-primary-cyan/20">
                            <Users className="h-4 w-4 text-primary-cyan" />
                          </div>
                          <span className="font-medium">Capacity: {event.max_participants}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-4 border-t border-border-color/50">
                      <Link href={`/events/${event.slug}`} className="w-full block">
                        <Button variant="outline" className="w-full group/btn border-primary-cyan/30 text-primary-cyan hover:bg-primary-cyan hover:text-main-bg">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
