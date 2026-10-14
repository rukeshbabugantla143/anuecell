import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, Mail, Search, CheckCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import DeleteMessageButton from './DeleteMessageButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardMessagesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary-bg/50 p-6 rounded-2xl border border-border-color shadow-sm backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">Contact Messages</h1>
          <p className="text-sm text-secondary-text">Read and respond to messages sent through the public contact form.</p>
        </div>
      </div>

      <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
        <div className="p-5 border-b border-border-color bg-[#0a0f17] flex justify-between items-center">
           <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input 
              type="text" 
              placeholder="Search messages by name or email..." 
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f1522] border-b border-border-color">
              <tr>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Sender</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Message Preview</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Date</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-main-bg">
              {!messages || messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-text">
                      <div className="h-20 w-20 rounded-full bg-secondary-bg flex items-center justify-center mb-4 shadow-inner">
                        <MessageSquare className="h-10 w-10 text-secondary-text opacity-50" />
                      </div>
                      <p className="text-xl font-heading font-bold text-primary-text mb-2">No messages received</p>
                      <p className="text-sm text-secondary-text max-w-sm">When users contact you through the website, their messages will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-[#151F30]/60 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="font-bold text-primary-text">{msg.name}</span>
                      <span className="block text-xs text-secondary-text mt-0.5">{msg.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-secondary-text truncate max-w-xs">{msg.message}</p>
                    </td>
                    <td className="px-6 py-5 text-secondary-text">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="info" className="text-primary-cyan border-primary-cyan">{msg.status}</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <DeleteMessageButton id={msg.id} senderName={msg.name} />
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
