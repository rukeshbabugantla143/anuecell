import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Users, Trophy, ChevronDown, Rocket, Lightbulb, Presentation, Code, Images, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import InteractiveGlobeWrapper from '@/components/3d/InteractiveGlobeWrapper'
import InnovationSphereWrapper from '@/components/3d/InnovationSphereWrapper'
import { constructMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = constructMetadata({
  title: "Home | Empowering Student Startups & Innovation",
  description:
    "Official Entrepreneurship Cell of Acharya Nagarjuna University (NEC). Providing mentorship, incubation, bootcamps, and funding guidance to student innovators.",
  canonicalPath: "/",
})

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch data for sections
  const { data: events } = await supabase.from('events').select('*').eq('status', 'published').order('start_datetime', { ascending: true }).limit(3)
  const { data: albums } = await supabase.from('albums').select('*').order('event_date', { ascending: false }).limit(3)
  const { data: galleryItems } = await supabase.from('gallery_items').select('id, album_id, media_url, title')

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anuecell.com'

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ANU E-Cell NEC",
    "alternateName": "Entrepreneurship Cell Acharya Nagarjuna University",
    "url": baseUrl,
    "logo": `${baseUrl}/E-CELL.png`,
    "description": "The official student entrepreneurship cell of NEC, dedicated to fostering innovation and building world-class startups.",
    "sameAs": [
      "https://www.linkedin.com/company/anu-ecell",
      "https://www.instagram.com/anu_ecell"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guntur",
      "addressRegion": "Andhra Pradesh",
      "addressCountry": "IN"
    }
  }

  return (
    <main className="min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* 01. Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden bg-transparent pt-6 pb-12 lg:py-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-cyan/10 via-transparent to-main-bg/80 z-0 pointer-events-none"></div>
        
        {/* Full width container, responsive padding, no max-width restriction */}
        <div className="relative z-20 w-full px-4 sm:px-8 lg:pl-[6vw] lg:pr-[4vw]">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full gap-6 lg:gap-0">
            
            {/* Left Column: Text & CTA */}
            <div className="w-full lg:w-[48%] max-w-[620px] text-left z-30 flex flex-col justify-center">
              <Badge variant="info" className="mb-3 sm:mb-4 inline-flex self-start border-primary-cyan/40 text-primary-cyan px-3 py-1 bg-primary-cyan/5 backdrop-blur-md text-xs sm:text-sm">
                Welcome to the Future
              </Badge>
              <h1 className="hero-heading text-3xl sm:text-5xl md:text-6xl lg:text-[4.75rem] flex flex-col gap-1 leading-[1.1]">
                <span className="block text-primary-text drop-shadow-[0_0_8px_rgba(0,217,255,0.15)]">
                  ANU E-CELL
                </span>
                <span className="block metallic-text pb-1 text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                  INNOVATE. BUILD. SCALE.
                </span>
              </h1>
              <p className="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-secondary-text drop-shadow-md border-l-2 border-primary-cyan/60 pl-3 sm:pl-4 leading-relaxed">
                The premier entrepreneurship hub fostering innovation, startups, and leadership among students.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link href="#about" className="scroll-smooth w-full sm:w-auto">
                  <Button variant="cta" size="lg" className="group w-full sm:w-auto justify-center">
                    Explore Our Community
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#events" className="scroll-smooth w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">Upcoming Events</Button>
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Interactive Globe */}
            <div className="w-full lg:w-[52%] relative h-[320px] sm:h-[420px] lg:h-[46vw] lg:max-h-[850px] z-20 mt-4 lg:mt-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary-cyan/10 rounded-full blur-[70px] sm:blur-[100px] -z-10 w-3/4 h-3/4 m-auto"></div>
              <InteractiveGlobeWrapper />
            </div>
            
          </div>
        </div>
      </section>

      {/* 02. About ANU E-CELL (Redesigned) */}
      <section id="about" className="py-16 sm:py-24 relative overflow-hidden">
        {/* Subtle cyan glow behind the entire section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-primary-cyan/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-cyan/20 to-transparent"></div>

        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-[6vw]">
          
          {/* Top Half: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-24">
            
            {/* Left Column: Text */}
            <div className="flex flex-col items-start text-left">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <span className="text-primary-cyan font-heading text-xs sm:text-sm tracking-widest uppercase font-bold">WHO WE ARE</span>
                <div className="h-[1px] w-12 bg-primary-cyan/40"></div>
              </div>
              
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-text mb-4 sm:mb-6 leading-[1.15]">
                Ideas into <br/><span className="text-primary-cyan drop-shadow-[0_0_15px_rgba(0,217,255,0.4)]">Impact.</span>
              </h2>
              
              <p className="text-secondary-text text-sm sm:text-base md:text-lg max-w-lg mb-6 sm:mb-10 leading-relaxed border-l-2 border-primary-cyan/30 pl-4 sm:pl-5">
                ANU E-CELL empowers student innovators by creating opportunities, providing mentorship, and building a strong entrepreneurship culture on campus.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="cta" size="lg" className="w-full sm:w-auto px-6 sm:px-8 shadow-[0_0_15px_rgba(0,217,255,0.2)] justify-center">
                    Our Mission <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/team" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 border-border-color text-primary-text hover:bg-main-bg justify-center">
                    Meet the Team
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Innovation Sphere */}
            <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-primary-cyan/30 blur-[20px] rounded-[100%]"></div>
              {/* Sci-Fi Base/Pedestal Graphic (CSS) */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-2 border-b-2 border-primary-cyan/50 rounded-[100%] shadow-[0_5px_15px_rgba(0,217,255,0.4)]"></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-64 h-4 border-b border-primary-cyan/20 rounded-[100%]"></div>
              
              <InnovationSphereWrapper />
            </div>

          </div>

          {/* Bottom Half: 4 Responsive Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Events Card */}
            <Link href="#events" className="group block">
              <div className="h-full bg-gradient-to-br from-[#101827] to-[#080D19] border border-border-color border-l-primary-cyan/50 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,217,255,0.15)] hover:border-l-primary-cyan">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors"></div>
                <Calendar className="w-8 h-8 text-primary-cyan mb-8" />
                <h3 className="text-xl font-heading font-bold text-primary-text mb-3">Events</h3>
                <p className="text-sm text-secondary-text mb-6 line-clamp-2">Hackathons, workshops, founder talks and more.</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-primary-cyan opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Student Community Card */}
            <Link href="/team" className="group block">
              <div className="h-full bg-gradient-to-br from-[#101827] to-[#080D19] border border-border-color border-l-primary-cyan/50 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,217,255,0.15)] hover:border-l-primary-cyan">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors"></div>
                <Users className="w-8 h-8 text-primary-cyan mb-8" />
                <h3 className="text-xl font-heading font-bold text-primary-text mb-3">Student Community</h3>
                <p className="text-sm text-secondary-text mb-6 line-clamp-2">A vibrant community of dreamers and builders.</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-primary-cyan opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Projects Card */}
            <Link href="/projects" className="group block">
              <div className="h-full bg-gradient-to-br from-[#101827] to-[#080D19] border border-border-color border-l-primary-cyan/50 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,217,255,0.15)] hover:border-l-primary-cyan">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors"></div>
                <Rocket className="w-8 h-8 text-primary-cyan mb-8" />
                <h3 className="text-xl font-heading font-bold text-primary-text mb-3">Projects</h3>
                <p className="text-sm text-secondary-text mb-6 line-clamp-2">Turning ideas into real-world solutions.</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-primary-cyan opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Workshops Card */}
            <Link href="#events" className="group block">
              <div className="h-full bg-gradient-to-br from-[#101827] to-[#080D19] border border-border-color border-l-primary-cyan/50 rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,217,255,0.15)] hover:border-l-primary-cyan">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors"></div>
                <Lightbulb className="w-8 h-8 text-primary-cyan mb-8" />
                <h3 className="text-xl font-heading font-bold text-primary-text mb-3">Workshops</h3>
                <p className="text-sm text-secondary-text mb-6 line-clamp-2">Skill-building sessions with industry experts.</p>
                <div className="flex justify-end">
                  <ArrowRight className="w-5 h-5 text-primary-cyan opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 04. Upcoming Events */}
      <section id="events" className="py-24 relative z-10">
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-[6vw]">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary-text mb-4">Upcoming <span className="metallic-text">Events</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events?.map(event => (
              <Card key={event.id} hoverEffect className="flex flex-col bg-[#101827]/65 border border-primary-cyan/20 backdrop-blur-md">
                <div className="h-48 bg-elevated-surface/50 overflow-hidden">
                   {event.cover_image_url && <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />}
                </div>
                <CardContent className="flex-grow">
                  <Badge variant="info" className="mb-3">{event.category}</Badge>
                  <h3 className="text-xl font-heading font-bold text-primary-text mb-2">{event.title}</h3>
                  <p className="text-sm text-secondary-text mb-4 line-clamp-2">{event.short_description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/events/${event.slug}`} className="w-full block">
                    <Button variant="secondary" className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/events"><Button variant="ghost">View All Events</Button></Link>
          </div>
        </div>
      </section>



      {/* 08. Albums Preview */}
      <section className="py-24 border-t border-border-color/50 relative z-10">
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-[6vw] text-center">
          <Badge variant="info" className="mb-4 inline-flex border-primary-cyan/40 text-primary-cyan px-3 py-1 bg-primary-cyan/5 backdrop-blur-md">
            Memories & Captured Moments
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-text mb-4">
            Event <span className="text-primary-cyan">Albums</span>
          </h2>
          <p className="text-base text-secondary-text max-w-xl mx-auto mb-12">
            Highlights, memories, and moments captured from our flagship events and external college visits.
          </p>

          {(!albums || albums.length === 0) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {galleryItems?.slice(0, 4).map(item => (
                <div key={item.id} className="aspect-square bg-elevated-surface/50 border border-primary-cyan/10 backdrop-blur-sm rounded-lg overflow-hidden relative group">
                  {item.media_url && <img src={item.media_url} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 text-left">
              {albums.map((album) => {
                const photoCount = galleryItems?.filter(g => g.album_id === album.id).length || (album.cover_image_url ? 1 : 0)
                const formattedDate = album.event_date ? new Date(album.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

                return (
                  <Link 
                    key={album.id} 
                    href={`/gallery/${album.slug}`} 
                    className="group block focus:outline-none"
                  >
                    <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl overflow-hidden shadow-xl hover:border-primary-cyan/60 hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] transition-all duration-300 flex flex-col h-full group-hover:-translate-y-1">
                      
                      {/* Cover Photo */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-secondary-bg border-b border-border-color">
                        {album.cover_image_url ? (
                          <img 
                            src={album.cover_image_url} 
                            alt={album.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary-bg/60 text-muted-text">
                            <Images className="h-10 w-10 opacity-30 mb-2" />
                            <span className="text-xs">No Cover Photo</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-transparent to-transparent opacity-80 pointer-events-none"></div>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-primary-cyan border border-primary-cyan/30">
                            {album.category || 'Event'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-md">
                            <Images className="h-3.5 w-3.5 text-primary-cyan" />
                            {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                          </span>
                        </div>

                        {/* Bottom Tags */}
                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-secondary-text font-medium pointer-events-none">
                          {album.location ? (
                            <span className="flex items-center gap-1 text-neon-magenta truncate max-w-[60%]">
                              <MapPin className="h-3.5 w-3.5 shrink-0" /> {album.location}
                            </span>
                          ) : (
                            <span></span>
                          )}

                          {formattedDate && (
                            <span className="flex items-center gap-1 shrink-0">
                              <Calendar className="h-3.5 w-3.5 text-primary-cyan" /> {formattedDate}
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
                            {album.description || 'Photo memories and captured highlights.'}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border-color/60 flex items-center justify-between text-sm font-semibold text-primary-cyan">
                          <span>Open Album</span>
                          <span className="h-8 w-8 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 flex items-center justify-center group-hover:bg-primary-cyan group-hover:text-black transition-all">
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>

                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <Link href="/gallery">
            <Button variant="ghost" className="gap-2 border border-border-color/60 hover:border-primary-cyan/60 px-6 py-3">
              Explore All Albums <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 09. Join Community */}
      <section className="py-16 sm:py-24 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-primary-cyan/5 pointer-events-none"></div>
        <div className="relative z-20 w-full px-4 sm:px-8 lg:px-[6vw] text-center max-w-[1400px] mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-text mb-4 sm:mb-6">Join Our Community</h2>
          <p className="text-base sm:text-lg text-secondary-text mb-8 sm:mb-10 max-w-2xl mx-auto">Become a member, attend our events, and start building the future.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link href="/join" className="w-full sm:w-auto"><Button variant="cta" size="lg" className="w-full sm:w-auto justify-center">Join Now</Button></Link>
            <Link href="/contact" className="w-full sm:w-auto"><Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">Contact Us</Button></Link>
          </div>
        </div>
      </section>
    </main>
  )
}
