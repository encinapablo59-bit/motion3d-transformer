import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Displaced Mesh Component
const DisplacedMesh = ({ imageUrl, displacementScale, meshDensity, wireframe, autoRotate }) => {
  const meshRef = useRef()
  const [texture, setTexture] = useState()

  // Load and process texture
  useMemo(() => {
    if (!imageUrl) return

    const loader = new THREE.TextureLoader()
    loader.load(imageUrl, (loadedTexture) => {
      loadedTexture.needsUpdate = true
      loadedTexture.wrapS = THREE.RepeatWrapping
      loadedTexture.wrapT = THREE.RepeatWrapping
      setTexture(loadedTexture)
    })
  }, [imageUrl])

  // Auto-rotation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate && !wireframe) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  // Create geometry
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(10, 10, meshDensity, meshDensity)
  }, [meshDensity])

  // Create material
  const material = useMemo(() => {
    if (!texture) return null

    return new THREE.MeshStandardMaterial({
      map: texture,
      displacementMap: texture,
      displacementScale: displacementScale,
      wireframe: wireframe,
      roughness: 0.4,
      metalness: 0.6,
      color: wireframe ? 0x9333ea : 0xffffff,
      emissive: wireframe ? 0x9333ea : 0x000000,
      emissiveIntensity: wireframe ? 0.2 : 0
    })
  }, [texture, displacementScale, wireframe])

  if (!texture || !material) {
    return (
      <mesh>
        <planeGeometry args={[10, 10, 32, 32]} />
        <meshStandardMaterial color="#1a1a1a" wireframe />
      </mesh>
    )
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    />
  )
}

// Lighting Component
const SceneLighting = () => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#9333ea" />
      <directionalLight position={[0, -10, 0]} intensity={0.3} color="#3b82f6" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />
    </>
  )
}

// Main Scene3D Component
const Scene3D = ({ imageUrl, displacementScale, meshDensity, autoRotate, wireframe, isProcessing }) => {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Lighting */}
        <SceneLighting />
        
        {/* Main displaced mesh */}
        <DisplacedMesh
          imageUrl={imageUrl}
          displacementScale={displacementScale}
          meshDensity={meshDensity}
          wireframe={wireframe}
          autoRotate={autoRotate}
        />
        
        {/* Environment particles */}
        <Particles />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
        
        {/* Fog for atmosphere */}
        <fog attach="fog" args={['#000000', 10, 30]} />
      </Canvas>
      
      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Processing neural synthesis...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Particles for atmosphere
const Particles = () => {
  const particlesRef = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = Math.random() * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#9333ea"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default Scene3D