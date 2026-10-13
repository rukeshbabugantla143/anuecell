'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('first_name')?.toString() || ''
    const lastName = formData.get('last_name')?.toString() || ''
    const name = `${firstName} ${lastName}`.trim()
    const email = formData.get('email')?.toString() || ''
    const subject = formData.get('subject')?.toString()?.trim() || 'General Inquiry'
    const message = formData.get('message')?.toString() || ''

    try {
      const { error: submitError } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }])
        
      if (submitError) throw submitError
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to send message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh]">
      <div className="text-center mb-16">
        <h1 className="hero-heading text-4xl sm:text-5xl text-primary-text mb-4">
          GET IN <span className="metallic-text">TOUCH</span>
        </h1>
        <p className="text-lg text-secondary-text max-w-2xl mx-auto">
          Have a question about our events or want to partner with us? Reach out!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-text mb-6">Contact Information</h2>
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-elevated-surface border border-border-color flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary-cyan" />
              </div>
              <div>
                <h4 className="text-primary-text font-medium mb-1">Our Location</h4>
                <p className="text-secondary-text text-sm">Acharya Nagarjuna University<br />Nagarjuna Nagar, Guntur<br />Andhra Pradesh 522510</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-elevated-surface border border-border-color flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary-cyan" />
              </div>
              <div>
                <h4 className="text-primary-text font-medium mb-1">Email Us</h4>
                <p className="text-secondary-text text-sm">ecell@anu.edu.in</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-lg bg-elevated-surface border border-border-color flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary-cyan" />
              </div>
              <div>
                <h4 className="text-primary-text font-medium mb-1">Call Us</h4>
                <p className="text-secondary-text text-sm">+91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>
        </div>

        <Card hoverEffect>
          <CardContent className="p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-text mb-6">Send a Message</h2>
            
            {success ? (
              <div className="p-6 bg-functional-success/10 border border-functional-success/20 rounded-xl text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-functional-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-functional-success" />
                </div>
                <h3 className="text-xl font-bold text-primary-text">Message Sent!</h3>
                <p className="text-secondary-text text-sm">Thank you for reaching out. We will get back to you soon.</p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-functional-error/10 border border-functional-error/30 text-functional-error text-sm rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-text">First Name</label>
                    <input name="first_name" required type="text" className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary-text">Last Name</label>
                    <input name="last_name" required type="text" className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-text">Email Address *</label>
                  <input name="email" required type="email" className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-text">Subject (Optional)</label>
                  <input name="subject" type="text" className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-colors" placeholder="e.g. Sponsorship, Event Inquiry, Collaboration" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-text">Message *</label>
                  <textarea name="message" required rows={4} className="w-full bg-main-bg border border-border-color rounded-lg px-4 py-2.5 text-primary-text focus:outline-none focus:border-primary-cyan focus:ring-1 focus:ring-primary-cyan transition-colors" placeholder="How can we help you?"></textarea>
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-2">
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
