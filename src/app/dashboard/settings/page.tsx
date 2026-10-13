import { createClient } from '@/lib/supabase/server'
import SettingsManager from './SettingsManager'

export const revalidate = 0 // Always dynamic

export default async function DashboardSettingsPage() {
  const supabase = await createClient()

  // 1. Fetch site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')

  let generalSettings = null
  let socialSettings = null

  settingsData?.forEach((item) => {
    if (item.key === 'general') {
      generalSettings = item.value
    } else if (item.key === 'social') {
      socialSettings = item.value
    }
  })

  // 2. Fetch logged in admin user
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="bg-[#101827] p-6 rounded-2xl border border-border-color shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">
          Platform Settings
        </h1>
        <p className="text-sm text-secondary-text">
          Manage contact details, social media links, campus info, and administrator security.
        </p>
      </div>

      {/* Real Functional Settings Manager */}
      <SettingsManager
        initialGeneral={generalSettings}
        initialSocial={socialSettings}
        adminEmail={user?.email || 'Admin'}
      />
    </div>
  )
}
