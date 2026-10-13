import type { Metadata } from 'next'
import { Badge } from '@/components/ui/Badge'
import { Bell, Calendar, ArrowRight, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { constructMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = constructMetadata({
  title: "Announcements & Notices",
  description: "Stay up to date with the latest announcements, circulars, and updates from ANU E-Cell NEC.",
  canonicalPath: "/announcements",
})

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 pt-20 px-4 sm:px-8 lg:px-[6vw]">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="text-center mb-16">
          <Badge variant="info" className="mb-6 inline-flex border-primary-cyan/30 text-primary-cyan px-4 py-1.5 bg-primary-cyan/10">
            Updates & Bulletins
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary-text mb-6">
            Official <span className="text-primary-cyan">Announcements</span>
          </h1>
          <p className="text-secondary-text text-lg max-w-2xl mx-auto">
            Latest circulars, competition deadlines, and official announcements from the ANU E-Cell team.
          </p>
        </div>

        {announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-6 sm:p-8 transition-all hover:border-primary-cyan/40"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary-text">
                    {item.title}
                  </h2>
                  {item.created_at && (
                    <span className="text-xs text-secondary-text whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {item.message && (
                  <p className="text-secondary-text leading-relaxed mb-4">
                    {item.message}
                  </p>
                )}
                {item.cta_url && item.cta_label && (
                  <a
                    href={item.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary-cyan hover:underline text-sm font-medium"
                  >
                    {item.cta_label} <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#101827]/80 backdrop-blur-md border border-border-color rounded-2xl p-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center mb-6">
              <Bell className="h-8 w-8 text-primary-cyan" />
            </div>
            <h2 className="text-2xl font-heading font-semibold text-primary-text mb-3">No Active Bulletins Right Now</h2>
            <p className="text-secondary-text max-w-md mx-auto">
              Stay tuned! Upcoming event notices and club notifications will be posted here regularly.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
