import { motion } from 'framer-motion'

const ESC_LEVELS = [
  { label: 'WAR', min: 80, color: '#ff2020', glow: '#ff202088' },
  { label: 'CRITICAL', min: 65, color: '#cc1a1a', glow: '#cc1a1a66' },
  { label: 'HIGH', min: 45, color: '#c8a84b', glow: '#c8a84b88' },
  { label: 'ELEVATED', min: 25, color: '#2a3a4a', glow: null },
  { label: 'GUARDED', min: 10, color: '#1e2a3a', glow: null },
  { label: 'LOW', min: 0, color: '#141e2a', glow: null },
]

const INTL_REACTIONS = [
  { country: 'JAPAN SDF', status: 'ACTIVATED', color: '#c8a84b' },
  { country: 'EU', status: 'CONDEMNED', color: '#d4dde8' },
  { country: 'UN SEC COUNCIL', status: 'DEADLOCKED', color: '#444' },
  { country: 'AUSTRALIA', status: 'ALLIED', color: '#4a90d9' },
  { country: 'SOUTH KOREA', status: 'WATCHING', color: '#c8a84b' },
  { country: 'INDIA', status: 'NEUTRAL', color: '#444' },
  { country: 'NATO', status: 'MONITORING', color: '#d4dde8' },
]

function getCurrentLevel(escalation) {
  for (const lvl of ESC_LEVELS) {
    if (escalation >= lvl.min) return lvl
  }
  return ESC_LEVELS[ESC_LEVELS.length - 1]
}

export default function AdjudicatorBar({ lastAdjudicator, escalationLevel, currentTurn }) {
  const current = getCurrentLevel(escalationLevel)

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr 220px',
      gap: 6,
      flexShrink: 0,
      fontFamily: 'IBM Plex Mono',
    }}>

      <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 4, padding: '10px 12px' }}>
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#4a90d9', marginBottom: 8 }}>ESCALATION LADDER</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {ESC_LEVELS.map(lvl => {
            const isActive = lvl.label === current.label
            return (
              <div key={lvl.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isActive ? '#c8a84b18' : 'transparent',
                border: isActive ? '0.5px solid #c8a84b44' : '0.5px solid transparent',
                borderRadius: 3,
                padding: isActive ? '3px 6px' : '0 6px',
              }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: lvl.color,
                  boxShadow: isActive && lvl.glow ? `0 0 6px ${lvl.glow}` : lvl.glow ? `0 0 4px ${lvl.glow}` : 'none',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 9,
                  color: isActive ? current.color : lvl.color,
                  letterSpacing: 1,
                  fontWeight: isActive ? 500 : 400,
                }}>
                  {isActive ? '> ' : ''}{lvl.label}{isActive ? ` — T${currentTurn}` : ''}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '0.5px solid #1e2a3a' }}>
          <div style={{ fontSize: 8, color: '#444', letterSpacing: 1, marginBottom: 4 }}>PHASE CLOCK</div>
          <div style={{ fontSize: 20, color: '#c8a84b', letterSpacing: 4 }}>
            {String(Math.floor((10 - currentTurn) * 7)).padStart(2, '0')}:00
          </div>
          <div style={{ fontSize: 7, color: '#444', letterSpacing: 1, marginTop: 2 }}>TURNS REMAINING</div>
        </div>
      </div>

      <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 4, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#4a90d9' }}>ADJUDICATOR — STRATEGIC ASSESSMENT</div>
        <div style={{
          fontSize: 10,
          color: '#d4dde8',
          lineHeight: 1.8,
          borderLeft: '2px solid #c8a84b',
          padding: '8px 12px',
          background: '#0d1117',
          borderRadius: '0 3px 3px 0',
          fontFamily: 'Inter, sans-serif',
          flex: 1,
        }}>
          {lastAdjudicator
            ? lastAdjudicator.narrative_summary
            : 'Awaiting first command decision. The strait is tense but stable. Every move you make will be adjudicated in real time.'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { key: 'CONFLICT PROB', val: lastAdjudicator ? `${Math.round(lastAdjudicator.conflict_probability * 100)}%` : '--', color: '#8b2020' },
            { key: 'ESCALATION', val: lastAdjudicator ? `${lastAdjudicator.escalation_level}/100` : '--', color: '#c8a84b' },
            { key: 'TW CASUALTIES', val: lastAdjudicator ? lastAdjudicator.taiwan_casualties : '--', color: '#8b2020' },
            { key: 'INTL REACTION', val: lastAdjudicator ? lastAdjudicator.escalation_label : '--', color: '#4a90d9' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 8, color: '#555', letterSpacing: 0.5 }}>{item.key}</span>
              <motion.span
                key={item.val}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ fontSize: 14, fontWeight: 500, color: item.color }}
              >
                {item.val}
              </motion.span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0d1117', border: '0.5px solid #1e2a3a', borderRadius: 4, padding: '10px 12px' }}>
        <div style={{ fontSize: 8, letterSpacing: 2, color: '#4a90d9', marginBottom: 8 }}>INTL REACTION</div>
        {INTL_REACTIONS.map(r => (
          <div key={r.country} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #111820' }}>
            <span style={{ fontSize: 8, color: '#888' }}>{r.country}</span>
            <span style={{ fontSize: 8, color: r.color, fontStyle: r.color === '#444' ? 'italic' : 'normal' }}>{r.status}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
