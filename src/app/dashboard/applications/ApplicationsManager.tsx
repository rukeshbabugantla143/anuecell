'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Search, 
  Check, 
  X, 
  Trash2, 
  Phone, 
  Mail, 
  ExternalLink, 
  MessageSquare, 
  User, 
  GraduationCap, 
  Calendar, 
  Loader2,
  Eye,
  Sparkles,
  Inbox
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  full_name: string
  email: string
  phone: string
  roll_number?: string | null
  college_name?: string | null
  department: string
  year_of_study: string
  primary_interest: string
  why_join?: string | null
  linkedin_url?: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface ApplicationsManagerProps {
  initialApplications: Application[]
}

export default function ApplicationsManager({ initialApplications }: ApplicationsManagerProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const supabase = createClient()
  const router = useRouter()

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      setUpdatingId(id)
      const { error } = await supabase
        .from('membership_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus })
      }
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert('Failed to update status: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the application from ${name}?`)) return

    try {
      setUpdatingId(id)
      const { error } = await supabase
        .from('membership_applications')
        .delete()
        .eq('id', id)

      if (error) throw error

      setApplications((prev) => prev.filter((app) => app.id !== id))
      if (selectedApp?.id === id) setSelectedApp(null)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete application: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  // Filter & Search Logic
  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.phone?.toLowerCase().includes(search.toLowerCase()) ||
      app.roll_number?.toLowerCase().includes(search.toLowerCase()) ||
      app.department?.toLowerCase().includes(search.toLowerCase()) ||
      app.primary_interest?.toLowerCase().includes(search.toLowerCase())

    if (statusFilter === 'all') return matchesSearch
    return matchesSearch && app.status === statusFilter
  })

  const pendingCount = applications.filter((a) => a.status === 'pending').length
  const approvedCount = applications.filter((a) => a.status === 'approved').length
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '')
  }

  return (
    <div className="space-y-6">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#101827] border border-border-color">
          <p className="text-xs text-secondary-text mb-1">Total Received</p>
          <p className="text-2xl font-bold text-primary-text">{applications.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-functional-warning/30">
          <p className="text-xs text-functional-warning mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-functional-warning">{pendingCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-functional-success/30">
          <p className="text-xs text-functional-success mb-1">Approved Members</p>
          <p className="text-2xl font-bold text-functional-success">{approvedCount}</p>
        </div>

        <div className="p-4 rounded-xl bg-[#101827] border border-functional-error/30">
          <p className="text-xs text-functional-error mb-1">Rejected</p>
          <p className="text-2xl font-bold text-functional-error">{rejectedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0a0f17] border border-border-color flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#151F30] p-1.5 rounded-xl border border-border-color/80 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-cyan text-black'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            All ({applications.length})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'pending'
                ? 'bg-functional-warning text-black'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'approved'
                ? 'bg-functional-success text-black'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            Approved ({approvedCount})
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === 'rejected'
                ? 'bg-functional-error text-white'
                : 'text-secondary-text hover:text-white'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, branch..."
            className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-primary-text focus:outline-none focus:border-primary-cyan transition-all"
          />
        </div>
      </div>

      {/* Applications Table / List */}
      <Card className="border-border-color shadow-2xl bg-main-bg overflow-hidden">
        {filtered.length === 0 ? (
          <CardContent className="p-16 text-center">
            <div className="h-20 w-20 rounded-2xl bg-secondary-bg flex items-center justify-center mx-auto mb-4 border border-border-color">
              <Inbox className="h-10 w-10 text-muted-text opacity-50" />
            </div>
            <p className="text-xl font-heading font-bold text-primary-text mb-2">No applications found</p>
            <p className="text-sm text-secondary-text max-w-md mx-auto">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search query or filter options.'
                : 'New applications submitted through the public Join page will appear here.'}
            </p>
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-secondary-text">
              <thead className="bg-[#0a0f17] text-xs font-heading uppercase text-muted-text border-b border-border-color">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Branch & Year</th>
                  <th className="px-6 py-4">Area of Interest</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/60">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-[#151F30]/40 transition-colors">
                    
                    {/* Applicant details */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-primary-text">{app.full_name}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-text">
                          <a
                            href={`mailto:${app.email}`}
                            className="hover:text-primary-cyan flex items-center gap-1"
                            title="Send Email"
                          >
                            <Mail className="h-3 w-3" /> {app.email}
                          </a>
                          <a
                            href={`https://wa.me/${getCleanPhone(app.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-functional-success flex items-center gap-1"
                            title="Chat on WhatsApp"
                          >
                            <Phone className="h-3 w-3" /> {app.phone}
                          </a>
                        </div>
                        {app.roll_number && (
                          <span className="text-[11px] text-primary-cyan/80 mt-0.5 block">
                            ID: {app.roll_number}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Branch & Year */}
                    <td className="px-6 py-4">
                      <p className="text-xs text-primary-text font-medium">{app.department}</p>
                      <span className="text-[11px] text-muted-text">{app.year_of_study}</span>
                    </td>

                    {/* Area of Interest */}
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20">
                        {app.primary_interest}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      {app.status === 'approved' ? (
                        <Badge variant="success">Approved</Badge>
                      ) : app.status === 'rejected' ? (
                        <Badge variant="error">Rejected</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>

                    {/* Submission Date */}
                    <td className="px-6 py-4 text-xs">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Full Modal */}
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-lg bg-secondary-bg hover:bg-secondary-bg/80 text-secondary-text hover:text-primary-cyan transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Quick Approve */}
                        {app.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            disabled={updatingId === app.id}
                            className="p-1.5 rounded-lg bg-functional-success/10 hover:bg-functional-success/20 text-functional-success transition-colors"
                            title="Approve Member"
                          >
                            {updatingId === app.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {/* Quick Reject */}
                        {app.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            disabled={updatingId === app.id}
                            className="p-1.5 rounded-lg bg-functional-error/10 hover:bg-functional-error/20 text-functional-error transition-colors"
                            title="Reject Application"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(app.id, app.full_name)}
                          disabled={updatingId === app.id}
                          className="p-1.5 rounded-lg bg-secondary-bg hover:bg-functional-error/20 text-muted-text hover:text-functional-error transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* FULL DETAILS MODAL */}
      {selectedApp && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedApp(null)}
        >
          <div 
            className="bg-[#101827] border border-border-color rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-border-color">
              <div>
                <h3 className="text-xl font-heading font-bold text-primary-text">
                  {selectedApp.full_name}
                </h3>
                <p className="text-xs text-secondary-text mt-0.5">
                  Applied on {new Date(selectedApp.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="text-muted-text hover:text-white p-2 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#151F30] border border-border-color">
                <div>
                  <span className="text-xs text-secondary-text block">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="text-primary-cyan hover:underline break-all font-medium">
                    {selectedApp.email}
                  </a>
                </div>

                <div>
                  <span className="text-xs text-secondary-text block">Phone / WhatsApp</span>
                  <a 
                    href={`https://wa.me/${getCleanPhone(selectedApp.phone)}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-functional-success hover:underline font-medium"
                  >
                    {selectedApp.phone}
                  </a>
                </div>

                <div>
                  <span className="text-xs text-secondary-text block">College</span>
                  <p className="text-primary-text font-medium">{selectedApp.college_name || 'ANU'}</p>
                </div>

                <div>
                  <span className="text-xs text-secondary-text block">Roll Number</span>
                  <p className="text-primary-text font-medium">{selectedApp.roll_number || 'N/A'}</p>
                </div>

                <div>
                  <span className="text-xs text-secondary-text block">Department</span>
                  <p className="text-primary-text font-medium">{selectedApp.department}</p>
                </div>

                <div>
                  <span className="text-xs text-secondary-text block">Year of Study</span>
                  <p className="text-primary-text font-medium">{selectedApp.year_of_study}</p>
                </div>
              </div>

              {/* Area of Interest */}
              <div>
                <span className="text-xs text-secondary-text block mb-1">Primary Area of Interest</span>
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30">
                  {selectedApp.primary_interest}
                </span>
              </div>

              {/* Statement / Motivation */}
              {selectedApp.why_join && (
                <div className="space-y-1">
                  <span className="text-xs text-secondary-text block">Why they want to join:</span>
                  <div className="p-3.5 rounded-xl bg-secondary-bg/50 border border-border-color text-primary-text text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedApp.why_join}
                  </div>
                </div>
              )}

              {/* LinkedIn / Portfolio */}
              {selectedApp.linkedin_url && (
                <div>
                  <span className="text-xs text-secondary-text block mb-1">LinkedIn / Portfolio</span>
                  <a
                    href={selectedApp.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary-cyan hover:underline"
                  >
                    {selectedApp.linkedin_url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border-color flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                  disabled={selectedApp.status === 'approved'}
                  className="gap-1.5 text-xs"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                  disabled={selectedApp.status === 'rejected'}
                  className="gap-1.5 text-xs border-functional-error/40 text-functional-error hover:bg-functional-error/10"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedApp(null)}
                className="text-secondary-text"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
