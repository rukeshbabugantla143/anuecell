import type { Metadata } from 'next'
import { constructMetadata } from '@/lib/seo'

export const metadata: Metadata = constructMetadata({
  title: "Join ANU E-Cell | Student Membership Application",
  description:
    "Apply to join ANU E-Cell NEC. Become part of a passionate cohort of student innovators, gain startup mentorship, event access, and leadership experience.",
  canonicalPath: "/join",
})

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
