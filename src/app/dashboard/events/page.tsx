import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Plus, Edit, Search, MapPin } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DeleteEventButton from './DeleteEventButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardEventsPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_datetime', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary-bg/50 p-6 rounded-2xl border border-border-color shadow-sm backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">Events Management</h1>
          <p className="text-sm text-secondary-text">Create, edit, and manage E-Cell events and workshops.</p>
        </div>
        <Link href="/dashboard/events/new">
          <Button variant="primary" className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all px-6 py-5 text-sm font-bold">
            <Plus className="h-5 w-5" /> Create Event
          </Button>
        </Link>
      </div>

      <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
        <div className="p-5 border-b border-border-color bg-[#0a0f17] flex justify-between items-center">
           <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input 
              type="text" 
              placeholder="Search events by title..." 
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f1522] border-b border-border-color">
              <tr>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Event Details</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Date & Time</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-main-bg">
              {!events || events.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-text">
                      <div className="h-20 w-20 rounded-full bg-secondary-bg flex items-center justify-center mb-4 shadow-inner">
                        <Calendar className="h-10 w-10 text-secondary-text opacity-50" />
                      </div>
                      <p className="text-xl font-heading font-bold text-primary-text mb-2">No events created yet</p>
                      <p className="text-sm text-secondary-text max-w-sm">You haven't scheduled any events. Click "Create Event" to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-[#151F30]/60 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-[#1A2639] flex items-center justify-center overflow-hidden border border-border-color shrink-0 shadow-inner">
                          {event.cover_image_url ? (
                            <img src={event.cover_image_url} alt={event.title} className="h-full w-full object-cover" />
                          ) : (
                            <Calendar className="h-5 w-5 text-secondary-text" />
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-primary-text text-base">{event.title}</span>
                          <span className="block text-xs text-muted-text mt-0.5">{event.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-sm text-primary-text font-medium">{new Date(event.start_datetime).toLocaleDateString()}</span>
                        <span className="text-xs text-secondary-text flex items-center gap-1.5">
                          {event.is_online ? "Online" : event.venue || "TBA"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={event.status === 'published' ? 'info' : event.status === 'completed' ? 'success' : 'default'} className="uppercase text-[10px] tracking-wider font-bold">
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/dashboard/events/${event.id}/edit`}>
                          <Button variant="outline" size="sm" className="px-3 py-1.5 h-auto border-border-color hover:border-primary-cyan text-secondary-text hover:text-primary-cyan bg-secondary-bg hover:bg-primary-cyan/10 rounded-lg font-medium text-xs">
                            <Edit className="h-3.5 w-3.5 mr-1.5 text-primary-cyan" /> Edit
                          </Button>
                        </Link>
                        <DeleteEventButton id={event.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
