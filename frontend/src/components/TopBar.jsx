export default function TopBar({ turn, status, escalationLevel }) {
  const getEscLabel = (level) => {
    if (level >= 80) return { label: 'WAR IMMINENT', color: '#ff2020' }
    if (level >= 65) return { label: 'CRITICAL', color: '#cc1a1a' }
    if (level >= 45) return { label: 'HIGH', color: '#c8a84b' }
    if (level >= 25) return { label: 'ELEVATED', color: '#4a90d9' }
    return { label: 'GUARDED', color: '#666' }
  }

  const esc = getEscLabel(escalationLevel)
  const now = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{
      background: '#0d1117',
      border: '0.5px solid #1e2a3a',
      borderRadius: 4,
      padding: '6px 14px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: '#c8a84b', fontWeight: 500, fontFamily: 'IBM Plex Mono' }}>
        STRAIT — TAIWAN STRAIT CRISIS SIMULATOR
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#4a90d9', letterSpacing: 1, fontFamily: 'IBM Plex Mono' }}>
          TURN {String(turn).padStart(2, '0')} / 10
        </span>
        <span style={{ fontSize: 10, color: '#4a90d9', letterSpacing: 1, fontFamily: 'IBM Plex Mono' }}>
          {now}
        </span>
        <span style={{ fontSize: 10, color: esc.color, letterSpacing: 1, fontFamily: 'IBM Plex Mono' }}>
          ESC: {esc.label} [{escalationLevel}/100]
        </span>
        <span style={{ fontSize: 10, letterSpacing: 1, fontFamily: 'IBM Plex Mono' }}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#8b2020',
            marginRight: 6,
            animation: 'blink 1.2s ease-in-out infinite',
          }}/>
          {status === 'loading' ? 'PROCESSING...' : 'SIMULATION ACTIVE'}
        </span>      
      </div>
    </div>
  )
}
