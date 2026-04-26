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

function TaiwanPolygon() {
  const points = "248,60 262,75 270,100 272,130 268,160 260,190 248,210 235,200 224,175 220,145 222,115 230,85 240,68"
  return (
    <motion.polygon
      points={points}
      fill="none"
      stroke="#4a90d9"
      strokeWidth="1"
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 0.6, pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    />
  )
}

function FujianPolygon() {
  const points = "0,40 40,35 80,45 110,30 130,50 140,80 135,120 140,160 135,200 130,240 120,260 100,270 60,265 20,255 0,240"
  return (
    <motion.polygon
      points={points}
      fill="none"
      stroke="#8b2020"
      strokeWidth="1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 2, delay: 0.8 }}
    />
  )
}

function GlobeCanvas() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame
    let angle = 0

    const draw = () => {
      ctx.clearRect(0, 0, 300, 300)
      const cx = 150, cy = 150, r = 110

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = '#1e2a3a'
      ctx.lineWidth = 0.5
      ctx.stroke()

      for (let lat = -80; lat <= 80; lat += 20) {
        const y = cy + r * Math.sin(lat * Math.PI / 180)
        const rLat = r * Math.cos(lat * Math.PI / 180)
        ctx.beginPath()
        ctx.ellipse(cx, y, rLat, rLat * 0.15, 0, 0, Math.PI * 2)
        ctx.strokeStyle = '#1e2a3a'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      for (let lon = 0; lon < 360; lon += 20) {
        const a = (lon + angle) * Math.PI / 180
        const x1 = cx + r * Math.sin(a)
        const x2 = cx + r * Math.sin(a + Math.PI)
        ctx.beginPath()
        ctx.moveTo(x1, cy - r)
        ctx.bezierCurveTo(x1 * 1.0, cy, x1 * 1.0, cy, x1, cy + r)
        ctx.strokeStyle = '#1e2a3a'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      const taiwanAngle = (120 + angle) * Math.PI / 180
      const taiwanX = cx + r * 0.7 * Math.cos(taiwanAngle) * Math.cos(25 * Math.PI / 180)
      const taiwanY = cy - r * 0.5 * Math.sin(25 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(taiwanX, taiwanY, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#4a90d9'
      ctx.fill()
      ctx.shadowBlur = 8
      ctx.shadowColor = '#4a90d9'
      ctx.fill()
      ctx.shadowBlur = 0

      const chinaAngle = (115 + angle) * Math.PI / 180
      const chinaX = cx + r * 0.5 * Math.cos(chinaAngle) * Math.cos(28 * Math.PI / 180)
      const chinaY = cy - r * 0.55 * Math.sin(28 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(chinaX, chinaY, 7, 0, Math.PI * 2)
      ctx.fillStyle = '#8b2020'
      ctx.fill()
      ctx.shadowBlur = 10
      ctx.shadowColor = '#8b2020'
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, r)
      grad.addColorStop(0, 'rgba(74, 144, 217, 0.05)')
      grad.addColorStop(1, 'rgba(4, 8, 16, 0.3)')
      ctx.fillStyle = grad
      ctx.fill()

      angle += 0.15
      frame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      width={300}
      height={300}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
      style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)' }}
    />
  )
}

function ParticleField() {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
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
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(74, 144, 217, ${0.06 * (1 - d / 100)})`
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 10%',
        fontFamily: 'IBM Plex Mono, monospace',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      <ParticleField />

      <motion.div
        style={{ position: 'absolute', left: '8%', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300">
          <FujianPolygon />
          <TaiwanPolygon />
          <motion.line
            x1="140" y1="135" x2="220" y2="135"
            stroke="#c8a84b" strokeWidth="0.8" strokeDasharray="4,3"
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 1.5, duration: 1 }}
          />
          <motion.text x="152" y="128" fontSize="8" fill="#c8a84b" fontFamily="monospace" opacity="0"
            animate={{ opacity: 0.6 }} style={{ transition: 'opacity 1s 1.8s' }}>
            MEDIAN LINE
          </motion.text>
          <motion.circle cx="248" cy="135" r="3" fill="#4a90d9"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }} />
          <motion.circle cx="70" cy="135" r="5" fill="#8b2020"
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }} />
          <motion.text x="55" y="105" fontSize="7" fill="#8b2020" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.3 }}>
            CHINA
          </motion.text>
          <motion.text x="233" y="105" fontSize="7" fill="#4a90d9" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.5 }}>
            TAIWAN
          </motion.text>
        </svg>
      </motion.div>

      <GlobeCanvas />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 8 }}
        >
          <span style={{ fontSize: 10, letterSpacing: 4, color: '#8b2020' }}>CLASSIFICATION: TOP SECRET // NOFORN</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 style={{
            fontSize: 88,
            fontWeight: 700,
            color: '#d4dde8',
            letterSpacing: 8,
            lineHeight: 0.9,
            margin: '0 0 8px 0',
            fontFamily: 'Barlow Condensed, sans-serif',
          }}>
            STRAIT
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ marginBottom: 32 }}
        >
          <span style={{ fontSize: 11, letterSpacing: 4, color: '#4a90d9' }}>
            TAIWAN STRAIT CRISIS WARGAME SIMULATOR
          </span>
        </motion.div>

        <div style={{ marginBottom: 32, minHeight: 140 }}>
          {displayed.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 11,
                color: i === displayed.length - 1 && !done ? '#d4dde8' : i === TYPING_LINES.length - 1 ? '#c8a84b' : '#4a5a6a',
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
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleEnter}
              whileHover={{ backgroundColor: '#c8a84b22', borderColor: '#c8a84b' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px 32px',
                background: 'transparent',
                border: '0.5px solid #4a90d9',
                borderRadius: 3,
                color: '#4a90d9',
                fontSize: 11,
                letterSpacing: 4,
                fontFamily: 'IBM Plex Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              INITIATE SIMULATION
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 24,
          left: '10%',
          fontSize: 9,
          color: '#1e2a3a',
          letterSpacing: 2,
          fontFamily: 'IBM Plex Mono',
        }}
      >
        SCSP NATIONAL SECURITY HACKATHON 2026 — WARGAMING TRACK
      </motion.div>
    </motion.div>
  )
}
