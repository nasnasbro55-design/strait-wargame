import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

function Ocean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[24, 16]} />
      <meshStandardMaterial color="#050d1a" roughness={1} />
    </mesh>
  )
}

function Grid() {
  const lines = useMemo(() => {
    const l = []
    for (let x = -10; x <= 10; x += 2.5) {
      l.push([new THREE.Vector3(x, 0.01, -8), new THREE.Vector3(x, 0.01, 8)])
    }
    for (let z = -8; z <= 8; z += 2.5) {
      l.push([new THREE.Vector3(-10, 0.01, z), new THREE.Vector3(10, 0.01, z)])
    }
    return l
  }, [])
  return (
    <>
      {lines.map((pts, i) => (
        <line key={i} geometry={new THREE.BufferGeometry().setFromPoints(pts)}>
          <lineBasicMaterial color="#1a2a3a" opacity={0.5} transparent />
        </line>
      ))}
    </>
  )
}

function China() {
  return (
    <group position={[-7.5, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[9, 16]} />
        <meshStandardMaterial color="#0c1a0c" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.05, 0]}>
        <planeGeometry args={[3, 16]} />
        <meshStandardMaterial color="#0e1e0e" roughness={1} />
      </mesh>
      <Text position={[-1, 0.1, -1]} rotation={[-Math.PI/2,0,0]} fontSize={0.7} color="#1e3a1e" anchorX="center" anchorY="middle" letterSpacing={0.2}>CHINA</Text>
      <Text position={[-1, 0.1, 0.8]} rotation={[-Math.PI/2,0,0]} fontSize={0.28} color="#162616" anchorX="center" anchorY="middle" letterSpacing={0.1}>FUJIAN PROVINCE</Text>
    </group>
  )
}

function Taiwan() {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -1.3)
    s.bezierCurveTo(0.4, -1.0, 0.55, -0.4, 0.5, 0.2)
    s.bezierCurveTo(0.45, 0.7, 0.2, 1.1, 0, 1.3)
    s.bezierCurveTo(-0.2, 1.1, -0.4, 0.7, -0.38, 0.2)
    s.bezierCurveTo(-0.38, -0.4, -0.2, -1.0, 0, -1.3)
    return s
  }, [])

  return (
    <group position={[0.8, 0, 0.2]}>
      <mesh rotation={[-Math.PI/2, 0, 0.15]}>
        <extrudeGeometry args={[shape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 }]} />
        <meshStandardMaterial color="#1e3a1e" roughness={0.6} emissive="#0a1a0a" emissiveIntensity={0.3} />
      </mesh>
      <Text position={[0, 0.55, -0.2]} rotation={[-Math.PI/2,0,0]} fontSize={0.32} color="#4a8a4a" anchorX="center" anchorY="middle" letterSpacing={0.1}>TAIWAN</Text>
    </group>
  )
}

function MedianLine() {
  const pts = []
  for (let i = 0; i <= 20; i++) pts.push(new THREE.Vector3(-0.5, 0.05, -7.5 + i * 0.75))
  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  return (
    <group>
      <line geometry={geo}>
        <lineBasicMaterial color="#c8a84b" opacity={0.6} transparent />
      </line>
      <Text position={[-0.5, 0.08, -5]} rotation={[-Math.PI/2,0,0]} fontSize={0.2} color="#c8a84b" anchorX="center" fillOpacity={0.7}>MEDIAN LINE</Text>
    </group>
  )
}

function USUnit({ position, label }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8 + position[0]) * 0.05 + 0.25
  })
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#4a90d9" emissive="#4a90d9" emissiveIntensity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.28, 0.33, 48]} />
        <meshBasicMaterial color="#4a90d9" opacity={0.35} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.55, 0.58, 48]} />
        <meshBasicMaterial color="#4a90d9" opacity={0.15} transparent side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0.3, 0.3, 0]} rotation={[-Math.PI/2,0,0]} fontSize={0.22} color="#4a90d9" anchorX="left">{label}</Text>
    </group>
  )
}

function PLAUnit({ position, label, confirmed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.6 + position[2]) * 0.04 + 0.2
  })
  if (!confirmed) {
    return (
      <group position={position}>
        <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.22]} />
          <meshStandardMaterial color="#8b2020" opacity={0.55} transparent wireframe />
        </mesh>
        <Text position={[0.25, 0.3, 0]} rotation={[-Math.PI/2,0,0]} fontSize={0.18} color="#8b202088" anchorX="left">{label} ?</Text>
      </group>
    )
  }
  return (
    <group position={position}>
      <mesh ref={ref} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#8b2020" emissive="#8b2020" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0.25, 0.25, 0]} rotation={[-Math.PI/2,0,0]} fontSize={0.18} color="#8b2020" anchorX="left">{label}</Text>
    </group>
  )
}

function FogOfWar() {
  const ref = useRef()
  const count = 300
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 7 - 4.5
      pos[i * 3 + 1] = Math.random() * 0.6 + 0.1
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14
    }
    return pos
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.opacity = 0.07 + Math.sin(clock.getElapsedTime() * 0.3) * 0.03
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#8b2020" size={0.08} opacity={0.07} transparent sizeAttenuation />
    </points>
  )
}

function MissileArc({ active }) {
  const ref = useRef()
  const pts = useMemo(() => {
    const p = []
    for (let i = 0; i <= 40; i++) {
      const t = i / 40
      p.push(new THREE.Vector3(-1.5 + t * 5.5, Math.sin(t * Math.PI) * 2, -0.5 + t * 1.5))
    }
    return p
  }, [])
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.material.opacity = active ? 0.5 + Math.sin(clock.getElapsedTime() * 4) * 0.25 : 0
  })
  return (
    <line ref={ref} geometry={geo}>
      <lineBasicMaterial color="#ff2020" opacity={0} transparent />
    </line>
  )
}

function RegionLabel({ position, text, color, size }) {
  return (
    <Text position={position} rotation={[-Math.PI/2,0,0]} fontSize={size} color={color} anchorX="center" fillOpacity={0.35} letterSpacing={0.15}>
      {text}
    </Text>
  )
}

function Scene({ turnHistory, escalationLevel }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(1, 7, 9)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 8, 5]} intensity={1.0} color="#5a9ae9" />
      <pointLight position={[-5, 5, -3]} intensity={0.6} color="#9b3030" />
      <directionalLight position={[2, 10, 4]} intensity={0.5} color="#ffffff" />

      <Ocean />
      <Grid />
      <China />
      <Taiwan />
      <MedianLine />
      <FogOfWar />

      <RegionLabel position={[4.5, 0.05, 1]} text="SOUTH CHINA SEA" color="#4a90d9" size={0.35} />
      <RegionLabel position={[-0.2, 0.05, 3.5]} text="TAIWAN STRAIT" color="#4a90d9" size={0.25} />
      <RegionLabel position={[4.5, 0.05, -5]} text="PHILIPPINE SEA" color="#4a90d9" size={0.25} />

      <USUnit position={[3.8, 0, -2]} label="CSG-5" />
      <USUnit position={[4.5, 0, 0.8]} label="DDG-51" />
      <USUnit position={[3.2, 0, 3.2]} label="SSN" />

      <PLAUnit position={[-0.3, 0, -2.5]} label="PLAN SURFACE" confirmed={true} />
      <PLAUnit position={[-0.6, 0, 0.5]} label="PLAN SURFACE" confirmed={true} />
      <PLAUnit position={[-0.4, 0, 3]} label="PLAN SURFACE" confirmed={true} />
      <PLAUnit position={[-3, 0, -2]} label="PLAN UNIT" confirmed={false} />
      <PLAUnit position={[-3.2, 0, 1]} label="PLAN UNIT" confirmed={false} />
      <PLAUnit position={[-2.8, 0, 3.5]} label="PLAN UNIT" confirmed={false} />

      <MissileArc active={turnHistory.length > 0 && escalationLevel > 40} />

      <OrbitControls enablePan={false} minPolarAngle={Math.PI/5} maxPolarAngle={Math.PI/2.3} minDistance={5} maxDistance={16} target={[0, 0, 0]} />
    </>
  )
}

export default function StraitMap({ turnHistory, escalationLevel }) {
  return (
    <div style={{ flex:1, background:'#060810', border:'0.5px solid #1e2a3a', borderRadius:4, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      <div style={{ padding:'7px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'0.5px solid #1e2a3a', flexShrink:0, fontFamily:'IBM Plex Mono', zIndex:10 }}>
        <span style={{ fontSize:9, letterSpacing:2, color:'#4a90d9' }}>TAIWAN STRAIT — OPERATIONAL THEATER</span>
        <span style={{ fontSize:9, color:'#c8a84b', letterSpacing:1 }}>ESC LEVEL: {escalationLevel}/100</span>
      </div>
      <div style={{ flex:1, position:'relative' }}>
        <Canvas gl={{ antialias:true, alpha:false }} style={{ background:'#040810' }}>
          <Scene turnHistory={turnHistory} escalationLevel={escalationLevel} />
        </Canvas>
        <div style={{ position:'absolute', bottom:8, left:12, display:'flex', gap:16, fontFamily:'IBM Plex Mono', fontSize:8, zIndex:10, background:'#0a0c10cc', padding:'4px 10px', borderRadius:3 }}>
          <span style={{ color:'#4a90d9' }}>● US NAVY</span>
          <span style={{ color:'#8b2020' }}>● PLA CONFIRMED</span>
          <span style={{ color:'#8b202066' }}>□ PLA UNKNOWN</span>
          <span style={{ color:'#c8a84b' }}>-- MEDIAN LINE</span>
        </div>
        <div style={{ position:'absolute', top:8, right:12, fontFamily:'IBM Plex Mono', fontSize:7, color:'#2a3a4a', zIndex:10 }}>
          DRAG TO ROTATE / SCROLL TO ZOOM
        </div>
      </div>
    </div>
  )
}
