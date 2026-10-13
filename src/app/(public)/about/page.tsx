import type { Metadata } from 'next'
import { Target, Zap, ChevronRight, Shield, Globe, Award, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: "About Us | Mission, Vision & Ecosystem",
  description:
    "Learn about ANU E-Cell NEC, our vision to empower collegiate entrepreneurs, student incubation programs, mentors, and the startup culture at Acharya Nagarjuna University.",
  canonicalPath: "/about",
})

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-24">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary-cyan/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative z-10 w-full px-4 sm:px-8 lg:px-[6vw]">
        <div className="text-center relative max-w-4xl mx-auto">
          <Badge variant="info" className="mb-6 inline-flex border-primary-cyan/30 text-primary-cyan px-4 py-1.5 bg-primary-cyan/10 backdrop-blur-md text-sm">
            Our Story
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary-text mb-6 leading-tight">
            ABOUT <span className="text-primary-cyan">ANU E-CELL</span>
          </h1>
          
          <p className="text-lg md:text-xl text-secondary-text leading-relaxed">
            We are the official entrepreneurship cell of NEC, dedicated to fostering a culture of innovation and helping students build the startups of tomorrow.
          </p>
        </div>
      </section>

      {/* Core Values / Mission Cards Section */}
      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-[6vw] mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Mission */}
          <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary-cyan/50 hover:shadow-[0_10px_30px_rgba(0,217,255,0.1)] group">
            <div className="h-14 w-14 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <Target className="h-7 w-7 text-primary-cyan" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-primary-text mb-4">Our Mission</h3>
            <p className="text-secondary-text leading-relaxed">
              To inspire, educate, and support student entrepreneurs by providing them with the necessary resources, mentorship, and a global network to turn ideas into reality.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-functional-warning/50 hover:shadow-[0_10px_30px_rgba(255,213,138,0.1)] group">
            <div className="h-14 w-14 rounded-xl bg-functional-warning/10 border border-functional-warning/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <Globe className="h-7 w-7 text-functional-warning" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-primary-text mb-4">Our Vision</h3>
            <p className="text-secondary-text leading-relaxed">
              To become a globally recognized hub for student innovation, producing high-impact startups that solve real-world problems and drive technological advancement.
            </p>
          </div>

          {/* Values */}
          <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-neon-magenta/50 hover:shadow-[0_10px_30px_rgba(240,68,255,0.1)] group">
            <div className="h-14 w-14 rounded-xl bg-neon-magenta/10 border border-neon-magenta/20 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <Zap className="h-7 w-7 text-neon-magenta" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-primary-text mb-4">Our Values</h3>
            <p className="text-secondary-text leading-relaxed">
              Innovation, Collaboration, Resilience, and Impact. We believe in building a supportive community for all creators, makers, and dreamers.
            </p>
          </div>
        </div>
      </section>

      {/* Feature / Stats Section */}
      <section className="relative z-10 w-full px-4 sm:px-8 lg:px-[6vw]">
        <div className="relative rounded-3xl overflow-hidden bg-[#101827] border border-border-color p-10 md:p-16 text-center shadow-lg">
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-12">
              Why Join <span className="text-primary-cyan">The Ecosystem?</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-primary-cyan mb-4 opacity-80" />
                <h4 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-2">50+</h4>
                <p className="text-secondary-text text-xs md:text-sm uppercase tracking-wider font-semibold">Startups</p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-neon-blue mb-4 opacity-80" />
                <h4 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-2">10k+</h4>
                <p className="text-secondary-text text-xs md:text-sm uppercase tracking-wider font-semibold">Members</p>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 text-functional-warning mb-4 opacity-80" />
                <h4 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-2">$2M+</h4>
                <p className="text-secondary-text text-xs md:text-sm uppercase tracking-wider font-semibold">Funding</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="h-8 w-8 text-neon-magenta mb-4 opacity-80" />
                <h4 className="text-3xl md:text-4xl font-heading font-bold text-primary-text mb-2">200+</h4>
                <p className="text-secondary-text text-xs md:text-sm uppercase tracking-wider font-semibold">Events</p>
              </div>
            </div>

            <Link href="/auth/register">
              <Button variant="cta" size="lg" className="px-8">
                Become a Member <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
