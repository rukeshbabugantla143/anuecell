'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'

import DotGrid from '@/components/ui/DotGrid'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setIsSuccess(true)
      // Instant direct navigation ensures cookies are cleanly recognized by SSR
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-main-bg text-primary-text selection:bg-primary-cyan/30 selection:text-white overflow-hidden">
      {/* Footer-style Interactive DotGrid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
        <DotGrid
          dotSize={6}
          gap={24}
          baseColor="#1f2937"
          activeColor="#00d9ff"
          proximity={150}
          shockRadius={200}
          shockStrength={4}
        />
      </div>

      {/* Ambient background glowing orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-cyan/15 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[550px] h-[400px] bg-neon-blue/15 rounded-full blur-[150px] z-0" />

      {/* Top Bar / Navigation */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-12 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary-text hover:text-primary-cyan transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-primary-cyan" />
          <span>Back to Website</span>
        </Link>

        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-cyan to-neon-blue p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.35)]">
            <span className="font-heading font-black text-main-bg text-lg">E</span>
          </div>
          <span className="hidden sm:inline-block font-heading font-bold text-lg text-primary-text tracking-tight drop-shadow-[0_0_8px_rgba(0,217,255,0.25)]">
            ANU E-Cell
          </span>
        </Link>
      </header>

      {/* Center Login Form Card */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card Wrapper with Neon Top Highlight */}
          <div className="relative rounded-2xl bg-card-bg/80 backdrop-blur-2xl border border-border-color shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,217,255,0.08)] p-8 sm:p-10 overflow-hidden">
            {/* Top Cyan Accent Beam */}
            <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-primary-cyan to-transparent shadow-[0_0_12px_rgba(0,217,255,0.8)]" />

            {/* Header / Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4 p-3 rounded-2xl bg-gradient-to-b from-primary-cyan/15 to-neon-blue/10 border border-primary-cyan/30 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <Image
                    src="/E-CELL.png"
                    alt="ANU E-Cell Logo"
                    width={48}
                    height={48}
                    className="object-contain drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]"
                    priority
                  />
                </div>
              </div>

              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-cyan" />
                  </span>
                  Portal Authentication
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-primary-text">
                Welcome <span className="text-primary-cyan drop-shadow-[0_0_12px_rgba(0,217,255,0.4)]">Back</span>
              </h1>
              <p className="mt-2 text-sm text-secondary-text">
                Sign in to manage the ANU E-Cell NEC Platform
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-secondary-text" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-text">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border-color bg-secondary-bg/90 pl-10 pr-4 py-3 text-sm text-primary-text placeholder-muted-text/70 focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/20 focus:outline-none transition-all duration-200"
                    placeholder="admin@anuecell.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-secondary-text" htmlFor="password">
                    Password
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs text-primary-cyan hover:underline transition-all hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-text">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border-color bg-secondary-bg/90 pl-10 pr-11 py-3 text-sm text-primary-text placeholder-muted-text/70 focus:border-primary-cyan focus:ring-2 focus:ring-primary-cyan/20 focus:outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-text hover:text-primary-text transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-xl bg-functional-error/10 border border-functional-error/30 p-3.5 text-sm text-functional-error flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || isSuccess}
                className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-cyan to-neon-blue px-6 py-3.5 text-sm font-bold font-heading text-main-bg shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:brightness-110 active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait transition-all duration-300"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-main-bg animate-pulse" />
                    <span>Access Granted! Redirecting...</span>
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper / Demo Hint */}
            <div className="mt-8 pt-6 border-t border-border-color/70 text-center">
              <div className="inline-flex items-center gap-2 text-xs text-muted-text">
                <ShieldCheck className="h-4 w-4 text-functional-success" />
                <span>Encrypted & Authorized Access Only</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-6 text-center text-xs text-muted-text">
        &copy; {new Date().getFullYear()} ANU E-Cell NEC. All rights reserved.
      </footer>
    </div>
  )
}
