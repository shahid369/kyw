// ============================================================
// KYW Cycle Phase Engine
// Calculates menstrual cycle phases based on cycle history
// ============================================================

export type CyclePhase =
  | 'menstrual'
  | 'follicular'
  | 'ovulation'
  | 'luteal'
  | 'pms'
  | 'unknown'

export interface Cycle {
  id: string
  start_date: string
  end_date: string | null
  cycle_length?: number
  period_length?: number
}

export interface PhaseInfo {
  phase: CyclePhase
  dayInCycle: number
  daysUntilNextPeriod: number
  nextPeriodDate: Date
  ovulationDate: Date
  avgCycleLength: number
  avgPeriodLength: number
  cycleProgress: number // 0-100 percentage
}

export function getAverageCycleLength(cycles: Cycle[]): number {
  const lengths: number[] = []

  for (let i = 1; i < cycles.length; i++) {
    const prev = new Date(cycles[i - 1].start_date)
    const curr = new Date(cycles[i].start_date)
    const diff = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diff > 15 && diff < 60) lengths.push(diff) // sanity filter
  }

  if (lengths.length === 0) return 28
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
}

export function getAveragePeriodLength(cycles: Cycle[]): number {
  const lengths = cycles
    .filter((c) => c.end_date)
    .map((c) => {
      const start = new Date(c.start_date)
      const end = new Date(c.end_date!)
      return Math.round(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      )
    })
    .filter((l) => l > 1 && l < 15)

  if (lengths.length === 0) return 5
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
}

export function getCurrentPhaseInfo(cycles: Cycle[]): PhaseInfo | null {
  if (!cycles || cycles.length === 0) return null

  // Sort by start_date descending (newest first)
  const sorted = [...cycles].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  )

  const lastCycle = sorted[0]
  const avgCycleLength = getAverageCycleLength(sorted)
  const avgPeriodLength = getAveragePeriodLength(sorted)

  const lastStart = new Date(lastCycle.start_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  lastStart.setHours(0, 0, 0, 0)

  const dayInCycle =
    Math.floor(
      (today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

  const nextPeriodDate = new Date(lastStart)
  nextPeriodDate.setDate(nextPeriodDate.getDate() + avgCycleLength)

  const daysUntilNextPeriod = Math.ceil(
    (nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Ovulation: cycle_length - 14
  const ovulationDay = avgCycleLength - 14
  const ovulationDate = new Date(lastStart)
  ovulationDate.setDate(ovulationDate.getDate() + ovulationDay - 1)

  const cycleProgress = Math.min(
    100,
    Math.max(0, Math.round((dayInCycle / avgCycleLength) * 100))
  )

  let phase: CyclePhase = 'unknown'

  if (dayInCycle <= avgPeriodLength) {
    phase = 'menstrual'
  } else if (dayInCycle <= ovulationDay - 2) {
    phase = 'follicular'
  } else if (dayInCycle <= ovulationDay + 2) {
    phase = 'ovulation'
  } else if (dayInCycle <= avgCycleLength - 7) {
    phase = 'luteal'
  } else {
    phase = 'pms'
  }

  return {
    phase,
    dayInCycle,
    daysUntilNextPeriod,
    nextPeriodDate,
    ovulationDate,
    avgCycleLength,
    avgPeriodLength,
    cycleProgress,
  }
}

export const PHASE_CONFIG: Record<
  CyclePhase,
  { label: string; color: string; emoji: string; description: string }
> = {
  menstrual: {
    label: 'Menstrual Phase',
    color: 'var(--phase-menstrual)',
    emoji: '🔴',
    description: 'The period is active. Low energy, high sensitivity.',
  },
  follicular: {
    label: 'Follicular Phase',
    color: 'var(--phase-follicular)',
    emoji: '🌱',
    description:
      'Energy is rising. She may feel social, motivated, and upbeat.',
  },
  ovulation: {
    label: 'Ovulation Phase',
    color: 'var(--phase-ovulation)',
    emoji: '✨',
    description: 'Peak energy and communication. She feels her best.',
  },
  luteal: {
    label: 'Luteal Phase',
    color: 'var(--phase-luteal)',
    emoji: '🍂',
    description: 'Energy winds down. She needs calm and reassurance.',
  },
  pms: {
    label: 'PMS Phase',
    color: 'var(--phase-pms)',
    emoji: '⚡',
    description: 'Pre-period tension. Emotions run high — be extra gentle.',
  },
  unknown: {
    label: 'No Data',
    color: 'var(--color-muted)',
    emoji: '❓',
    description: 'Log a cycle to unlock phase tracking.',
  },
}
