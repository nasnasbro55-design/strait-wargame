import { motion } from 'framer-motion'

const STATIC_INTEL = [
  { label: 'PLA POSTURE', value: 'OFFENSIVE', type: 'threat' },
  { label: 'FLEET POSITION', value: 'BLOCKADE LINE', type: 'normal' },
  { label: 'MISSILE READINESS', value: 'HIGH', type: 'threat' },
  { label: 'CYBER OPS', value: '??? UNCONFIRMED', type: 'unknown' },
  { label: 'SUBMARINE TRACK', value: '??? LOST', type: 'unknown' },
  { label: 'DOMESTIC SUPPORT', value: '84%', type: 'normal' },
]

const NEXT_MOVE_SIGNALS = [
  { label: 'ESCALATE BLOCKADE', value: 'LIKELY', type: 'threat' },
  { label: 'KINETIC ACTION', value: 'MONITORING', type: 'warn' },
  { label: 'NEGOTIATE', value: 'UNLIKELY', type: 'unknown' },
]

const typeColor = {
  threat: '#8b2020',
  unknown: '#444',
  warn: '#c8a84b',
  normal: '#d4dde8',
  allied: '#4a90d9',
}

export default function RedCellPanel({ lastRedCell, turnHistory }) {
  const confidence = lastRedCell ? 73 : 0

  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      background: '#0d1117',
      border: '0.5px solid #1e2a3a',
      borderRadius: 4,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      overflowY: 'auto',
      fontFamily: 'IBM Plex Mono',
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: '#4a90d9', borderBottom: '0.5px solid #1e2a3a', paddingBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
        RED CELL — PRC AI
        <span style={{ background: '#8b2020', color: '#d4dde8', fontSize: 8, padding: '1px 5px', borderRadius: 2 }}>HOSTILE</span>
      </div>

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1 }}>LAST MOVE</div>
      <div style={{
        fontSize: 9,
        color: '#d4dde8',
        lineHeight: 1.6,
        borderLeft: '2px solid #8b2020',
        padding: '6px 8px',
        background: '#0f0a0a',
        borderRadius: '0 3px 3px 0',
      }}>
        {lastRedCell
          ? lastRedCell.narrative
          : 'Awaiting first move — China is watching.'}
      </div>

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1 }}>INTEL ASSESSMENT</div>
      {STATIC_INTEL.map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #111820' }}>
          <span style={{ fontSize: 8, color: '#666' }}>{row.label}</span>
          <span style={{ fontSize: 8, color: typeColor[row.type], fontStyle: row.type === 'unknown' ? 'italic' : 'normal' }}>{row.value}</span>
        </div>
      ))}

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1, marginTop: 4 }}>AI CONFIDENCE</div>
      <div style={{ height: 3, background: '#1e2a3a', borderRadius: 2 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: '#8b2020', borderRadius: 2 }}
        />
      </div>
      <div style={{ fontSize: 8, color: '#8b2020', marginTop: 2 }}>
        {confidence}% — {confidence > 60 ? 'HIGH CONFIDENCE' : 'CALIBRATING...'}
      </div>

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1, marginTop: 4 }}>NEXT MOVE SIGNALS</div>
      {NEXT_MOVE_SIGNALS.map(row => (
        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #111820' }}>
          <span style={{ fontSize: 8, color: '#666' }}>{row.label}</span>
          <span style={{ fontSize: 8, color: typeColor[row.type], fontStyle: row.type === 'unknown' ? 'italic' : 'normal' }}>{row.value}</span>
        </div>
      ))}

      {turnHistory.length > 0 && (
        <>
          <div style={{ fontSize: 8, color: '#444', letterSpacing: 1, marginTop: 4 }}>TURN HISTORY</div>
          {turnHistory.map((t, i) => (
            <div key={i} style={{ fontSize: 8, color: '#555', borderLeft: '1px solid #1e2a3a', paddingLeft: 6, lineHeight: 1.5 }}>
              <span style={{ color: '#4a90d9' }}>T{t.turn_number}</span> {t.player_decision?.label}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
