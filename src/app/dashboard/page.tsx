import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, Calendar, Image as ImageIcon, MessageSquare, TrendingUp, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardOverview() {
  const supabase = await createClient()

  // Fetch counts and recent events in parallel
  const [
    { count: teamCount },
    { count: eventsCount },
    { count: galleryCount },
    { count: messagesCount },
    { data: recentEvents },
  ] = await Promise.all([
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    supabase
      .from('events')
      .select('id, title, status, start_datetime')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const stats = [
    { name: 'Total Team Members', value: teamCount || 0, icon: Users, color: 'text-primary-cyan', bg: 'bg-primary-cyan/10', border: 'border-primary-cyan/20' },
    { name: 'Events Created', value: eventsCount || 0, icon: Calendar, color: 'text-neon-magenta', bg: 'bg-neon-magenta/10', border: 'border-neon-magenta/20' },
    { name: 'Gallery Images', value: galleryCount || 0, icon: ImageIcon, color: 'text-functional-success', bg: 'bg-functional-success/10', border: 'border-functional-success/20' },
    { name: 'New Messages', value: messagesCount || 0, icon: MessageSquare, color: 'text-functional-warning', bg: 'bg-functional-warning/10', border: 'border-functional-warning/20' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0f17]/50 p-6 rounded-2xl border border-border-color backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">Welcome back, Admin!</h1>
          <p className="text-sm text-secondary-text">Here is what's happening with ANU E-Cell today.</p>
        </div>
        <Button variant="primary" className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
          <Activity className="h-4 w-4" /> View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className={`bg-[#101827] border ${stat.border} hover:border-opacity-50 transition-colors shadow-lg`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-secondary-text font-bold uppercase tracking-wider mb-1">{stat.name}</p>
                  <h3 className="text-3xl font-display font-black text-white">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} border ${stat.border}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout for Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Events Widget */}
        <Card className="lg:col-span-2 bg-[#101827] border-border-color shadow-xl">
          <div className="p-6 border-b border-border-color flex justify-between items-center">
            <h2 className="text-xl font-heading font-bold text-primary-text flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-cyan" /> Recent Events
            </h2>
            <Link href="/dashboard/events">
              <Button variant="ghost" size="sm" className="text-primary-cyan hover:bg-primary-cyan/10">View All</Button>
            </Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-border-color">
                {recentEvents?.map((event) => (
                  <tr key={event.id} className="hover:bg-[#151F30] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary-text">{event.title}</p>
                      <p className="text-xs text-secondary-text mt-1">{new Date(event.start_datetime).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        event.status === 'published' ? 'bg-functional-success/10 text-functional-success border border-functional-success/20' : 
                        'bg-functional-warning/10 text-functional-warning border border-functional-warning/20'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions Widget */}
        <Card className="bg-[#101827] border-border-color shadow-xl">
          <div className="p-6 border-b border-border-color">
            <h2 className="text-xl font-heading font-bold text-primary-text flex items-center gap-2">
              <Activity className="h-5 w-5 text-neon-magenta" /> Quick Actions
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <Link href="/dashboard/events/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#151F30] border border-transparent hover:border-border-color transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-cyan/10 flex items-center justify-center text-primary-cyan">
                  <Calendar className="h-5 w-5" />
                </div>
                <span className="font-medium text-secondary-text group-hover:text-primary-text transition-colors">Create Event</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-text group-hover:text-primary-cyan group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link href="/dashboard/team/new" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#151F30] border border-transparent hover:border-border-color transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-neon-magenta/10 flex items-center justify-center text-neon-magenta">
                  <Users className="h-5 w-5" />
                </div>
                <span className="font-medium text-secondary-text group-hover:text-primary-text transition-colors">Add Team Member</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-text group-hover:text-neon-magenta group-hover:translate-x-1 transition-all" />
            </Link>

            <Link href="/dashboard/gallery" className="flex items-center justify-between p-3 rounded-xl hover:bg-[#151F30] border border-transparent hover:border-border-color transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-functional-success/10 flex items-center justify-center text-functional-success">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <span className="font-medium text-secondary-text group-hover:text-primary-text transition-colors">Upload Photos</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-text group-hover:text-functional-success group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </Card>

      </div>
    </div>
  )
}
