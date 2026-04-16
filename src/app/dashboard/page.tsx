'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays, BookHeart, TrendingUp, Plus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentPhaseInfo, PHASE_CONFIG, type Cycle } from '@/lib/cycle-engine'
import { PhaseRing, PhaseBadge } from '@/components/PhaseComponents'
import { format, differenceInDays } from 'date-fns'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ name: string; partner_name: string; default_cycle_length: number } | null>(null)
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [periodActionLoading, setPeriodActionLoading] = useState(false)
  const [periodActionMsg, setPeriodActionMsg] = useState('')

  const loadData = async (uid: string) => {
    const [profileRes, cyclesRes] = await Promise.all([
      supabase.from('profiles').select('name, partner_name, default_cycle_length').eq('id', uid).single(),
      supabase.from('cycles').select('*').eq('user_id', uid).order('start_date', { ascending: false }),
    ])
    if (profileRes.data) setProfile(profileRes.data)
    if (cyclesRes.data) setCycles(cyclesRes.data)
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      await loadData(user.id)
      setLoading(false)
    }
    load()
  }, [])

  const hasActivePeriod = cycles.length > 0 && !cycles[0].end_date

  const handlePeriodStarted = async () => {
    if (!user) return
    setPeriodActionLoading(true)
    const today = format(new Date(), 'yyyy-MM-dd')
    const { error } = await supabase.from('cycles').insert({ user_id: user.id, start_date: today })
    if (!error) {
      await loadData(user.id)
      setPeriodActionMsg('Period started! End it when it\'s over.')
      setTimeout(() => setPeriodActionMsg(''), 4000)
    }
    setPeriodActionLoading(false)
  }

  const handleEndPeriod = async () => {
    if (!user || !cycles[0]) return
    setPeriodActionLoading(true)
    const today = format(new Date(), 'yyyy-MM-dd')
    const { error } = await supabase.from('cycles').update({ end_date: today }).eq('id', cycles[0].id)
    if (!error) {
      await loadData(user.id)
      setPeriodActionMsg('Period ended! Cycle length updated.')
      setTimeout(() => setPeriodActionMsg(''), 4000)
    }
    setPeriodActionLoading(false)
  }

  const phaseInfo = getCurrentPhaseInfo(cycles, profile?.default_cycle_length || 28)
  const phaseConfig = phaseInfo ? PHASE_CONFIG[phaseInfo.phase] : null

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
          {format(new Date(), 'EEEE, MMMM d')}
        </p>
        <h1 style={{ fontSize: '2rem' }}>
          {profile?.name ? `Hey, ${profile.name}` : 'Dashboard'}
        </h1>
        {profile?.partner_name && (
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Tracking <strong style={{ color: 'var(--color-primary)' }}>{profile.partner_name}</strong>'s cycle
          </p>
        )}
      </motion.div>

      {cycles.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card card-elevated"
          style={{
            textAlign: 'center', padding: 'var(--space-2xl)',
            border: '2px dashed var(--color-border)',
            background: 'transparent',
          }}
        >
          <AlertCircle size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No cycle data yet</h2>
          <p style={{ maxWidth: '360px', margin: '0 auto 24px' }}>
            Log the first menstrual cycle to unlock phase tracking and the Men's Guide.
          </p>
          <Link href="/log" className="btn btn-primary">
            <Plus size={16} /> Log First Cycle
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

          {/* Smart period quick-action */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px',
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              background: hasActivePeriod
                ? 'linear-gradient(135deg, var(--phase-menstrual)15, var(--phase-menstrual)08)'
                : 'var(--color-surface-2)',
              border: `1px solid ${hasActivePeriod ? 'var(--phase-menstrual)40' : 'var(--color-border)'}`,
            }}
          >
            <div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginBottom: '2px' }}>
                {hasActivePeriod ? 'Active period' : 'Quick action'}
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
                {hasActivePeriod
                  ? `🩸 Period started ${format(new Date(cycles[0].start_date), 'MMM d')} — still ongoing`
                  : '🗓️ Did her period start today?'}
              </p>
              {periodActionMsg && (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-primary)', marginTop: '4px', fontWeight: 500 }}>
                  ✓ {periodActionMsg}
                </p>
              )}
            </div>
            <button
              onClick={hasActivePeriod ? handleEndPeriod : handlePeriodStarted}
              disabled={periodActionLoading}
              className="btn btn-sm"
              style={{
                background: hasActivePeriod ? 'var(--phase-menstrual)' : 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                flexShrink: 0,
              }}
            >
              {periodActionLoading
                ? <span className="spinner" />
                : hasActivePeriod
                  ? <><CheckCircle2 size={14} /> End Period</>  
                  : <><Plus size={14} /> Period Started</>}
            </button>
          </motion.div>

          {/* Main phase card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card card-elevated"
            style={{
              background: `linear-gradient(135deg, var(--color-surface) 0%, ${phaseConfig?.color}10 100%)`,
              borderColor: `${phaseConfig?.color}30`,
              padding: 'var(--space-xl)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
              <div>
                {phaseInfo && <PhaseBadge phase={phaseInfo.phase} size="lg" />}
                <h2 style={{ marginTop: '16px', marginBottom: '8px' }}>
                  {phaseConfig?.description}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  {phaseInfo && `Day ${phaseInfo.dayInCycle} of ${phaseInfo.avgCycleLength} — ${phaseInfo.daysUntilNextPeriod > 0
                    ? `Next period in ${phaseInfo.daysUntilNextPeriod} day${phaseInfo.daysUntilNextPeriod !== 1 ? 's' : ''}`
                    : 'Period expected today'
                  }`}
                </p>
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/guide" className="btn btn-primary btn-sm">
                    <BookHeart size={14} /> Today's Guide
                  </Link>
                  <Link href="/log" className="btn btn-ghost btn-sm">
                    <Plus size={14} /> Log Symptoms
                  </Link>
                </div>
              </div>
              {phaseInfo && (
                <PhaseRing
                  phase={phaseInfo.phase}
                  progress={phaseInfo.cycleProgress}
                  dayInCycle={phaseInfo.dayInCycle}
                  size={150}
                />
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid-3">
            {[
              {
                label: 'Avg Cycle Length',
                value: phaseInfo ? `${phaseInfo.avgCycleLength} days` : '—',
                icon: TrendingUp,
                color: 'var(--color-secondary)',
              },
              {
                label: 'Avg Period Length',
                value: phaseInfo ? `${phaseInfo.avgPeriodLength} days` : '—',
                icon: CalendarDays,
                color: 'var(--phase-menstrual)',
              },
              {
                label: 'Cycles Logged',
                value: `${cycles.length}`,
                icon: Plus,
                color: 'var(--color-accent)',
              },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius-md)',
                  background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '2px' }}>{label}</p>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-text)' }}>{value}</strong>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent cycles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: '1rem' }}>Recent Cycles</h3>
              <Link href="/history" className="btn btn-ghost btn-sm">View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cycles.slice(0, 3).map((cycle, i) => {
                const start = new Date(cycle.start_date)
                const end = cycle.end_date ? new Date(cycle.end_date) : null
                const len = end ? differenceInDays(end, start) + 1 : null
                return (
                  <div key={cycle.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: i === 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-2)',
                    border: `1px solid ${i === 0 ? 'var(--color-primary)30' : 'var(--color-border)'}`,
                  }}>
                    <div>
                      <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: 'var(--color-text)' }}>
                        {format(start, 'MMM d, yyyy')}
                      </strong>
                      {end && (
                        <span style={{ color: 'var(--color-muted)', fontSize: '0.82rem', marginLeft: '8px' }}>
                          → {format(end, 'MMM d')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                      {len ? `${len} days` : 'Ongoing'}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
