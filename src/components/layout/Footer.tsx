import Link from 'next/link'
import DotGrid from '@/components/ui/DotGrid'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
  const supabase = await createClient()
  const { data: socialRow } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'social')
    .single()

  const social = socialRow?.value || {
    linkedin_url: 'https://linkedin.com/company/anu-ecell',
    instagram_url: 'https://instagram.com/anu_ecell',
    twitter_url: 'https://x.com/anu_ecell'
  }

  return (
    <footer className="relative z-10 bg-[#050711] border-t border-border-color/50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <DotGrid
          dotSize={6}
          gap={24}
          baseColor="#1f2937"
          activeColor="#00d9ff"
          proximity={150}
          shockRadius={200}
          shockStrength={4}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded bg-primary-cyan flex items-center justify-center font-bold text-main-bg">E</div>
              <span className="text-xl font-bold font-heading text-primary-text tracking-tight">ANU E-Cell</span>
            </div>
            <p className="text-sm text-secondary-text">
              Empowering students to innovate, build, and scale the startups of tomorrow.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-text tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">About Us</Link></li>
              <li><Link href="/events" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">Events</Link></li>
              <li><Link href="/team" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">Team</Link></li>
              <li><Link href="/gallery" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-text tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-secondary-text hover:text-primary-cyan transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-text tracking-wider uppercase mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={social.linkedin_url || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-secondary-text hover:text-primary-cyan transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href={social.instagram_url || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-secondary-text hover:text-primary-cyan transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href={social.twitter_url || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-sm text-secondary-text hover:text-primary-cyan transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-text">
            &copy; {new Date().getFullYear()} ANU E-Cell NEC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
