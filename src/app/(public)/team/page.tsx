import type { Metadata } from 'next'
import { Badge } from '@/components/ui/Badge'
import { Mail, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

import { constructMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata: Metadata = constructMetadata({
  title: "Our Team | Student Leaders, Mentors & Faculty",
  description:
    "Meet the dynamic team behind ANU E-Cell NEC. Student innovators, technical leads, design heads, and mentors driving the entrepreneurial spirit at Acharya Nagarjuna University.",
  canonicalPath: "/team",
})

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.78v8.37H6.46v-8.37M7.86 6.81a1.64 1.64 0 0 0-1.64 1.63c0 .91.73 1.64 1.64 1.64.9 0 1.63-.73 1.63-1.64 0-.9-.73-1.63-1.63-1.63" />
    </svg>
  )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export default async function TeamPage() {
  const supabase = await createClient()

  // Fetch published team members
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*, departments(name, description, display_order)')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  // Group members by department
  const groupedDepartments: Record<string, { title: string, description: string, members: any[], order: number }> = {}
  
  if (teamMembers) {
    teamMembers.forEach(member => {
      const deptName = member.departments?.name || 'Core & Leadership'
      const deptDesc = member.departments?.description || 'The passionate visionaries and coordinators driving innovation at ANU E-Cell.'
      const deptOrder = member.departments?.display_order || 0
      
      if (!groupedDepartments[deptName]) {
        groupedDepartments[deptName] = {
          title: deptName,
          description: deptDesc,
          order: deptOrder,
          members: []
        }
      }
      groupedDepartments[deptName].members.push(member)
    })
  }

  // Sort departments by their display_order
  const departments = Object.values(groupedDepartments).sort((a, b) => a.order - b.order)

  return (
    <main className="min-h-screen relative pb-28 bg-transparent selection:bg-primary-cyan/30 selection:text-white">
      {/* Ambient background glows */}
      <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-cyan/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="hidden md:block absolute top-[600px] right-0 w-[500px] h-[400px] bg-neon-blue/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-8 sm:pb-12 relative z-10 w-full px-4 sm:px-8 lg:px-[6vw]">
        <div className="text-center relative max-w-4xl mx-auto">
          <Badge variant="info" className="mb-4 sm:mb-5 inline-flex items-center gap-2 border-primary-cyan/40 text-primary-cyan px-3.5 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm bg-primary-cyan/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,217,255,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-cyan" />
            </span>
            The Innovators & Leaders
          </Badge>

          <h1 className="hero-heading text-3xl sm:text-5xl md:text-6xl text-primary-text mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            MEET OUR <span className="metallic-text">TEAM</span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed border-l-2 border-primary-cyan/40 pl-3.5 text-left sm:text-center sm:border-l-0 sm:pl-0">
            The passionate faculty advisors, student coordinators, and tech pioneers driving innovation, startups, and entrepreneurship across ANU.
          </p>
        </div>
      </section>

      {/* Departments & Grid Showcase */}
      <section className="relative z-10 w-full px-3.5 sm:px-8 lg:px-[6vw] max-w-7xl mx-auto space-y-10 sm:space-y-20 mt-4 sm:mt-6">
        {departments.length === 0 ? (
          <div className="text-center py-20 px-6 bg-card-bg/60 backdrop-blur-md border border-border-color rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-2xl bg-primary-cyan/10 border border-primary-cyan/30 flex items-center justify-center mx-auto mb-4 text-primary-cyan">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-primary-text mb-2">Team Profiles Being Updated</h3>
            <p className="text-secondary-text text-sm">
              We are currently updating our official leadership directory. Please check back shortly.
            </p>
          </div>
        ) : (
          departments.map((dept, idx) => (
            <div key={idx} className="space-y-6 sm:space-y-8">
              {/* Department Header */}
              <div className="border-b border-border-color/80 pb-3.5 sm:pb-5">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                  <div className="h-2 w-2 rounded-full bg-primary-cyan shadow-[0_0_8px_rgba(0,217,255,0.9)]" />
                  <h2 className="text-xl sm:text-3xl font-heading font-bold text-primary-text tracking-tight">
                    {dept.title}
                  </h2>
                  <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan font-mono font-semibold">
                    {dept.members.length} {dept.members.length === 1 ? 'Member' : 'Members'}
                  </span>
                </div>
                <p className="text-secondary-text text-xs sm:text-base max-w-3xl leading-relaxed">
                  {dept.description}
                </p>
              </div>

              {/* Members Grid (Responsive 2-column on mobile, centered if single member) */}
              <div
                className={`grid gap-3 sm:gap-7 ${
                  dept.members.length === 1
                    ? 'grid-cols-1 max-w-[280px] sm:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto sm:mx-0'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {dept.members.map((member) => (
                  <div
                    key={member.id}
                    className="group relative rounded-xl sm:rounded-2xl w-full bg-card-bg/85 backdrop-blur-xl border border-border-color/80 hover:border-primary-cyan/60 shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.2)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col"
                  >
                    {/* Glowing Accent Top Line */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 shadow-[0_0_10px_rgba(0,217,255,0.8)]" />

                    {/* Member Photo */}
                    <div className="relative w-full aspect-[4/5] sm:h-80 bg-[#080d19] overflow-hidden flex items-center justify-center border-b border-border-color/80">
                      {member.profile_photo_url ? (
                        <img
                          src={member.profile_photo_url}
                          alt={member.full_name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-cyan/15 to-neon-blue/15 text-primary-cyan font-heading font-black text-2xl sm:text-4xl">
                          {member.full_name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="p-2.5 sm:p-5 flex flex-col flex-1 justify-between gap-2 sm:gap-3 bg-gradient-to-b from-card-bg to-[#0a101d]">
                      <div>
                        <h3 className="font-heading font-bold text-xs xs:text-sm sm:text-lg text-primary-text group-hover:text-primary-cyan transition-colors tracking-tight line-clamp-1">
                          {member.full_name}
                        </h3>
                        <p className="text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-cyan font-heading mt-0.5 sm:mt-1 line-clamp-1">
                          {member.designation}
                        </p>
                        {member.biography && (
                          <p className="text-xs text-muted-text line-clamp-2 mt-2 leading-relaxed hidden sm:block">
                            {member.biography}
                          </p>
                        )}
                      </div>

                      {/* Social & Contact Actions */}
                      <div className="pt-2 sm:pt-3 border-t border-border-color/60 flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-secondary-bg hover:bg-primary-cyan/20 border border-border-color hover:border-primary-cyan/50 text-secondary-text hover:text-primary-cyan flex items-center justify-center transition-all duration-200"
                              title={`Email: ${member.email}`}
                            >
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}

                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noreferrer"
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-secondary-bg hover:bg-[#0077b5]/20 border border-border-color hover:border-[#0077b5]/50 text-secondary-text hover:text-[#0077b5] flex items-center justify-center transition-all duration-200"
                              title="LinkedIn Profile"
                            >
                              <LinkedinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}

                          {member.instagram_url && (
                            <a
                              href={member.instagram_url}
                              target="_blank"
                              rel="noreferrer"
                              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-secondary-bg hover:bg-[#E1306C]/20 border border-border-color hover:border-[#E1306C]/50 text-secondary-text hover:text-[#E1306C] flex items-center justify-center transition-all duration-200"
                              title="Instagram Profile"
                            >
                              <InstagramIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          )}
                        </div>

                        <span className="text-[8px] sm:text-[11px] font-mono text-muted-text/80 uppercase hidden xs:inline-block">
                          E-Cell Core
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  )
}
