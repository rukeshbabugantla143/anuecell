'use client'

import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, useTexture, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { Lightbulb, Rocket, Users, Network } from 'lucide-react'

function HologramLogo() {
  const logoTexture = useTexture('/E-CELL.png')

  return (
    <group>
      {/* Front facing logo */}
      <mesh position={[0, 0, 0.01]} renderOrder={1}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent={true}
          opacity={1}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      {/* Back facing logo (flipped so it isn't backwards when the globe spins) */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]} renderOrder={1}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent={true}
          opacity={1}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function HologramSphere() {
  const sphereRef = useRef<THREE.Group>(null)
  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    if (sphereRef.current) {
      sphereRef.current.rotation.y = time.current * 0.15
    }
  })

  return (
    <group>
      <group ref={sphereRef}>
        {/* Center E-CELL Image Logo (Rotates with the sphere!) */}
        <HologramLogo />

        {/* Core Glowing Sphere (Very transparent) */}
        <mesh>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Cyber Wireframe Sphere (Very faint, barely visible) */}
        <mesh>
          <sphereGeometry args={[1.85, 24, 24]} />
          <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.04} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* Orbital Rings */}
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[2.6, 0.008, 16, 100]} />
          <meshBasicMaterial color="#397BFF" transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[-Math.PI / 6, Math.PI / 4, 0]}>
          <torusGeometry args={[3.2, 0.008, 16, 100]} />
          <meshBasicMaterial color="#00D9FF" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 3, -Math.PI / 3, 0]}>
          <torusGeometry args={[3.8, 0.006, 16, 100]} />
          <meshBasicMaterial color="#F044FF" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default function InnovationSphere() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false)

  React.useEffect(() => {
    setIsTouchDevice(
      window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)
    )
  }, [])

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] relative cursor-grab active:cursor-grabbing">

      <Canvas 
        camera={{ position: [0, 0, 8.5], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: 'pan-y' }}
      >
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <HologramSphere />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={!isTouchDevice} autoRotate autoRotateSpeed={1.0} />
      </Canvas>

      {/* Floating HTML Glass Panels (Moved outside Canvas to prevent React 18 unmount errors) */}
      <div className="absolute top-10 left-0 lg:-left-4 pointer-events-none hidden sm:flex items-center gap-3 bg-[#050711]/70 backdrop-blur-md border border-primary-cyan/40 p-3 rounded-xl w-48 shadow-[0_0_15px_rgba(0,217,255,0.15)] z-20">
        <Lightbulb className="w-6 h-6 text-primary-cyan" />
        <div>
          <div className="text-white font-bold text-sm font-heading">Innovation</div>
          <div className="text-secondary-text text-[10px]">From Ideas to Solutions</div>
        </div>
      </div>

      <div className="absolute top-10 right-0 lg:-right-4 pointer-events-none hidden sm:flex items-center gap-3 bg-[#050711]/70 backdrop-blur-md border border-primary-cyan/40 p-3 rounded-xl w-48 shadow-[0_0_15px_rgba(0,217,255,0.15)] z-20">
        <Rocket className="w-6 h-6 text-primary-cyan" />
        <div>
          <div className="text-white font-bold text-sm font-heading">Startups</div>
          <div className="text-secondary-text text-[10px]">Build What Matters</div>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 lg:-left-4 pointer-events-none hidden sm:flex items-center gap-3 bg-[#050711]/70 backdrop-blur-md border border-primary-cyan/40 p-3 rounded-xl w-48 shadow-[0_0_15px_rgba(0,217,255,0.15)] z-20">
        <Users className="w-6 h-6 text-primary-cyan" />
        <div>
          <div className="text-white font-bold text-sm font-heading">Mentorship</div>
          <div className="text-secondary-text text-[10px]">Learn from Experience</div>
        </div>
      </div>

      <div className="absolute bottom-16 right-0 lg:-right-4 pointer-events-none hidden sm:flex items-center gap-3 bg-[#050711]/70 backdrop-blur-md border border-primary-cyan/40 p-3 rounded-xl w-48 shadow-[0_0_15px_rgba(0,217,255,0.15)] z-20">
        <Network className="w-6 h-6 text-primary-cyan" />
        <div>
          <div className="text-white font-bold text-sm font-heading">Community</div>
          <div className="text-secondary-text text-[10px]">Grow Together</div>
        </div>
      </div>

    </div>
  )
}
