'use client'

import React, { useEffect, useRef } from 'react'

export function Global3DEnvironment() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`)
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050711]">
      
      {/* Soft Horizon Glow */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[400px] bg-[#00D9FF] opacity-[0.05] blur-[120px] rounded-full" />
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[200px] bg-[#397BFF] opacity-[0.05] blur-[100px] rounded-full" />
      
      {/* BASE GRID (Dim) */}
      <div className="absolute inset-0 flex justify-center perspective-container">
        <div className="grid-floor opacity-30" />
      </div>

      {/* GLOW GRID (Bright, masked by mouse) */}
      <div 
        className="absolute inset-0 flex justify-center perspective-container z-10"
        style={{
          maskImage: 'radial-gradient(500px circle at var(--mouse-x, -100%) var(--mouse-y, -100%), black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(500px circle at var(--mouse-x, -100%) var(--mouse-y, -100%), black 0%, transparent 100%)',
        }}
      >
        {/* Bright cyan grid lines */}
        <div className="grid-floor glow-grid" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .perspective-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .grid-floor {
          position: absolute;
          width: 200vw;
          height: 200vh;
          left: 50%;
          top: 55%;
          transform: 
            translate(-50%, -50%) 
            perspective(1000px) 
            rotateX(60deg);
          transform-origin: center center;

          /* Base Grid Colors */
          background-image: 
            linear-gradient(to right, rgba(0, 217, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 217, 255, 0.3) 1px, transparent 1px);
          background-size: 80px 80px;

          animation: grid-scroll 10s linear infinite;

          /* Fade out edges slightly to look seamless, but mostly visible */
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%);
        }

        /* The glowing layer uses solid vibrant colors */
        .glow-grid {
          background-image: 
            linear-gradient(to right, rgba(0, 217, 255, 1) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 217, 255, 1) 2px, transparent 2px);
          /* Add a drop shadow filter for extra glow */
          filter: drop-shadow(0 0 10px rgba(0, 217, 255, 0.8));
        }

        @keyframes grid-scroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .grid-floor { animation: none !important; }
        }
      `}} />
    </div>
  )
}
