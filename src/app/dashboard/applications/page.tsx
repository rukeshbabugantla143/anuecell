import { createClient } from '@/lib/supabase/server'
import ApplicationsManager from './ApplicationsManager'

export const revalidate = 0 // Always dynamic

export default async function DashboardApplicationsPage() {
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="bg-[#101827] p-6 rounded-2xl border border-border-color shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">
          Membership Applications
        </h1>
        <p className="text-sm text-secondary-text">
          Review, approve, and manage student join requests submitted through the public website.
        </p>
      </div>

      <ApplicationsManager initialApplications={applications || []} />
    </div>
  )
}
