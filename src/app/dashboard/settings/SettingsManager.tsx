'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  Globe, 
  Share2, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Loader2, 
  KeyRound, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Briefcase, 
  Send, 
  Video, 
  Code,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface GeneralSettings {
  site_name: string
  tagline: string
  contact_email: string
  contact_phone: string
  address: string
  membership_status: string
}

interface SocialSettings {
  instagram_url: string
  linkedin_url: string
  twitter_url: string
  github_url: string
  youtube_url: string
}

interface SettingsManagerProps {
  initialGeneral?: GeneralSettings | null
  initialSocial?: SocialSettings | null
  adminEmail?: string
}

export default function SettingsManager({ 
  initialGeneral, 
  initialSocial,
  adminEmail = 'Admin'
}: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'security'>('general')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // General Settings State
  const [general, setGeneral] = useState<GeneralSettings>({
    site_name: initialGeneral?.site_name || 'ANU E-Cell',
    tagline: initialGeneral?.tagline || 'Innovate. Build. Scale.',
    contact_email: initialGeneral?.contact_email || 'hello@anuecell.com',
    contact_phone: initialGeneral?.contact_phone || '+91 86323 46114',
    address: initialGeneral?.address || 'Acharya Nagarjuna University, NH16, Nagarjuna Nagar, Guntur, AP - 522510',
    membership_status: initialGeneral?.membership_status || 'open'
  })

  // Social Links State
  const [social, setSocial] = useState<SocialSettings>({
    instagram_url: initialSocial?.instagram_url || 'https://instagram.com/anu_ecell',
    linkedin_url: initialSocial?.linkedin_url || 'https://linkedin.com/company/anu-ecell',
    twitter_url: initialSocial?.twitter_url || 'https://x.com/anu_ecell',
    github_url: initialSocial?.github_url || 'https://github.com/anu-ecell',
    youtube_url: initialSocial?.youtube_url || ''
  })

  // Password Change State
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordUpdating, setPasswordUpdating] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'general',
            value: general,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        )

      if (error) throw error
      setSuccessMessage('General settings updated successfully!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Failed to save general settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'social',
            value: social,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'key' }
        )

      if (error) throw error
      setSuccessMessage('Social media links updated successfully!')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Failed to save social links.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    try {
      setPasswordUpdating(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error(err)
      setPasswordError(err.message || 'Failed to update password.')
    } finally {
      setPasswordUpdating(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Settings Navigation Tabs */}
      <div className="space-y-2">
        <button
          onClick={() => {
            setActiveTab('general')
            setSuccessMessage(null)
            setErrorMessage(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'general'
              ? 'bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 shadow-[inset_4px_0_0_0_rgba(0,217,255,1)]'
              : 'text-secondary-text hover:bg-secondary-bg hover:text-white'
          }`}
        >
          <Globe className="h-5 w-5" /> General & Contact
        </button>

        <button
          onClick={() => {
            setActiveTab('social')
            setSuccessMessage(null)
            setErrorMessage(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'social'
              ? 'bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 shadow-[inset_4px_0_0_0_rgba(0,217,255,1)]'
              : 'text-secondary-text hover:bg-secondary-bg hover:text-white'
          }`}
        >
          <Share2 className="h-5 w-5" /> Social Media Links
        </button>

        <button
          onClick={() => {
            setActiveTab('security')
            setSuccessMessage(null)
            setErrorMessage(null)
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
            activeTab === 'security'
              ? 'bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 shadow-[inset_4px_0_0_0_rgba(0,217,255,1)]'
              : 'text-secondary-text hover:bg-secondary-bg hover:text-white'
          }`}
        >
          <ShieldCheck className="h-5 w-5" /> Security & Password
        </button>
      </div>

      {/* Settings Forms Content */}
      <div className="md:col-span-3 space-y-6">
        
        {/* Alerts */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-functional-success/10 border border-functional-success/30 text-functional-success text-sm animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-functional-error/10 border border-functional-error/30 text-functional-error text-sm animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: GENERAL SETTINGS */}
        {activeTab === 'general' && (
          <Card className="border-border-color shadow-xl bg-main-bg">
            <div className="p-6 border-b border-border-color flex justify-between items-center">
              <div>
                <h2 className="text-xl font-heading font-bold text-primary-text">General & Contact Settings</h2>
                <p className="text-sm text-secondary-text mt-1">Configure global website details and contact information.</p>
              </div>
            </div>

            <form onSubmit={handleSaveGeneral}>
              <CardContent className="p-6 space-y-6">
                
                {/* Site Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text">Site Name *</label>
                    <input
                      type="text"
                      required
                      value={general.site_name}
                      onChange={(e) => setGeneral({ ...general, site_name: e.target.value })}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text">Tagline / Motto</label>
                    <input
                      type="text"
                      value={general.tagline}
                      onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-primary-cyan" /> Official Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={general.contact_email}
                      onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-neon-magenta" /> Official Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={general.contact_phone}
                      onChange={(e) => setGeneral({ ...general, contact_phone: e.target.value })}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-functional-success" /> Campus Address
                  </label>
                  <textarea
                    rows={2}
                    value={general.address}
                    onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan resize-none transition-all"
                  />
                </div>

                {/* Membership Status */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text">
                    Membership Registration Status
                  </label>
                  <select
                    value={general.membership_status}
                    onChange={(e) => setGeneral({ ...general, membership_status: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  >
                    <option value="open">Open (Accepting new student members)</option>
                    <option value="closed">Closed (Registrations paused)</option>
                  </select>
                  <p className="text-xs text-secondary-text">
                    Controls whether new students can register via the public website.
                  </p>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-border-color flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] px-6"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save General Settings'}
                  </Button>
                </div>

              </CardContent>
            </form>
          </Card>
        )}

        {/* TAB 2: SOCIAL MEDIA LINKS */}
        {activeTab === 'social' && (
          <Card className="border-border-color shadow-xl bg-main-bg">
            <div className="p-6 border-b border-border-color">
              <h2 className="text-xl font-heading font-bold text-primary-text">Social Media & Public Links</h2>
              <p className="text-sm text-secondary-text mt-1">
                These URLs will be linked in the website footer, header, and contact pages.
              </p>
            </div>

            <form onSubmit={handleSaveSocial}>
              <CardContent className="p-6 space-y-5">
                
                {/* Instagram */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Camera className="h-4 w-4 text-neon-magenta" /> Instagram URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/anu_ecell"
                    value={social.instagram_url}
                    onChange={(e) => setSocial({ ...social, instagram_url: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary-cyan" /> LinkedIn Profile / Page
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/anu-ecell"
                    value={social.linkedin_url}
                    onChange={(e) => setSocial({ ...social, linkedin_url: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                </div>

                {/* Twitter / X */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Send className="h-4 w-4 text-white" /> Twitter / X Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://x.com/anu_ecell"
                    value={social.twitter_url}
                    onChange={(e) => setSocial({ ...social, twitter_url: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-text" /> GitHub Organization
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/anu-ecell"
                    value={social.github_url}
                    onChange={(e) => setSocial({ ...social, github_url: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Video className="h-4 w-4 text-functional-error" /> YouTube Channel
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/@anu_ecell"
                    value={social.youtube_url}
                    onChange={(e) => setSocial({ ...social, youtube_url: e.target.value })}
                    className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-border-color flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] px-6"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? 'Saving...' : 'Save Social Links'}
                  </Button>
                </div>

              </CardContent>
            </form>
          </Card>
        )}

        {/* TAB 3: SECURITY & ADMIN PASSWORD */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            
            {/* Account Details Card */}
            <Card className="border-border-color shadow-xl bg-main-bg">
              <div className="p-6 border-b border-border-color">
                <h2 className="text-xl font-heading font-bold text-primary-text">Admin Account</h2>
                <p className="text-sm text-secondary-text mt-1">Details about your active administrator profile.</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#151F30] border border-border-color">
                    <p className="text-xs text-secondary-text mb-1">Logged In Email</p>
                    <p className="text-base font-bold text-primary-text">{adminEmail}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#151F30] border border-border-color">
                    <p className="text-xs text-secondary-text mb-1">Assigned Role</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30">
                      Super Admin
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border-border-color shadow-xl bg-main-bg">
              <div className="p-6 border-b border-border-color">
                <h2 className="text-xl font-heading font-bold text-primary-text flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-neon-magenta" /> Change Admin Password
                </h2>
                <p className="text-sm text-secondary-text mt-1">
                  Update your dashboard login password. Minimum 6 characters.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword}>
                <CardContent className="p-6 space-y-5">
                  
                  {passwordSuccess && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-functional-success/10 border border-functional-success/30 text-functional-success text-sm">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span>Password changed successfully! You can now log in with your new password.</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-functional-error/10 border border-functional-error/30 text-functional-error text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text">New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={passwordUpdating}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary-text">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={passwordUpdating}
                      className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-3 text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                    />
                  </div>

                  <div className="pt-4 border-t border-border-color flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={passwordUpdating || !newPassword}
                      className="gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] px-6"
                    >
                      {passwordUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                      {passwordUpdating ? 'Updating Password...' : 'Update Password'}
                    </Button>
                  </div>

                </CardContent>
              </form>
            </Card>

          </div>
        )}

      </div>
    </div>
  )
}
