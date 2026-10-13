'use client'

import React, { useRef, Suspense, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  // Use reliable three.js example textures hosted on unpkg/github
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ])

  useFrame((state, delta) => {
    time.current += delta
    const elapsedTime = time.current
    // Earth rotates slowly
    if (earthRef.current) earthRef.current.rotation.y = (elapsedTime / 12) + (Math.PI / 1.5)
    if (cloudsRef.current) cloudsRef.current.rotation.y = (elapsedTime / 10) + (Math.PI / 1.5)
    if (ringRef.current) {
      ringRef.current.rotation.x = elapsedTime / 10
      ringRef.current.rotation.y = elapsedTime / 12
    }
  })

  // Initial tilt (Earth's axial tilt is ~23.5 degrees)
  const tilt = 23.5 * Math.PI / 180

  return (
    <group rotation={[tilt, 0, 0]}>
      {/* Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          shininess={10}
          emissive={new THREE.Color(0x001122)}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.42, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Atmospheric Cyan Glow */}
      <mesh>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshBasicMaterial
          color="#00D9FF"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cyber/Tech Orbital Rings */}
      <group ref={ringRef} rotation={[-tilt, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.0, 0.015, 64, 100]} />
          <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={0.8} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[3.5, 0.01, 64, 100]} />
          <meshStandardMaterial color="#397BFF" emissive="#397BFF" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function LoadingSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime()
      ref.current.rotation.x = clock.getElapsedTime() * 0.5
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.4, 32, 32]} />
      <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.3} />
    </mesh>
  )
}

// Error Boundary to catch WebGL crashes without breaking the whole site
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return (
      <div className="w-full h-full flex flex-col items-center justify-center border border-border-color rounded-2xl bg-secondary-bg">
        <span className="text-functional-error font-bold mb-2">WebGL Render Failed</span>
        <span className="text-sm text-secondary-text">Hardware acceleration is disabled or unsupported.</span>
      </div>
    )
    return this.props.children
  }
}

import { Grid } from '@react-three/drei'
import { RotateCcw, MousePointer2 } from 'lucide-react'

function FloatingBadge({
  className,
  title,
  imageSrc,
  colorClass,
  borderColorClass,
  popupClassName = "top-full mt-2 left-0"
}: {
  className: string,
  title: string,
  imageSrc: string,
  colorClass: string,
  borderColorClass: string,
  popupClassName?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className={`absolute z-40 ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-main-bg/80 backdrop-blur-md border ${borderColorClass} rounded-full text-[9px] sm:text-[10px] lg:text-xs ${colorClass} font-heading cursor-pointer drop-shadow-md transition-all hover:bg-main-bg hover:scale-105 whitespace-nowrap`}>
        {title}
      </div>

      {/* The Popup Image */}
      {isOpen && (
        <div className={`absolute ${popupClassName} p-1.5 bg-main-bg/90 backdrop-blur-xl border ${borderColorClass} rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] w-32 h-32 lg:w-40 lg:h-40 animate-in fade-in zoom-in duration-200 z-50`}>
          <img src={imageSrc} alt={title} className="w-full h-full object-cover rounded-lg" />
        </div>
      )}
    </div>
  )
}

export default function InteractiveGlobe() {
  const [controlsEnabled, setControlsEnabled] = useState(true)
  const controlsRef = useRef<any>(null)

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setControlsEnabled(false)}
      onMouseLeave={() => setControlsEnabled(true)}
    >
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} gl={{ antialias: true, alpha: true }} className="touch-none cursor-grab active:cursor-grabbing">
          <ambientLight intensity={0.5} color="#ffffff" />
          {/* Main Sunlight (Warm/White) */}
          <directionalLight position={[10, 5, 10]} intensity={2.5} color="#fffcf5" />
          {/* Cyan Rim Light */}
          <directionalLight position={[-10, -5, -10]} intensity={1.5} color="#00D9FF" />
          {/* Magenta Fill Light */}
          <pointLight position={[0, -5, 0]} intensity={1.0} color="#F044FF" />

          <Stars radius={100} depth={50} count={1500} factor={3} saturation={0} fade speed={0.5} />

          <Suspense fallback={<LoadingSphere />}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <Earth />
            </Float>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate={controlsEnabled}
            autoRotateSpeed={0.5}
            maxDistance={14}
            minDistance={5.5}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Canvas>
      </ErrorBoundary>

      {/* Floating Interactive UI Badges */}
      <FloatingBadge
        className="top-2 sm:top-8 lg:top-12 left-2 sm:left-4 lg:left-12"
        title="Student Innovation"
        imageSrc="/skill.jpg"
        colorClass="text-primary-cyan"
        borderColorClass="border-primary-cyan/40"
      />

      <FloatingBadge
        className="bottom-4 sm:bottom-20 lg:bottom-16 left-2 sm:left-4 lg:left-12"
        title="Startup Ecosystem"
        imageSrc="/Eureka team.jpg"
        colorClass="text-neon-magenta"
        borderColorClass="border-neon-magenta/40"
        popupClassName="bottom-full mb-2 left-0"
      />

      <FloatingBadge
        className="top-1/2 -translate-y-1/2 sm:translate-y-0 sm:top-24 right-2 sm:right-4 lg:right-12"
        title="Events & Workshops"
        imageSrc="/event.jpg"
        colorClass="text-innovation-green"
        borderColorClass="border-innovation-green/40"
        popupClassName="top-full mt-2 right-0"
      />

    </div>
  )
}
