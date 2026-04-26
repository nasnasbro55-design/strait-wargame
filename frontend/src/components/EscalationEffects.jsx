import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EscalationEffects({ escalationLevel }) {
  const isHigh = escalationLevel >= 65
  const isCritical = escalationLevel >= 80
  const isWar = escalationLevel >= 90

  return (
    <>
      {/* Scanline overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        backgroundSize: '100% 4px',
      }}/>

      {/* Vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 49,
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
      }}/>

      {/* Border flash on high escalation */}
      <AnimatePresence>
        {isHigh && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: isCritical ? 0.8 : 2, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 48,
              border: `2px solid ${isWar ? '#ff2020' : isCritical ? '#cc1a1a' : '#8b2020'}`,
              boxShadow: `inset 0 0 ${isWar ? 40 : isCritical ? 25 : 15}px ${isWar ? '#ff202033' : '#8b202022'}`,
              borderRadius: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* War mode red wash */}
      <AnimatePresence>
        {isWar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.04, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 47,
              background: '#ff0000',
            }}
          />
        )}
      </AnimatePresence>

      {/* Critical warning banner */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 60,
              background: isWar ? '#ff2020' : '#8b2020',
              color: '#fff',
              fontSize: 9,
              letterSpacing: 4,
              padding: '3px 24px',
              fontFamily: 'IBM Plex Mono, monospace',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              {isWar ? '⚠ WAR IMMINENT — CRISIS THRESHOLD EXCEEDED' : '⚠ CRITICAL ESCALATION — IMMEDIATE ACTION REQUIRED'}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
