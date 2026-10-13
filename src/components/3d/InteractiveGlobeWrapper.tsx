'use client'

import dynamic from 'next/dynamic'

const InteractiveGlobe = dynamic(() => import('./InteractiveGlobe'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center border border-primary-cyan/20 rounded-full animate-pulse bg-elevated-surface">
      <span className="text-primary-cyan font-heading text-sm font-medium tracking-widest uppercase">Initializing 3D Engine...</span>
    </div>
  )
})

export default function InteractiveGlobeWrapper() {
  return <InteractiveGlobe />
}
