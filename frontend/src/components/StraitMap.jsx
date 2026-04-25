import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StraitMap({ turnHistory, escalationLevel, lastRedCell }) {
  const canvasRef = useRef(null)

  return (
    <div style={{
      flex: 1,
      background: '#060810',
      border: '0.5px solid #1e2a3a',
      borderRadius: 4,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        padding: '7px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '0.5px solid #1e2a3a',
        flexShrink: 0,
        fontFamily: 'IBM Plex Mono',
      }}>
        <span style={{ fontSize: 9, letterSpacing: 2, color: '#4a90d9' }}>TAIWAN STRAIT — OPERATIONAL THEATER</span>
        <span style={{ fontSize: 9, color: '#c8a84b', letterSpacing: 1 }}>
          ESC LEVEL: {escalationLevel}/100
        </span>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <svg
          viewBox="0 0 480 300"
          style={{ width: '100%', height: '100%', display: 'block' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="oceanDepth" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#071020"/>
              <stop offset="100%" stopColor="#040810"/>
            </radialGradient>
            <radialGradient id="fogGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b2020" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#8b2020" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4a90d9" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#4a90d9" stopOpacity="0"/>
            </radialGradient>
          </defs>

          <rect width="480" height="300" fill="url(#oceanDepth)"/>

          {[60,120,180,240].map(y => (
            <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#1e2a3a" strokeWidth="0.5"/>
          ))}
          {[80,160,240,320,400].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="#1e2a3a" strokeWidth="0.5"/>
          ))}

          <rect x="0" y="0" width="140" height="300" fill="#0d160d"/>
          <text x="70" y="145" fontSize="8" fill="#1a2a1a" textAnchor="middle" letterSpacing="3" fontFamily="monospace">FUJIAN</text>
          <text x="70" y="158" fontSize="7" fill="#1a2a1a" textAnchor="middle" letterSpacing="2" fontFamily="monospace">PROVINCE</text>

          <ellipse cx="248" cy="150" rx="24" ry="68" fill="#111f11"/>
          <text x="248" y="144" fontSize="7" fill="#2a4a2a" textAnchor="middle" letterSpacing="1" fontFamily="monospace">TAIWAN</text>
          <text x="248" y="155" fontSize="6" fill="#2a4a2a" textAnchor="middle" fontFamily="monospace">ROC</text>

          <line x1="215" y1="0" x2="215" y2="300" stroke="#c8a84b" strokeWidth="0.8" strokeDasharray="5,4" opacity="0.35"/>
          <text x="218" y="12" fontSize="7" fill="#c8a84b" fontFamily="monospace" opacity="0.6">MEDIAN LINE</text>

          <circle cx="140" cy="90" r="45" fill="url(#fogGrad)"/>
          <circle cx="140" cy="90" r="70" fill="url(#fogGrad)" opacity="0.5"/>
          <circle cx="140" cy="200" r="40" fill="url(#fogGrad)"/>

          <circle cx="168" cy="80" r="3.5" fill="#8b2020"/>
          <text x="176" y="84" fontSize="7" fill="#8b2020" fontFamily="monospace">PLAN SURFACE</text>
          <circle cx="152" cy="135" r="3.5" fill="#8b2020"/>
          <text x="160" y="139" fontSize="7" fill="#8b2020" fontFamily="monospace">PLAN SURFACE</text>
          <circle cx="162" cy="185" r="3.5" fill="#8b2020"/>
          <text x="170" y="189" fontSize="7" fill="#8b2020" fontFamily="monospace">PLAN SURFACE</text>

          <rect x="108" y="54" width="18" height="14" rx="2" fill="#110808" stroke="#8b202055" strokeWidth="0.5"/>
          <text x="117" y="63" fontSize="8" fill="#8b2020" textAnchor="middle" fontFamily="monospace">?</text>
          <rect x="100" y="108" width="18" height="14" rx="2" fill="#110808" stroke="#8b202055" strokeWidth="0.5"/>
          <text x="109" y="117" fontSize="8" fill="#8b2020" textAnchor="middle" fontFamily="monospace">?</text>
          <rect x="105" y="228" width="18" height="14" rx="2" fill="#110808" stroke="#8b202055" strokeWidth="0.5"/>
          <text x="114" y="237" fontSize="8" fill="#8b2020" textAnchor="middle" fontFamily="monospace">?</text>

          <circle cx="350" cy="100" r="4" fill="#4a90d9"/>
          <text x="358" y="96" fontSize="7" fill="#4a90d9" fontFamily="monospace">CSG-5</text>
          <circle cx="370" cy="170" r="4" fill="#4a90d9"/>
          <text x="378" y="166" fontSize="7" fill="#4a90d9" fontFamily="monospace">DDG-51</text>
          <circle cx="345" cy="240" r="3" fill="#4a90d9"/>
          <text x="353" y="236" fontSize="7" fill="#4a90d9" fontFamily="monospace">SSN</text>

          <circle cx="350" cy="100" r="25" fill="none" stroke="#4a90d9" strokeWidth="0.5" opacity="0.2"/>
          <circle cx="350" cy="100" r="50" fill="none" stroke="#4a90d9" strokeWidth="0.5" opacity="0.1"/>

          {turnHistory.length > 0 && (
            <>
              <path d="M 168 80 Q 240 30 350 100" fill="none" stroke="#8b2020" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.7"/>
              <path d="M 152 135 Q 240 120 370 170" fill="none" stroke="#8b2020" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.7"/>
            </>
          )}

          <rect x="140" y="276" width="200" height="18" rx="2" fill="#0a0c10" opacity="0.9"/>
          <circle cx="153" cy="285" r="3" fill="#8b2020"/>
          <text x="160" y="288" fontSize="7" fill="#8b2020" fontFamily="monospace">PLA CONFIRMED</text>
          <rect x="208" y="281" width="6" height="6" rx="1" fill="#8b202044" stroke="#8b2020" strokeWidth="0.5"/>
          <text x="218" y="288" fontSize="7" fill="#8b2020" fontFamily="monospace">UNKNOWN</text>
          <circle cx="262" cy="285" r="3" fill="#4a90d9"/>
          <text x="269" y="288" fontSize="7" fill="#4a90d9" fontFamily="monospace">US NAVY</text>
        </svg>

        <div style={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 8,
          color: '#1e2a3a',
          letterSpacing: 2,
          whiteSpace: 'nowrap',
          fontFamily: 'IBM Plex Mono',
        }}>
          THREE.JS 3D TERRAIN UPGRADE — LAYER 3
        </div>
      </div>
    </div>
  )
}
