import { useEffect, useState } from 'react'

const W = 800
const H = 500

const FUJIAN_PATH = "M 0,0 L 0,500 L 145,500 L 150,478 L 144,455 L 149,432 L 143,410 L 148,388 L 145,362 L 152,338 L 147,315 L 155,292 L 149,268 L 157,245 L 152,222 L 159,198 L 154,175 L 161,152 L 156,128 L 163,105 L 158,82 L 165,58 L 160,35 L 167,12 L 165,0 Z"
const TAIWAN_PATH = "M 310,108 C 322,108 338,122 345,138 C 352,156 353,178 351,200 C 348,224 341,248 333,266 C 324,284 313,296 304,300 C 295,296 284,284 276,266 C 268,248 262,224 260,200 C 258,178 260,156 267,138 C 274,122 298,108 310,108 Z"

export default function StraitMap({ turnHistory, escalationLevel }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 50)
    return () => clearInterval(interval)
  }, [])

  const fogOpacity = 0.15 + Math.sin(tick * 0.04) * 0.05
  const radarPulse1 = (tick % 80) / 80
  const radarPulse2 = ((tick + 40) % 80) / 80
  const showMissile = turnHistory.length > 0 && escalationLevel > 40
  const mp = showMissile ? (tick % 100) / 100 : 0
  const mx = 155 + mp * (490 - 155)
  const my = 220 + Math.sin(mp * Math.PI) * -100
  const u1y = 165 + Math.sin(tick * 0.05) * 5
  const u2y = 265 + Math.sin(tick * 0.05 + 1) * 5
  const u3y = 355 + Math.sin(tick * 0.05 + 2) * 5
  const p1y = 200 + Math.sin(tick * 0.04) * 4
  const p2y = 300 + Math.sin(tick * 0.04 + 1) * 4
  const p3y = 390 + Math.sin(tick * 0.04 + 2) * 4

  return (
    <div style={{ flex:1, background:'#040810', border:'0.5px solid #1e2a3a', borderRadius:4, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'7px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'0.5px solid #1e2a3a', flexShrink:0, fontFamily:'IBM Plex Mono' }}>
        <span style={{ fontSize:9, letterSpacing:2, color:'#4a90d9' }}>TAIWAN STRAIT — OPERATIONAL THEATER</span>
        <span style={{ fontSize:9, color: escalationLevel >= 65 ? '#8b2020' : '#c8a84b', letterSpacing:1 }}>ESC LEVEL: {escalationLevel}/100</span>
      </div>
      <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'100%', display:'block' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#040d1a"/>
              <stop offset="25%" stopColor="#061525"/>
              <stop offset="60%" stopColor="#081d35"/>
              <stop offset="100%" stopColor="#061228"/>
            </linearGradient>
            <radialGradient id="fogGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b2020" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8b2020" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="usGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#4a90d9" stopOpacity="0"/>
            </radialGradient>
            <filter id="gb" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="gr" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <rect width={W} height={H} fill="url(#oceanGrad)"/>
          {[...Array(11)].map((_, i) => <line key={`h${i}`} x1="0" y1={i*50} x2={W} y2={i*50} stroke="#132030" strokeWidth="0.5"/>)}
          {[...Array(17)].map((_, i) => <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2={H} stroke="#132030" strokeWidth="0.5"/>)}

          <path d={FUJIAN_PATH} fill="#0c180c"/>
          <path d={FUJIAN_PATH} fill="none" stroke="#1e3a1e" strokeWidth="1.5"/>
          <path d={FUJIAN_PATH} fill="none" stroke="#2a5a2a" strokeWidth="0.5" opacity="0.5"/>

          <ellipse cx="75" cy="250" rx="90" ry="160" fill="url(#fogGrad)" opacity={fogOpacity * 2.5}/>
          <ellipse cx="100" cy="380" rx="70" ry="80" fill="url(#fogGrad)" opacity={fogOpacity * 1.5}/>
          <ellipse cx="80" cy="120" rx="60" ry="90" fill="url(#fogGrad)" opacity={fogOpacity}/>

          <path d={TAIWAN_PATH} fill="#112211"/>
          <path d={TAIWAN_PATH} fill="none" stroke="#2a5a2a" strokeWidth="1.5"/>
          <path d={TAIWAN_PATH} fill="none" stroke="#4a8a4a" strokeWidth="0.5" opacity="0.6"/>

          <text x="72" y="252" fontSize="13" fill="#1e3a1e" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="5" opacity="0.7">CHINA</text>
          <text x="72" y="270" fontSize="8" fill="#152815" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="2" opacity="0.6">FUJIAN PROVINCE</text>
          <text x="305" y="208" fontSize="9" fill="#3a7a3a" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="1" opacity="0.9">TAIWAN</text>
          <text x="230" y="60" fontSize="8" fill="#0d2a40" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="2" opacity="0.8">TAIWAN STRAIT</text>
          <text x="580" y="420" fontSize="10" fill="#0a1e38" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="3" opacity="0.7">SOUTH CHINA SEA</text>
          <text x="650" y="80" fontSize="9" fill="#0a1e38" textAnchor="middle" fontFamily="IBM Plex Mono" letterSpacing="2" opacity="0.6">PHILIPPINE SEA</text>

          <line x1="245" y1="0" x2="245" y2={H} stroke="#c8a84b" strokeWidth="1" strokeDasharray="7,5" opacity="0.5"/>
          <text x="248" y="18" fontSize="8" fill="#c8a84b" fontFamily="IBM Plex Mono" opacity="0.65" letterSpacing="1">MEDIAN LINE</text>

          <circle cx="490" cy={u1y} r={20 + radarPulse1 * 50} fill="none" stroke="#4a90d9" strokeWidth="0.8" opacity={0.3 * (1 - radarPulse1)}/>
          <circle cx="490" cy={u1y} r={20 + radarPulse2 * 50} fill="none" stroke="#4a90d9" strokeWidth="0.8" opacity={0.3 * (1 - radarPulse2)}/>

          <circle cx="178" cy={p1y} r="7" fill="#8b2020" filter="url(#gr)"/>
          <text x="190" y={p1y+4} fontSize="8" fill="#cc3030" fontFamily="IBM Plex Mono">PLAN SURFACE</text>
          <circle cx="170" cy={p2y} r="7" fill="#8b2020" filter="url(#gr)"/>
          <text x="182" y={p2y+4} fontSize="8" fill="#cc3030" fontFamily="IBM Plex Mono">PLAN SURFACE</text>
          <circle cx="175" cy={p3y} r="6" fill="#8b2020" filter="url(#gr)"/>
          <text x="186" y={p3y+4} fontSize="8" fill="#cc3030" fontFamily="IBM Plex Mono">PLAN SURFACE</text>

          <rect x="110" y="138" width="18" height="18" rx="2" fill="#0f0808" stroke="#8b202077" strokeWidth="1"/>
          <text x="119" y="151" fontSize="11" fill="#8b2020" textAnchor="middle" fontFamily="IBM Plex Mono" opacity="0.8">?</text>
          <rect x="102" y="325" width="18" height="18" rx="2" fill="#0f0808" stroke="#8b202077" strokeWidth="1"/>
          <text x="111" y="338" fontSize="11" fill="#8b2020" textAnchor="middle" fontFamily="IBM Plex Mono" opacity="0.8">?</text>
          <rect x="118" y="428" width="18" height="18" rx="2" fill="#0f0808" stroke="#8b202077" strokeWidth="1"/>
          <text x="127" y="441" fontSize="11" fill="#8b2020" textAnchor="middle" fontFamily="IBM Plex Mono" opacity="0.8">?</text>

          <circle cx="490" cy={u1y} r="9" fill="#4a90d9" filter="url(#gb)"/>
          <text x="504" y={u1y+4} fontSize="9" fill="#6ab0f9" fontFamily="IBM Plex Mono">CSG-5</text>
          <circle cx="520" cy={u2y} r="8" fill="#4a90d9" filter="url(#gb)"/>
          <text x="533" y={u2y+4} fontSize="9" fill="#6ab0f9" fontFamily="IBM Plex Mono">DDG-51</text>
          <circle cx="475" cy={u3y} r="7" fill="#4a90d9" filter="url(#gb)"/>
          <text x="488" y={u3y+4} fontSize="9" fill="#6ab0f9" fontFamily="IBM Plex Mono">SSN</text>

          {showMissile && (
            <>
              <path d={`M 178 ${p1y} Q 330 80 490 ${u1y}`} fill="none" stroke="#8b2020" strokeWidth="1" strokeDasharray="5,3" opacity="0.45"/>
              <circle cx={mx} cy={my} r="4" fill="#ff3030" filter="url(#gr)" opacity="0.95"/>
            </>
          )}

          <g transform={`translate(8, ${H-75})`}>
            <circle cx="8" cy="8" r="6" fill="#4a90d9" filter="url(#gb)"/>
            <text x="18" y="12" fontSize="8" fill="#6ab0f9" fontFamily="IBM Plex Mono">US NAVY</text>
            <circle cx="8" cy="26" r="6" fill="#8b2020" filter="url(#gr)"/>
            <text x="18" y="30" fontSize="8" fill="#cc3030" fontFamily="IBM Plex Mono">PLA CONFIRMED</text>
            <rect x="2" y="42" width="12" height="12" rx="1" fill="#0f0808" stroke="#8b202077" strokeWidth="1"/>
            <text x="8" y="52" fontSize="9" fill="#8b2020" textAnchor="middle" fontFamily="IBM Plex Mono">?</text>
            <text x="18" y="52" fontSize="8" fill="#8b202099" fontFamily="IBM Plex Mono">PLA UNKNOWN</text>
            <line x1="130" y1="26" x2="155" y2="26" stroke="#c8a84b" strokeWidth="1" strokeDasharray="4,2" opacity="0.7"/>
            <text x="159" y="30" fontSize="8" fill="#c8a84b" fontFamily="IBM Plex Mono">MEDIAN LINE</text>
          </g>
        </svg>
      </div>
    </div>
  )
}
