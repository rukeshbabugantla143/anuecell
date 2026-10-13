'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  Rocket, 
  CheckCircle2, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Lightbulb, 
  Sparkles, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function JoinPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    roll_number: '',
    college_name: 'Acharya Nagarjuna University',
    department: 'Computer Science & Engineering (CSE)',
    year_of_study: '1st Year',
    primary_interest: 'Technical & Web Development',
    why_join: '',
    linkedin_url: ''
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    if (!formData.full_name || !formData.email || !formData.phone) {
      setErrorMessage('Please fill in all required fields.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('membership_applications')
        .insert([
          {
            full_name: formData.full_name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            roll_number: formData.roll_number.trim() || null,
            college_name: formData.college_name.trim() || 'Acharya Nagarjuna University',
            department: formData.department,
            year_of_study: formData.year_of_study,
            primary_interest: formData.primary_interest,
            why_join: formData.why_join.trim() || null,
            linkedin_url: formData.linkedin_url.trim() || null,
            status: 'pending'
          }
        ])

      if (error) throw error

      setSubmitted(true)
    } catch (err: any) {
      console.error('Membership submission error:', err)
      setErrorMessage(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 pt-20">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary-cyan/10 rounded-full blur-[160px] -z-10 pointer-events-none"></div>

      <div className="px-4 sm:px-8 lg:px-[6vw] max-w-4xl mx-auto relative z-10">
        
        {/* Back link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-secondary-text hover:text-primary-cyan transition-colors mb-6 group text-sm font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        {submitted ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-16 px-6 sm:px-12 bg-[#101827]/90 backdrop-blur-md border border-primary-cyan/30 rounded-3xl shadow-[0_0_40px_rgba(0,217,255,0.15)] animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-functional-success/20 border border-functional-success/40 flex items-center justify-center mx-auto mb-6 text-functional-success shadow-[0_0_20px_rgba(56,245,155,0.3)]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <Badge variant="success" className="mb-4 px-3 py-1 text-xs">
              Application Received
            </Badge>

            <h2 className="hero-heading text-3xl sm:text-4xl text-primary-text font-bold mb-4">
              Welcome to the Journey, {formData.full_name.split(' ')[0]}!
            </h2>

            <p className="text-secondary-text text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8">
              Your membership application for <span className="text-primary-cyan font-semibold">ANU E-Cell</span> has been submitted successfully. Our team will review your application and reach out to you via WhatsApp & Email regarding the next induction steps!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <Button variant="secondary" className="w-full sm:w-auto px-6">
                  Back to Homepage
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="primary" className="w-full sm:w-auto px-6 shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                  Explore Upcoming Events <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* APPLICATION FORM */
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <Badge variant="info" className="inline-flex border-primary-cyan/40 text-primary-cyan px-3 py-1 bg-primary-cyan/5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-primary-cyan" /> Membership Induction 2026-2027
              </Badge>
              <h1 className="hero-heading text-3xl sm:text-5xl text-primary-text font-bold">
                JOIN <span className="text-primary-cyan drop-shadow-[0_0_12px_rgba(0,217,255,0.4)]">ANU E-CELL</span>
              </h1>
              <p className="text-secondary-text text-sm sm:text-base leading-relaxed">
                Step into the entrepreneurship & innovation movement. Build real products, organize premier hackathons, and accelerate your leadership skills.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-functional-error/10 border border-functional-error/30 text-functional-error text-sm text-center">
                {errorMessage}
              </div>
            )}

            {/* Form Card */}
            <Card className="border-border-color shadow-2xl bg-[#101827]/90 backdrop-blur-md overflow-hidden">
              <form onSubmit={handleSubmit}>
                <CardContent className="p-6 sm:p-10 space-y-6">

                  {/* Section 1: Personal Details */}
                  <div>
                    <h3 className="text-base font-heading font-bold text-primary-text pb-2 border-b border-border-color mb-4 flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-cyan" /> 1. Personal & Contact Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. student@gmail.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Phone / WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 9876543210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Roll No / Student ID</label>
                        <input
                          type="text"
                          placeholder="e.g. Y22CSE0123"
                          value={formData.roll_number}
                          onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic Details */}
                  <div>
                    <h3 className="text-base font-heading font-bold text-primary-text pb-2 border-b border-border-color mb-4 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-neon-magenta" /> 2. Academic Background
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-primary-text">College / University Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.college_name}
                          onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Branch / Department *</label>
                        <select
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        >
                          <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                          <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                          <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                          <option value="Information Technology (IT)">Information Technology (IT)</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Master of Business Administration (MBA)">MBA / Management</option>
                          <option value="MCA / Computer Applications">MCA / Computer Applications</option>
                          <option value="Pharmacy / Biotechnology">Pharmacy / Biotechnology</option>
                          <option value="Sciences / Arts / Other">Sciences / Arts / Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">Year of Study *</label>
                        <select
                          value={formData.year_of_study}
                          onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Post Graduate (PG)">Post Graduate (PG)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Interests & Motivation */}
                  <div>
                    <h3 className="text-base font-heading font-bold text-primary-text pb-2 border-b border-border-color mb-4 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-functional-success" /> 3. Skills & Interests
                    </h3>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">
                          Primary Area of Interest in E-Cell *
                        </label>
                        <select
                          value={formData.primary_interest}
                          onChange={(e) => setFormData({ ...formData, primary_interest: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        >
                          <option value="Technical & Web Development">Technical & Web Development (Coding, Apps, Tech Projects)</option>
                          <option value="Event Management & Operations">Event Management & Logistics (Organizing Fests, Workshops)</option>
                          <option value="Design, Video & Content Media">Design & Creative Media (Graphics, Video Editing, Reels)</option>
                          <option value="Marketing, PR & Sponsorships">Marketing, PR & Corporate Sponsorships (Sponsors, Social Media)</option>
                          <option value="Startups, Incubation & Pitching">Startups & Entrepreneurship (Building Ideas, Pitching)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">
                          Why do you want to join ANU E-Cell? (Brief Motivation)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell us what excites you about entrepreneurship or what skills you want to contribute and learn..."
                          value={formData.why_join}
                          onChange={(e) => setFormData({ ...formData, why_join: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-primary-text">
                          LinkedIn or Portfolio / GitHub URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourname"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                          className="w-full bg-[#151F30] border border-border-color rounded-xl px-4 py-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-cyan"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-border-color flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-5 text-base font-bold shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:shadow-[0_0_35px_rgba(0,217,255,0.6)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Submitting Application...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5 mr-2" /> Submit Application
                        </>
                      )}
                    </Button>
                  </div>

                </CardContent>
              </form>
            </Card>
          </div>
        )}

      </div>
    </main>
  )
}
