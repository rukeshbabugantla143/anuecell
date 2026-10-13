'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Image as ImageIcon,
  MessageSquare,
  Bell,
  Search,
  ChevronDown,
  UserCheck
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Applications', href: '/dashboard/applications', icon: UserCheck },
  { name: 'Gallery', href: '/dashboard/gallery', icon: ImageIcon },
  { name: 'Messages', href: '/dashboard/contact-messages', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex h-screen bg-[#050810] font-sans overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 flex transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-72 flex-col bg-[#0a0f17] border-r border-border-color p-4 pt-6 shadow-2xl">
          <button className="absolute right-4 top-4 text-muted-text hover:text-primary-cyan transition-colors" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 px-2 pb-8 border-b border-border-color mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-cyan to-blue-600 flex items-center justify-center font-heading font-black text-white shadow-[0_0_15px_rgba(0,217,255,0.4)]">
              E
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-tight">ANU E-Cell</span>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-cyan/10 text-primary-cyan shadow-[inset_4px_0_0_0_rgba(0,217,255,1)]' : 'text-secondary-text hover:bg-[#151F30] hover:text-white'}`}
                >
                  <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-cyan' : 'text-muted-text group-hover:text-primary-cyan'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="mt-auto pt-4 border-t border-border-color">
            <button onClick={handleLogout} className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-secondary-text hover:bg-functional-error/10 hover:text-functional-error transition-all">
              <LogOut className="mr-4 h-5 w-5 text-muted-text group-hover:text-functional-error" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-[#0a0f17] border-r border-border-color shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20">
        <div className="flex h-20 flex-shrink-0 items-center px-8 border-b border-border-color">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-cyan to-blue-600 flex items-center justify-center font-heading font-black text-white shadow-[0_0_15px_rgba(0,217,255,0.4)] mr-4">
            E
          </div>
          <span className="text-xl font-heading font-bold text-white tracking-tight">ANU E-Cell</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto pt-8 pb-6 custom-scrollbar">
          <p className="px-8 text-xs font-bold uppercase tracking-wider text-muted-text mb-4">Main Menu</p>
          <nav className="flex-1 space-y-1.5 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/dashboard')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary-cyan/10 text-primary-cyan shadow-[inset_4px_0_0_0_rgba(0,217,255,1)]' : 'text-secondary-text hover:bg-[#151F30] hover:text-white'}`}
                >
                  <item.icon className={`mr-4 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-primary-cyan drop-shadow-[0_0_8px_rgba(0,217,255,0.5)]' : 'text-muted-text group-hover:text-primary-cyan'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex flex-shrink-0 border-t border-border-color p-4 bg-[#0a0f17]">
          <button onClick={handleLogout} className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-secondary-text hover:bg-functional-error/10 hover:text-functional-error transition-all">
            <LogOut className="mr-4 h-5 w-5 text-muted-text group-hover:text-functional-error" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-72 relative">
        {/* Glow effect in background */}
        <div className="absolute top-0 left-0 w-full h-96 bg-primary-cyan/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

        {/* Top App Bar */}
        <div className="sticky top-0 z-10 flex h-20 flex-shrink-0 items-center justify-between border-b border-border-color bg-[#0a0f17]/80 backdrop-blur-md px-4 sm:px-8 shadow-sm">
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="p-2 text-muted-text hover:text-primary-cyan focus:outline-none focus:ring-2 focus:ring-primary-cyan rounded-lg mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-cyan to-blue-600 flex items-center justify-center font-heading font-black text-white shadow-[0_0_10px_rgba(0,217,255,0.4)]">
              E
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
              <input 
                type="text" 
                placeholder="Search everywhere..." 
                className="w-full bg-[#151F30] border border-border-color rounded-xl pl-10 pr-4 py-2 text-sm text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-all"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 text-muted-text hover:text-white transition-colors rounded-lg hover:bg-secondary-bg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-functional-error border-2 border-[#0a0f17]"></span>
            </button>
            <div className="h-8 w-px bg-border-color mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-secondary-bg p-1.5 pr-3 rounded-full transition-colors">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border border-border-color shadow-sm">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-semibold text-white leading-none">Admin</span>
                <span className="text-xs text-primary-cyan mt-1">Super User</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-text hidden md:block" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
