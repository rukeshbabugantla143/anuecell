'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Save, User, Upload } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AddTeamMemberPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAddingNewDept, setIsAddingNewDept] = useState(false)

  useEffect(() => {
    async function fetchDepartments() {
      const { data, error: err } = await supabase.from('departments').select('id, name')
      if (err) console.error("Error fetching departments:", err)
      if (data) setDepartments(data)
    }
    fetchDepartments()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const photoFile = formData.get('profile_photo') as File
    let finalPhotoUrl = null
    
    try {
      // 1. Upload photo if provided
      if (photoFile && photoFile.size > 0) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('team-photos')
          .upload(fileName, photoFile, {
            cacheControl: '3600',
            upsert: false
          })
          
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('team-photos')
          .getPublicUrl(fileName)
          
        finalPhotoUrl = publicUrl
      }

      let deptId = formData.get('department_id') || null;
      if (isAddingNewDept) {
        const newDeptName = formData.get('new_department_name')?.toString().trim();
        if (newDeptName) {
          // 1. Check if department already exists by name
          const { data: existingDept } = await supabase
            .from('departments')
            .select('id')
            .ilike('name', newDeptName)
            .maybeSingle();

          if (existingDept) {
            deptId = existingDept.id;
          } else {
            // Generate clean unique slug required by database schema
            const baseSlug = newDeptName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'dept';
            const slug = `${baseSlug}-${Date.now().toString(36)}`;
            
            const { data: newDept, error: deptErr } = await supabase
              .from('departments')
              .insert([{ name: newDeptName, slug, is_active: true }])
              .select('id')
              .maybeSingle();
              
            if (deptErr) {
              console.error('Department creation error:', deptErr);
              // Fallback: check if it was created or exists
              const { data: fallbackDept } = await supabase
                .from('departments')
                .select('id')
                .ilike('name', newDeptName)
                .maybeSingle();

              if (fallbackDept) {
                deptId = fallbackDept.id;
              } else {
                throw new Error(`Department creation failed: ${deptErr.message}`);
              }
            } else if (newDept) {
              deptId = newDept.id;
            }
          }
        }
      }

      // 2. Save member to database
      const { error: insertError } = await supabase
        .from('team_members')
        .insert([
          {
            full_name: formData.get('full_name'),
            designation: formData.get('designation'),
            email: formData.get('email') || null,
            department_id: deptId,
            biography: formData.get('biography'),
            linkedin_url: formData.get('linkedin_url') || null,
            instagram_url: formData.get('instagram_url') || null,
            profile_photo_url: finalPhotoUrl,
            is_published: formData.get('is_published') === 'on', // publish toggle
          }
        ])

      if (insertError) throw insertError

      router.push('/dashboard/team')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to add team member.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/team">
          <Button variant="ghost" size="sm" className="p-2 h-auto text-secondary-text hover:text-primary-text">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-text">Add Team Member</h1>
          <p className="text-sm text-secondary-text">Register a new core team member or volunteer.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-functional-error/10 border border-functional-error/30 text-functional-error rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="border-b border-border-color bg-secondary-bg px-6 py-4">
          <h2 className="font-heading font-semibold text-primary-text flex items-center gap-2">
            <User className="h-4 w-4 text-primary-cyan" /> Member Details
          </h2>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Photo Upload */}
              <div className="space-y-2 md:col-span-2 flex flex-col items-start mb-2">
                <label className="text-sm font-medium text-primary-text">Profile Photo</label>
                <div className="flex items-center gap-6 mt-2">
                  <div className="h-24 w-24 rounded-full border border-border-color bg-[#151F30] flex items-center justify-center overflow-hidden relative shadow-inner">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-10 w-10 text-muted-text" />
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <div className="inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-main-bg disabled:opacity-50 disabled:cursor-not-allowed h-10 px-4 py-2 text-sm bg-primary-cyan text-main-bg hover:bg-primary-cyan/90 gap-2 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                        <Upload className="h-4 w-4" /> Upload Image
                      </div>
                      <input 
                        type="file" 
                        name="profile_photo"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-secondary-text mt-2">Recommended: Square image, max 2MB (JPG, PNG)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Full Name *</label>
                <input 
                  type="text" 
                  name="full_name"
                  required
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Designation / Role *</label>
                <input 
                  type="text" 
                  name="designation"
                  required
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  placeholder="e.g. Web Developer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  placeholder="e.g. member@anuecell.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text flex items-center justify-between">
                  Department
                  <button type="button" onClick={() => setIsAddingNewDept(!isAddingNewDept)} className="text-primary-cyan text-xs hover:underline font-bold">
                    {isAddingNewDept ? "Select existing instead" : "+ Add new department"}
                  </button>
                </label>
                {isAddingNewDept ? (
                  <input 
                    type="text"
                    name="new_department_name"
                    placeholder="Enter new department name (e.g. Design)..."
                    className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  />
                ) : (
                  <select 
                    name="department_id"
                    className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all appearance-none"
                  >
                    <option value="">No Department (Core / Independent)</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-primary-text">Short Biography</label>
                <textarea 
                  name="biography"
                  rows={3}
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
                  placeholder="Optional bio..."
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">LinkedIn URL</label>
                <input 
                  type="url" 
                  name="linkedin_url"
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-text">Instagram URL</label>
                <input 
                  type="url" 
                  name="instagram_url"
                  className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2 text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border-color flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="is_published"
                  defaultChecked
                  className="w-5 h-5 rounded border-border-color bg-main-bg text-primary-cyan focus:ring-primary-cyan focus:ring-offset-main-bg cursor-pointer"
                />
                <span className="text-sm text-secondary-text group-hover:text-primary-text transition-colors">Publish immediately on website</span>
              </label>

              <div className="flex justify-end gap-3">
                <Link href="/dashboard/team">
                  <Button type="button" variant="outline" className="border-border-color hover:bg-secondary-bg">Cancel</Button>
                </Link>
                <Button type="submit" variant="primary" disabled={loading} className="gap-2 px-6 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  {loading ? 'Uploading & Saving...' : <><Save className="h-4 w-4" /> Save Member</>}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
