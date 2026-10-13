import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: "Contact Us | Get in Touch & Partnerships",
  description:
    "Get in touch with ANU E-Cell NEC for startup incubation queries, industry partnerships, event sponsorships, or student mentorship support.",
  canonicalPath: "/contact",
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
