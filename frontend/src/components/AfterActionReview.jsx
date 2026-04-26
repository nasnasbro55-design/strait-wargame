import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DOCTRINE_MAP = {
  deploy_carrier: 'Forward deployment of carrier strike groups signals resolve but risks escalation. Doctrine: demonstrate capability without provocation.',
  backchannel: 'Back-channel diplomacy preserves face for both parties. Doctrine: always maintain a diplomatic off-ramp.',
  sanctions: 'Economic coercion is a double-edged instrument. Doctrine: coordinate with allies to maximize pressure.',
  cyber_ops: 'Offensive cyber operations below the threshold of armed conflict. Doctrine: maintain plausible deniability.',
  ceasefire: 'De-escalation initiatives require credible commitment from both sides. Doctrine: pair calls for ceasefire with tangible concessions.',
  airlift: 'Defensive resupply strengthens deterrence without direct confrontation. Doctrine: bolster partner capacity before conflict.',
  fonop: 'Freedom of Navigation Operations assert international law and signal US commitment to open seas. Doctrine: conduct regularly to normalize presence without escalation.',
  un_address: 'Multilateral diplomacy through the UN builds coalition support but risks deadlock. Doctrine: use Security Council to isolate China diplomatically.',
  taiwan_recognize: 'Affirming the Taiwan Relations Act signals commitment without formal recognition. Doctrine: maintain strategic ambiguity while deterring aggression.',
  trade_block: 'SWIFT exclusion is a maximum pressure economic tool. Doctrine: reserve for critical escalation thresholds — difficult to reverse.',
  intel_share: 'Intelligence sharing strengthens partner capacity and builds coalition trust. Doctrine: expand ISR partnerships before conflict to enable rapid response.',
  defcon3: 'DEFCON 3 raises readiness and signals resolve but increases miscalculation risk. Doctrine: accompany with direct communication to adversary to prevent misinterpretation.',
  stand_down: 'Ordered stand-down signals restraint and creates space for diplomacy. Doctrine: pair de-escalatory military moves with diplomatic outreach.',
}

const OUTCOME_COLOR = (escalation) => {
  if (escalation >= 80) return '#ff2020'
  if (escalation >= 65) return '#cc1a1a'
  if (escalation >= 45) return '#c8a84b'
  if (escalation >= 25) return '#4a90d9'
  return '#2a8b4a'
}

const OUTCOME_LABEL = (escalation) => {
  if (escalation >= 80) return 'WAR IMMINENT'
  if (escalation >= 65) return 'CRITICAL FAILURE'
  if (escalation >= 45) return 'ESCALATION UNCHECKED'
  if (escalation >= 25) return 'TENSE STANDOFF'
  return 'CRISIS CONTAINED'
}

export default function AfterActionReview({ turnHistory, finalEscalation, onRestart }) {
  const [aarText, setAarText] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    if (!turnHistory || turnHistory.length === 0) return

    const generateAAR = async () => {
      setLoading(true)
      try {
        const response = await fetch('http://localhost:5000/api/aar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            turn_history: turnHistory,
            final_escalation: finalEscalation,
          })
        })
        const data = await response.json()
        setAarText(data.aar_text || 'After-action review generation failed.')
      } catch {
        setAarText('Unable to connect to adjudicator. Review the turn history manually.')
      }
      setLoading(false)
    }

    generateAAR()
  }, [turnHistory, finalEscalation])

  const outcomeColor = OUTCOME_COLOR(finalEscalation)
  const outcomeLabel = OUTCOME_LABEL(finalEscalation)
  const finalCasualties = turnHistory.reduce((acc, t) => acc + (t.adjudicator_score?.taiwan_casualties || 0), 0)
  const finalConflictProb = turnHistory[turnHistory.length - 1]?.adjudicator_score?.conflict_probability || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0c10ee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        fontFamily: 'IBM Plex Mono, monospace',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: 900,
          maxHeight: '90vh',
          background: '#0d1117',
          border: `0.5px solid ${outcomeColor}44`,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '12px 20px',
          borderBottom: `0.5px solid ${outcomeColor}44`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#0a0c10',
        }}>
          <div>
            <div style={{ fontSize: 8, color: '#4a90d9', letterSpacing: 3, marginBottom: 4 }}>AFTER-ACTION REVIEW — CLASSIFIED</div>
            <div style={{ fontSize: 14, color: outcomeColor, letterSpacing: 2, fontWeight: 500 }}>{outcomeLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, color: '#555', letterSpacing: 1 }}>FINAL ESCALATION</div>
              <div style={{ fontSize: 20, color: outcomeColor, letterSpacing: 2 }}>{finalEscalation}/100</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, color: '#555', letterSpacing: 1 }}>CONFLICT PROB</div>
              <div style={{ fontSize: 20, color: outcomeColor, letterSpacing: 2 }}>{Math.round(finalConflictProb * 100)}%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, color: '#555', letterSpacing: 1 }}>TW CASUALTIES</div>
              <div style={{ fontSize: 20, color: '#8b2020', letterSpacing: 2 }}>{finalCasualties}</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '0.5px solid #1e2a3a' }}>
          {['summary', 'decisions', 'doctrine'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid #c8a84b` : '2px solid transparent',
                color: activeTab === tab ? '#c8a84b' : '#555',
                fontSize: 9,
                letterSpacing: 2,
                fontFamily: 'IBM Plex Mono',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {activeTab === 'summary' && (
            <div>
              <div style={{ fontSize: 8, color: '#4a90d9', letterSpacing: 2, marginBottom: 12 }}>ADJUDICATOR FINAL ASSESSMENT</div>
              {loading ? (
                <div style={{ color: '#555', fontSize: 10, lineHeight: 2 }}>
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>_</motion.span>
                  {' '}GENERATING AFTER-ACTION REVIEW...
                </div>
              ) : (
                <div style={{
                  fontSize: 11,
                  color: '#d4dde8',
                  lineHeight: 1.9,
                  borderLeft: '2px solid #c8a84b',
                  paddingLeft: 16,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {aarText}
                </div>
              )}
            </div>
          )}

          {activeTab === 'decisions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 8, color: '#4a90d9', letterSpacing: 2, marginBottom: 4 }}>TURN-BY-TURN DECISION LOG</div>
              {turnHistory.map((turn, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: '#111620',
                    border: '0.5px solid #1e2a3a',
                    borderRadius: 3,
                    padding: '10px 14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 9, color: '#4a90d9' }}>TURN {turn.turn_number}</span>
                    <span style={{ fontSize: 9, color: OUTCOME_COLOR(turn.adjudicator_score?.escalation_level || 0) }}>
                      ESC: {turn.adjudicator_score?.escalation_level || 0}/100
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: '#c8a84b', marginBottom: 4 }}>
                    US: {turn.player_decision?.label}
                  </div>
                  <div style={{ fontSize: 9, color: '#8b2020', marginBottom: 6 }}>
                    PRC: {turn.redcell_response?.narrative?.slice(0, 100)}...
                  </div>
                  <div style={{ fontSize: 9, color: '#666', lineHeight: 1.5, fontStyle: 'italic' }}>
                    {turn.adjudicator_score?.narrative_summary?.slice(0, 120)}...
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'doctrine' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 8, color: '#4a90d9', letterSpacing: 2, marginBottom: 4 }}>DOCTRINAL ANALYSIS</div>
              {turnHistory.map((turn, i) => {
                const doctrine = DOCTRINE_MAP[turn.player_decision?.action] || 'No doctrinal guidance available for this action.'
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      background: '#111620',
                      border: '0.5px solid #1e2a3a',
                      borderRadius: 3,
                      padding: '10px 14px',
                    }}
                  >
                    <div style={{ fontSize: 9, color: '#c8a84b', marginBottom: 6 }}>
                      T{turn.turn_number}: {turn.player_decision?.label}
                    </div>
                    <div style={{ fontSize: 9, color: '#d4dde8', lineHeight: 1.6, borderLeft: '2px solid #4a90d9', paddingLeft: 10 }}>
                      {doctrine}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '12px 20px', borderTop: '0.5px solid #1e2a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 8, color: '#333', letterSpacing: 1 }}>SCSP NATIONAL SECURITY HACKATHON 2026 — WARGAMING TRACK</div>
          <button
            onClick={onRestart}
            style={{
              padding: '8px 24px',
              background: 'transparent',
              border: '0.5px solid #4a90d9',
              borderRadius: 3,
              color: '#4a90d9',
              fontSize: 9,
              letterSpacing: 2,
              fontFamily: 'IBM Plex Mono',
              cursor: 'pointer',
            }}
          >
            RESTART SIMULATION
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
