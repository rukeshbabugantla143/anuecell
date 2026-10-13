import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'super_admin' | 'admin' | 'team_lead' | 'team_member'

export async function requireUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/login')
  }
  
  return user
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
    
  if (error || !data) return null
  return data.role as UserRole
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireUser()
  const role = await getUserRole(user.id)
  
  if (!role || !allowedRoles.includes(role)) {
    redirect('/dashboard?error=unauthorized')
  }
  
  return { user, role }
}

export async function requireAdmin() {
  return requireRole(['super_admin', 'admin'])
}
