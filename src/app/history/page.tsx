'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trash2, Calendar, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getAverageCycleLength, getAveragePeriodLength, type Cycle } from '@/lib/cycle-engine'
import { format, differenceInDays } from 'date-fns'

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('cycles').select('*').eq('user_id', user.id).order('start_date', { ascending: false })
      if (data) setCycles(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this cycle? This also removes its symptoms.')) return
    setDeleting(id)
    await supabase.from('symptoms').delete().eq('cycle_id', id)
    await supabase.from('cycles').delete().eq('id', id)
    setCycles((prev) => prev.filter((c) => c.id !== id))
    setDeleting(null)
  }

  const avgCycle = getAverageCycleLength(cycles)
  const avgPeriod = getAveragePeriodLength(cycles)

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)', maxWidth: '760px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Cycle History</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{cycles.length} cycle{cycles.length !== 1 ? 's' : ''} logged</p>
      </motion.div>

      {/* Summary stats */}
      {cycles.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}
        >
          {[
            { label: 'Avg Cycle Length', value: `${avgCycle} days`, icon: TrendingUp, color: 'var(--color-secondary)' },
            { label: 'Avg Period Length', value: `${avgPeriod} days`, icon: Calendar, color: 'var(--phase-menstrual)' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '200px' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginBottom: '2px' }}>{label}</p>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-text)' }}>{value}</strong>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Cycle list */}
      {cycles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)', border: '2px dashed var(--color-border)', background: 'transparent' }}>
          <p style={{ color: 'var(--color-muted)' }}>No cycles logged yet. Go to Log to add one.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cycles.map((cycle, i) => {
            const start = new Date(cycle.start_date)
            const end = cycle.end_date ? new Date(cycle.end_date) : null
            const periodLen = end ? differenceInDays(end, start) + 1 : null

            const prevCycle = cycles[i + 1]
            const cycleLen = prevCycle
              ? differenceInDays(start, new Date(prevCycle.start_date))
              : null

            return (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    background: i === 0 ? 'var(--color-primary-subtle)' : 'var(--color-surface-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem',
                    color: i === 0 ? 'var(--color-primary)' : 'var(--color-muted)',
                  }}>
                    #{cycles.length - i}
                  </div>
                  <div>
                    <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)', display: 'block' }}>
                      {format(start, 'MMMM d, yyyy')}
                      {end && ` → ${format(end, 'MMMM d, yyyy')}`}
                    </strong>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '4px', flexWrap: 'wrap' }}>
                      {periodLen && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--phase-menstrual)' }}>
                          🩸 {periodLen} day{periodLen !== 1 ? 's' : ''} period
                        </span>
                      )}
                      {cycleLen && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                          ↺ {cycleLen} day cycle
                        </span>
                      )}
                      {!end && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--color-secondary)' }}>● Ongoing</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cycle.id)}
                  disabled={deleting === cycle.id}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {deleting === cycle.id ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Trash2 size={15} />}
                </button>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
