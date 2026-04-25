import { motion } from 'framer-motion'

const ASSETS = [
  { label: 'USS REAGAN CSG', status: 'DEPLOYED', color: '#c8a84b' },
  { label: '7TH FLEET AIR WING', status: 'ALERT', color: '#c8a84b' },
  { label: 'SSN LOUISVILLE', status: 'PATROL', color: '#4a90d9' },
  { label: 'THAAD — GUAM', status: 'ACTIVE', color: '#4a90d9' },
  { label: 'JAPAN SDF', status: 'STANDBY', color: '#8b2020' },
]

const CAT_COLORS = {
  MILITARY: '#8b2020',
  DIPLOMATIC: '#4a90d9',
  ECONOMIC: '#c8a84b',
  CYBER: '#7b4ac8',
  DEESCALATION: '#2a8b4a',
  LOGISTICS: '#4a90d9',
}

export default function BlueForcePanel({ decisions, selectedDecision, onSelect, onConfirm, loading }) {
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
        BLUE FORCE — US CDR
        <span style={{ background: '#4a90d9', color: '#0a0c10', fontSize: 8, padding: '1px 5px', borderRadius: 2 }}>ACTIVE</span>
      </div>

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1 }}>ASSET STATUS</div>
      {ASSETS.map(a => (
        <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '0.5px solid #111820' }}>
          <span style={{ fontSize: 8, color: '#aab' }}>{a.label}</span>
          <span style={{ fontSize: 8, color: a.color }}>{a.status}</span>
        </div>
      ))}

      <div style={{ fontSize: 8, color: '#444', letterSpacing: 1, marginTop: 4 }}>SELECT ACTION</div>
      {decisions.map(d => {
        const isSelected = selectedDecision?.action === d.action
        return (
          <motion.div
            key={d.action}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(d)}
            style={{
              background: isSelected ? '#141a0a' : '#111620',
              border: `0.5px solid ${isSelected ? '#c8a84b' : '#1e2a3a'}`,
              borderRadius: 3,
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 8, color: isSelected ? '#c8a84b' : CAT_COLORS[d.category] || '#4a90d9', letterSpacing: 1, marginBottom: 2 }}>
              {isSelected ? '● ' : ''}{d.category}
            </div>
            <div style={{ fontSize: 8, color: '#d4dde8', lineHeight: 1.4 }}>{d.label}</div>
          </motion.div>
        )
      })}

      <motion.button
        whileHover={{ backgroundColor: '#c8a84b22' }}
        whileTap={{ scale: 0.97 }}
        onClick={onConfirm}
        disabled={!selectedDecision || loading}
        style={{
          marginTop: 4,
          padding: 8,
          background: 'transparent',
          border: `0.5px solid ${selectedDecision && !loading ? '#c8a84b' : '#1e2a3a'}`,
          borderRadius: 3,
          color: selectedDecision && !loading ? '#c8a84b' : '#333',
          fontSize: 9,
          letterSpacing: 2,
          fontFamily: 'IBM Plex Mono',
          cursor: selectedDecision && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'PROCESSING...' : '⚡ CONFIRM ACTION →'}
      </motion.button>
    </div>
  )
}
