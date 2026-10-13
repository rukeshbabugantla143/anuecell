import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Users, Briefcase, CheckCircle, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardTeamPage() {
  const supabase = await createClient()
  
  // Fetch team members
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*, departments(name)')
    .order('created_at', { ascending: false })

  const totalMembers = teamMembers?.length || 0
  const publishedMembers = teamMembers?.filter(m => m.is_published).length || 0
  const drafts = totalMembers - publishedMembers
  
  // count unique departments
  const uniqueDepts = new Set(teamMembers?.map(m => m.department_id).filter(Boolean))
  const totalDepts = uniqueDepts.size

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary-bg/50 p-6 rounded-2xl border border-border-color shadow-sm backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">Team Management</h1>
          <p className="text-sm text-secondary-text">Manage your E-Cell team members, roles, and public profiles.</p>
        </div>
        <Link href="/dashboard/team/new">
          <Button variant="primary" className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] transition-all px-6 py-5 text-sm font-bold">
            <Plus className="h-5 w-5" /> Add New Member
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#101827] border-primary-cyan/20 hover:border-primary-cyan/40 transition-colors shadow-lg shadow-primary-cyan/5">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary-cyan/10 flex items-center justify-center text-primary-cyan border border-primary-cyan/20 shadow-inner">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-bold uppercase tracking-wider mb-1">Total Members</p>
              <h3 className="text-3xl font-display font-black text-white">{totalMembers}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#101827] border-functional-success/20 hover:border-functional-success/40 transition-colors shadow-lg shadow-functional-success/5">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-functional-success/10 flex items-center justify-center text-functional-success border border-functional-success/20 shadow-inner">
              <CheckCircle className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-bold uppercase tracking-wider mb-1">Published</p>
              <h3 className="text-3xl font-display font-black text-white">{publishedMembers}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#101827] border-functional-warning/20 hover:border-functional-warning/40 transition-colors shadow-lg shadow-functional-warning/5">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-functional-warning/10 flex items-center justify-center text-functional-warning border border-functional-warning/20 shadow-inner">
              <Edit className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-bold uppercase tracking-wider mb-1">Drafts / Hidden</p>
              <h3 className="text-3xl font-display font-black text-white">{drafts}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#101827] border-neon-magenta/20 hover:border-neon-magenta/40 transition-colors shadow-lg shadow-neon-magenta/5">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-neon-magenta/10 flex items-center justify-center text-neon-magenta border border-neon-magenta/20 shadow-inner">
              <Briefcase className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs text-secondary-text font-bold uppercase tracking-wider mb-1">Active Depts</p>
              <h3 className="text-3xl font-display font-black text-white">{totalDepts}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
        {/* Toolbar */}
        <div className="p-5 border-b border-border-color bg-[#0a0f17] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input 
              type="text" 
              placeholder="Search team members by name or role..." 
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all placeholder:text-muted-text"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto gap-2 border-border-color hover:bg-secondary-bg hover:text-white px-4 py-2.5 rounded-xl">
            <Filter className="h-4 w-4" /> Filter & Sort
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f1522] border-b border-border-color">
              <tr>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Member Profile</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Role & Department</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-main-bg">
              {teamMembers?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-text">
                      <div className="h-20 w-20 rounded-full bg-secondary-bg flex items-center justify-center mb-4">
                        <Users className="h-10 w-10 text-secondary-text opacity-50" />
                      </div>
                      <p className="text-xl font-heading font-bold text-primary-text mb-2">No team members yet</p>
                      <p className="text-sm text-secondary-text max-w-sm">Your directory is empty. Click the button above to add your first team member.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                teamMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-[#151F30]/60 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-[#1A2639] flex items-center justify-center overflow-hidden border border-border-color shrink-0 shadow-inner">
                          {member.profile_photo_url ? (
                            <img src={member.profile_photo_url} alt={member.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-secondary-text font-bold text-lg">{member.full_name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <span className="block font-bold text-primary-text text-base">{member.full_name}</span>
                          <span className="block text-xs text-muted-text mt-0.5">{member.email || 'No email attached'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-start gap-2">
                        <Badge variant="info" className="bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20 px-3 py-1 font-bold">{member.designation}</Badge>
                        <span className="text-xs text-secondary-text flex items-center gap-1.5 font-medium">
                          <Briefcase className="h-3.5 w-3.5 opacity-70" /> {member.departments?.name || 'Core / Independent'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {member.is_published ? (
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-functional-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-functional-success"></span>
                          </span>
                          <span className="text-functional-success font-semibold text-sm">Published</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-functional-warning"></span>
                          <span className="text-functional-warning font-semibold text-sm">Draft</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/team/${member.id}/edit`}>
                          <Button variant="ghost" size="sm" className="px-3 py-2 h-auto text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 rounded-lg">
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="px-3 py-2 h-auto text-secondary-text hover:text-functional-error hover:bg-functional-error/10 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
