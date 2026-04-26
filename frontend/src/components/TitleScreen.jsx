import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TYPING_LINES = [
  'INITIALIZING STRAIT CRISIS SIMULATION...',
  'LOADING TAIWAN STRAIT OPERATIONAL DATA...',
  'CONNECTING TO RED CELL AI ADVERSARY...',
  'ADJUDICATOR SYSTEMS ONLINE...',
  'CLASSIFICATION: TOP SECRET // NOFORN',
  'SIMULATION READY.',
]

function useTypingEffect(lines, speed = 38) {
  const [displayed, setDisplayed] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentLine >= lines.length) { setDone(true); return }
    if (currentChar <= lines[currentLine].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev]
          next[currentLine] = lines[currentLine].slice(0, currentChar)
          return next
        })
        setCurrentChar(c => c + 1)
      }, speed)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setCurrentLine(l => l + 1)
        setCurrentChar(0)
      }, 320)
      return () => clearTimeout(t)
    }
  }, [currentLine, currentChar, lines, speed])

  return { displayed, done }
}

function ParticleField() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let frame
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74, 144, 217, ${p.opacity})`
        ctx.fill()
      })

      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(74, 144, 217, ${0.06 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}

function HexGrid() {
  const size = 40
  const hexes = []
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 25; col++) {
      const x = col * size * 1.732 + (row % 2) * size * 0.866
      const y = row * size * 1.5
      hexes.push({ x, y, opacity: Math.random() * 0.06 + 0.01 })
    }
  }

  const hexPath = (x, y, s) => {
    const pts = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      pts.push(`${x + s * Math.cos(angle)},${y + s * Math.sin(angle)}`)
    }
    return pts.join(' ')
  }

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} opacity="0.4">
      {hexes.map((h, i) => (
        <polygon
          key={i}
          points={hexPath(h.x, h.y, size * 0.9)}
          fill="none"
          stroke="#1e2a3a"
          strokeWidth="0.5"
          opacity={h.opacity}
        />
      ))}
    </svg>
  )
}

export default function TitleScreen({ onEnter }) {
  const { displayed, done } = useTypingEffect(TYPING_LINES)
  const [showButton, setShowButton] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (done) setTimeout(() => setShowButton(true), 400)
  }, [done])

  const handleEnter = () => {
    setExiting(true)
    setTimeout(onEnter, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0c10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'IBM Plex Mono, monospace',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <HexGrid />
      <ParticleField />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, #0a0c10 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }}/>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700, padding: '0 40px' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 12 }}
        >
          <span style={{ fontSize: 10, letterSpacing: 5, color: '#8b2020' }}>
            CLASSIFICATION: TOP SECRET // NOFORN
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ position: 'relative', marginBottom: 8 }}
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            style={{
              position: 'absolute',
              inset: -20,
              background: 'radial-gradient(ellipse at center, #4a90d922 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <h1 style={{
            fontSize: 120,
            fontWeight: 700,
            color: '#d4dde8',
            letterSpacing: 16,
            lineHeight: 1,
            margin: 0,
            fontFamily: 'Barlow Condensed, sans-serif',
            textShadow: '0 0 40px rgba(74,144,217,0.3), 0 0 80px rgba(74,144,217,0.1)',
          }}>
            STRAIT
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, #4a90d9, #c8a84b, #4a90d9, transparent)',
            marginBottom: 12,
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ marginBottom: 40 }}
        >
          <span style={{ fontSize: 11, letterSpacing: 5, color: '#4a90d9' }}>
            TAIWAN STRAIT CRISIS WARGAME SIMULATOR
          </span>
        </motion.div>

        <div style={{ marginBottom: 40, minHeight: 140 }}>
          {displayed.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 11,
                color: i === TYPING_LINES.length - 1 && done ? '#c8a84b' : i === displayed.length - 1 && !done ? '#d4dde8' : '#4a5a6a',
                letterSpacing: 1,
                lineHeight: 2,
                fontFamily: 'IBM Plex Mono, monospace',
              }}
            >
              <span style={{ color: '#8b2020', marginRight: 8 }}>&gt;</span>
              {line}
              {i === displayed.length - 1 && !done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                  style={{ marginLeft: 2, color: '#d4dde8' }}
                >_</motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ backgroundColor: '#c8a84b22', borderColor: '#c8a84b', color: '#c8a84b' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '14px 48px',
                  background: 'transparent',
                  border: '0.5px solid #4a90d9',
                  borderRadius: 3,
                  color: '#4a90d9',
                  fontSize: 11,
                  letterSpacing: 5,
                  fontFamily: 'IBM Plex Mono, monospace',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                INITIATE SIMULATION
              </motion.button>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ fontSize: 8, color: '#1e2a3a', letterSpacing: 3 }}
              >
                SCSP NATIONAL SECURITY HACKATHON 2026
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
        border: '0.5px solid #1e2a3a',
      }}/>
    </motion.div>
  )
}
