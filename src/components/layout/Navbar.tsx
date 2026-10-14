'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="fixed w-full z-50 top-0 border-b border-border-color bg-main-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary-cyan flex items-center justify-center font-bold text-main-bg">E</div>
              <span className="text-xl font-bold font-heading text-primary-text tracking-tight drop-shadow-[0_0_8px_rgba(0,217,255,0.3)]">ANU E-Cell</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-heading font-medium text-secondary-text hover:text-primary-cyan hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.5)] transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex">
            <Link 
              href="/auth/login"
              className="px-4 py-2 text-sm font-bold text-main-bg bg-primary-cyan hover:bg-[#33e0ff] rounded-lg shadow-[0_0_10px_rgba(0,217,255,0.4)] hover:shadow-[0_0_15px_rgba(0,217,255,0.6)] transition-all"
            >
              Sign In
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-secondary-text hover:text-primary-cyan hover:bg-elevated-surface/60 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050711]/95 backdrop-blur-2xl border-b border-primary-cyan/20 shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
          <div className="px-4 pt-3 pb-6 space-y-1 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg font-heading text-base font-medium text-secondary-text hover:text-primary-cyan hover:bg-primary-cyan/10 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <span>{link.name}</span>
                <span className="text-primary-cyan/50 text-xs font-mono">→</span>
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border-color/60">
              <Link
                href="/auth/login"
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg font-heading text-sm font-bold text-main-bg bg-primary-cyan hover:bg-[#33e0ff] shadow-[0_0_15px_rgba(0,217,255,0.4)] transition-all"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
