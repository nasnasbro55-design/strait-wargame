import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TitleScreen from './components/TitleScreen'
import TopBar from './components/TopBar'
import BlueForcePanel from './components/BlueForcePanel'
import StraitMap from './components/StraitMap'
import RedCellPanel from './components/RedCellPanel'
import AdjudicatorBar from './components/AdjudicatorBar'
import AfterActionReview from './components/AfterActionReview'

const DECISIONS = [
  { action: 'deploy_carrier', category: 'MILITARY', label: 'Deploy USS Reagan CSG to South China Sea' },
  { action: 'defcon3', category: 'MILITARY', label: 'Raise US Forces to DEFCON 3 — elevated readiness' },
  { action: 'fonop', category: 'MILITARY', label: 'Conduct Freedom of Navigation Operation through Strait' },
  { action: 'backchannel', category: 'DIPLOMATIC', label: 'Open backchannel via Swiss embassy in Beijing' },
  { action: 'un_address', category: 'DIPLOMATIC', label: 'Address UN Security Council — demand ceasefire' },
  { action: 'taiwan_recognize', category: 'DIPLOMATIC', label: 'Issue formal statement affirming Taiwan Relations Act' },
  { action: 'sanctions', category: 'ECONOMIC', label: 'Impose coordinated G7 financial sanctions on China' },
  { action: 'trade_block', category: 'ECONOMIC', label: 'Block Chinese access to SWIFT banking system' },
  { action: 'cyber_ops', category: 'CYBER', label: 'Activate USCYBERCOM offensive posture against PLA networks' },
  { action: 'intel_share', category: 'INTELLIGENCE', label: 'Share real-time ISR data with Taiwan and Japan' },
  { action: 'stand_down', category: 'DEESCALATION', label: 'Order partial stand-down — pull CSG back 200nm' },
  { action: 'ceasefire', category: 'DEESCALATION', label: 'Propose mutual ceasefire with PRC via UN mediator' },
]

const MAX_TURNS = 10

export default function App() {
  const [started, setStarted] = useState(false)
  const [showAAR, setShowAAR] = useState(false)
  const [gameState, setGameState] = useState({
    sessionId: null,
    currentTurn: 0,
    status: 'waiting',
    turnHistory: [],
    selectedDecision: null,
    lastRedCell: null,
    lastAdjudicator: null,
    escalationLevel: 20,
  })

  const selectDecision = (decision) => {
    setGameState(prev => ({ ...prev, selectedDecision: decision }))
  }

  const confirmAction = async () => {
    if (!gameState.selectedDecision) return
    setGameState(prev => ({ ...prev, status: 'loading' }))
    try {
      let sessionId = gameState.sessionId
      if (!sessionId) {
        const res = await fetch('http://localhost:5000/api/session/new', { method: 'POST' })
        const data = await res.json()
        sessionId = data.session_id
      }
      const res = await fetch('http://localhost:5000/api/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          player_decision: gameState.selectedDecision,
          turn_history: gameState.turnHistory,
        })
      })
      const data = await res.json()
      const turns = data.turns || []
      const latestTurn = turns[turns.length - 1]
      if (!latestTurn) throw new Error('No turn data')

      const newTurn = data.current_turn ?? gameState.currentTurn + 1
      const newEscalation = latestTurn.adjudicator_score?.escalation_level ?? gameState.escalationLevel

      setGameState(prev => ({
        ...prev,
        sessionId,
        currentTurn: newTurn,
        status: newTurn >= MAX_TURNS || newEscalation >= 90 ? 'complete' : 'active',
        turnHistory: turns,
        selectedDecision: null,
        lastRedCell: latestTurn.redcell_response,
        lastAdjudicator: latestTurn.adjudicator_score,
        escalationLevel: newEscalation,
      }))

      if (newTurn >= MAX_TURNS || newEscalation >= 90) {
        setTimeout(() => setShowAAR(true), 1500)
      }
    } catch (err) {
      console.error(err)
      setGameState(prev => ({ ...prev, status: 'error' }))
    }
  }

  const handleRestart = () => {
    setShowAAR(false)
    setGameState({
      sessionId: null,
      currentTurn: 0,
      status: 'waiting',
      turnHistory: [],
      selectedDecision: null,
      lastRedCell: null,
      lastAdjudicator: null,
      escalationLevel: 20,
    })
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0c10', overflow: 'hidden' }}>
      <AnimatePresence>
        {!started && <TitleScreen onEnter={() => setStarted(true)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showAAR && (
          <AfterActionReview
            turnHistory={gameState.turnHistory}
            finalEscalation={gameState.escalationLevel}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6, padding: 8, boxSizing: 'border-box' }}
          >
            <TopBar turn={gameState.currentTurn} status={gameState.status} escalationLevel={gameState.escalationLevel} />
            <div style={{ flex: 1, display: 'flex', gap: 6, minHeight: 0, overflow: 'hidden' }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ display: 'flex' }}>
                <BlueForcePanel decisions={DECISIONS} selectedDecision={gameState.selectedDecision} onSelect={selectDecision} onConfirm={confirmAction} loading={gameState.status === 'loading'} disabled={gameState.status === 'complete'} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} style={{ flex: 1, display: 'flex' }}>
                <StraitMap turnHistory={gameState.turnHistory} escalationLevel={gameState.escalationLevel} lastRedCell={gameState.lastRedCell} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} style={{ display: 'flex' }}>
                <RedCellPanel lastRedCell={gameState.lastRedCell} turnHistory={gameState.turnHistory} />
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              <AdjudicatorBar lastAdjudicator={gameState.lastAdjudicator} escalationLevel={gameState.escalationLevel} currentTurn={gameState.currentTurn} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
