'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

import DotGrid from '@/components/ui/DotGrid'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSubmitted(true)
      setLoading(false)
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

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-cyan/15 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[550px] h-[400px] bg-neon-blue/15 rounded-full blur-[150px] z-0" />

      {/* Top Header */}
      <header className="relative z-20 w-full px-6 py-6 sm:px-12 flex items-center justify-between">
        <Link 
          href="/auth/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary-text hover:text-primary-cyan transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-primary-cyan" />
          <span>Back to Login</span>
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

      {/* Center Card */}
      <main className="relative z-10 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="relative rounded-2xl bg-card-bg/80 backdrop-blur-2xl border border-border-color shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_35px_rgba(0,217,255,0.08)] p-8 sm:p-10 overflow-hidden">
            <div className="absolute top-0 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-primary-cyan to-transparent shadow-[0_0_12px_rgba(0,217,255,0.8)]" />

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center mb-4 p-3 rounded-2xl bg-gradient-to-b from-primary-cyan/15 to-neon-blue/10 border border-primary-cyan/30 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                <div className="relative h-12 w-12 flex items-center justify-center">
                  <Image
                    src="/E-CELL.png"
                    alt="ANU E-Cell Logo"
                    width={48}
                    height={48}
                    className="object-contain drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]"
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-primary-text">
                Password <span className="text-primary-cyan drop-shadow-[0_0_12px_rgba(0,217,255,0.4)]">Recovery</span>
              </h1>
              <p className="mt-2 text-sm text-secondary-text">
                Enter your administrative email to receive password reset instructions
              </p>
            </div>

            {submitted ? (
              <div className="space-y-6 text-center">
                <div className="rounded-xl bg-functional-success/10 border border-functional-success/30 p-5 text-start">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-functional-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-semibold text-white">Reset Link Dispatched</h4>
                      <p className="text-xs text-secondary-text mt-1 leading-relaxed">
                        If an account exists with <span className="text-primary-cyan font-mono">{email}</span>, you will receive an email shortly with a secure password reset link.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-card-bg border border-border-color hover:border-primary-cyan py-3 px-4 text-sm font-heading font-semibold text-primary-text hover:text-primary-cyan transition-all"
                >
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
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

                {error && (
                  <div className="rounded-xl bg-functional-error/10 border border-functional-error/30 p-3.5 text-sm text-functional-error flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-cyan to-neon-blue px-6 py-3.5 text-sm font-bold font-heading text-main-bg shadow-[0_0_20px_rgba(0,217,255,0.35)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-20 py-6 text-center text-xs text-muted-text">
        &copy; {new Date().getFullYear()} ANU E-Cell NEC. All rights reserved.
      </footer>
    </div>
  )
}
