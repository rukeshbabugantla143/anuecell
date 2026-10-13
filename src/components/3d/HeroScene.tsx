'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Clear any existing canvas (React StrictMode might double-mount)
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }
    containerRef.current.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0x00d9ff, 2)
    mainLight.position.set(10, 10, 5)
    scene.add(mainLight)

    const secondaryLight = new THREE.DirectionalLight(0x397bff, 1)
    secondaryLight.position.set(-10, -10, -5)
    scene.add(secondaryLight)

    // 3. Create Globe Group
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Core Solid Sphere
    const sphereGeo = new THREE.SphereGeometry(2.5, 32, 32)
    const sphereMat = new THREE.MeshStandardMaterial({ 
      color: 0x050711, 
      metalness: 0.9, 
      roughness: 0.2 
    })
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
    globeGroup.add(sphereMesh)

    // Cyber Wireframe Sphere
    const wireframeGeo = new THREE.SphereGeometry(2.51, 24, 24)
    const wireframeMat = new THREE.MeshBasicMaterial({ 
      color: 0x00d9ff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    })
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat)
    globeGroup.add(wireframeMesh)

    // Orbit Rings
    const ring1Geo = new THREE.TorusGeometry(3.5, 0.02, 16, 100)
    const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x00d9ff, emissive: 0x00d9ff, emissiveIntensity: 0.8 })
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat)
    ring1.rotation.set(Math.PI / 3, 0, 0)
    globeGroup.add(ring1)

    const ring2Geo = new THREE.TorusGeometry(4.5, 0.015, 16, 100)
    const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x397bff, emissive: 0x397bff, emissiveIntensity: 0.6 })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.set(-Math.PI / 4, Math.PI / 6, 0)
    globeGroup.add(ring2)

    const ring3Geo = new THREE.TorusGeometry(5.5, 0.01, 16, 100)
    const ring3Mat = new THREE.MeshStandardMaterial({ color: 0xf044ff, emissive: 0xf044ff, emissiveIntensity: 0.4 })
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat)
    ring3.rotation.set(Math.PI / 2, -Math.PI / 4, Math.PI / 8)
    globeGroup.add(ring3)

    // 4. Stars (Particles)
    const particlesCount = 2000
    const posArray = new Float32Array(particlesCount * 3)
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 40
    }
    const particlesGeo = new THREE.BufferGeometry()
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x397bff,
      transparent: true,
      opacity: 0.6
    })
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particlesMesh)

    // 5. Mouse Interaction for Globe Rotation
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    const windowHalfX = window.innerWidth / 2
    const windowHalfY = window.innerHeight / 2

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.001
      mouseY = (event.clientY - windowHalfY) * 0.001
    }
    document.addEventListener('mousemove', onDocumentMouseMove)

    // 6. Animation Loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    const render = () => {
      const elapsedTime = clock.getElapsedTime()
      
      // Auto rotate globe
      globeGroup.rotation.y = elapsedTime * 0.15
      globeGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2

      // Slowly rotate stars
      particlesMesh.rotation.y = elapsedTime * 0.02

      // Mouse parallax effect
      targetX = mouseX * 2
      targetY = mouseY * 2
      
      globeGroup.rotation.y += 0.05 * (targetX - globeGroup.rotation.y)
      globeGroup.rotation.x += 0.05 * (targetY - globeGroup.rotation.x)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    // 7. Handle Resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize)
      document.removeEventListener('mousemove', onDocumentMouseMove)
      cancelAnimationFrame(animationFrameId)
      
      // Dispose materials & geometries to prevent memory leaks
      sphereGeo.dispose()
      sphereMat.dispose()
      wireframeGeo.dispose()
      wireframeMat.dispose()
      ring1Geo.dispose()
      ring1Mat.dispose()
      ring2Geo.dispose()
      ring2Mat.dispose()
      ring3Geo.dispose()
      ring3Mat.dispose()
      particlesGeo.dispose()
      particlesMat.dispose()
      
      renderer.dispose()
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 bg-main-bg overflow-hidden w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#397BFF]/15 via-main-bg/90 to-main-bg z-0 pointer-events-none"></div>
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  )
}
