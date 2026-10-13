import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FileText, Search } from 'lucide-react'

export default function DashboardPagesCMS() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-secondary-bg/50 p-6 rounded-2xl border border-border-color shadow-sm backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-text mb-1 tracking-tight">Pages & CMS</h1>
          <p className="text-sm text-secondary-text">Edit the textual content on the main pages of your website.</p>
        </div>
      </div>

      <Card className="border-border-color shadow-2xl overflow-hidden bg-main-bg">
        <div className="p-5 border-b border-border-color bg-[#0a0f17] flex justify-between items-center">
           <div className="relative w-full sm:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
            <input 
              type="text" 
              placeholder="Search pages..." 
              className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#0f1522] border-b border-border-color">
              <tr>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Page Name</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Route URL</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs">Last Updated</th>
                <th className="px-6 py-5 font-heading font-bold text-secondary-text uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color bg-main-bg">
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-text">
                    <div className="h-20 w-20 rounded-full bg-secondary-bg flex items-center justify-center mb-4 shadow-inner">
                      <FileText className="h-10 w-10 text-secondary-text opacity-50" />
                    </div>
                    <p className="text-xl font-heading font-bold text-primary-text mb-2">No pages configured yet</p>
                    <p className="text-sm text-secondary-text max-w-sm">CMS functionality will be available in the next database update.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
