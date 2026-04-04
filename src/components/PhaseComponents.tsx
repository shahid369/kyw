'use client'

import { PHASE_CONFIG } from '@/lib/cycle-engine'
import type { CyclePhase } from '@/lib/cycle-engine'

interface PhaseBadgeProps {
  phase: CyclePhase
  size?: 'sm' | 'md' | 'lg'
}

export function PhaseBadge({ phase, size = 'md' }: PhaseBadgeProps) {
  const config = PHASE_CONFIG[phase]
  const sizeStyles = {
    sm: { fontSize: '0.72rem', padding: '3px 10px' },
    md: { fontSize: '0.78rem', padding: '4px 12px' },
    lg: { fontSize: '0.88rem', padding: '6px 16px' },
  }

  return (
    <span
      className={`badge badge-${phase}`}
      style={sizeStyles[size]}
    >
      <span>{config.emoji}</span>
      {config.label}
    </span>
  )
}

interface PhaseRingProps {
  phase: CyclePhase
  progress: number // 0-100
  dayInCycle: number
  size?: number
}

export function PhaseRing({ phase, progress, dayInCycle, size = 160 }: PhaseRingProps) {
  const config = PHASE_CONFIG[phase]
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="phase-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={8}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.8rem' }}>{config.emoji}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: 'var(--color-text)',
          lineHeight: 1,
        }}>
          Day {dayInCycle}
        </span>
      </div>
    </div>
  )
}
