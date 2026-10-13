'use client'

import dynamic from 'next/dynamic'

const InnovationSphere = dynamic(() => import('./InnovationSphere'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] flex items-center justify-center border border-primary-cyan/20 rounded-full animate-pulse bg-elevated-surface" />
})

export default function InnovationSphereWrapper() {
  return <InnovationSphere />
}
