'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Trash2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { CalendarPicker } from '@/components/CalendarPicker'

const SYMPTOMS = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'mood', label: 'Mood Swings', emoji: '😢' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', emoji: '🫧' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'flow_light', label: 'Light Flow', emoji: '🩸' },
  { id: 'flow_medium', label: 'Medium Flow', emoji: '🩸🩸' },
  { id: 'flow_heavy', label: 'Heavy Flow', emoji: '🩸🩸🩸' },
]

export default function LogPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'cycle' | 'symptoms'>('cycle')

  // Cycle form
  const [startDate, setStartDate] = useState<string | null>(null)
  const [endDate, setEndDate] = useState<string | null>(null)
  const [periodLength, setPeriodLength] = useState('5')
  const [cycleLength, setCycleLength] = useState('28')
  const [notes, setNotes] = useState('')
  const [cycleLoading, setCycleLoading] = useState(false)
  const [cycleSuccess, setCycleSuccess] = useState(false)
  const [cycleError, setCycleError] = useState('')

  // Symptoms form
  const [symptomDate, setSymptomDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState(3)
  const [symptomLoading, setSymptomLoading] = useState(false)
  const [symptomSuccess, setSymptomSuccess] = useState(false)
  const [cycles, setCycles] = useState<{ id: string; start_date: string }[]>([])
  const [selectedCycleId, setSelectedCycleId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase.from('cycles').select('id, start_date').eq('user_id', user.id).order('start_date', { ascending: false })
      if (data) { setCycles(data); if (data[0]) setSelectedCycleId(data[0].id) }
    }
    load()
  }, [])

  const handleLogCycle = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId || !startDate) return
    setCycleLoading(true); setCycleError(''); setCycleSuccess(false)

    // finalEndDate is now natively managed by the calendar! Let's just use endDate.
    const { error } = await supabase.from('cycles').insert({
      user_id: userId,
      start_date: startDate,
      end_date: endDate || null,
      notes: notes || null,
    })

    if (!error && cycles.length === 0) {
      await supabase.from('profiles').update({ default_cycle_length: Number(cycleLength) || 28 }).eq('id', userId)
    }

    if (error) { setCycleError(error.message); setCycleLoading(false); return }
    setCycleSuccess(true); setCycleLoading(false); setNotes('')
    setStartDate(null)
    setEndDate(null)
    // Refresh cycles
    const { data } = await supabase.from('cycles').select('id, start_date').eq('user_id', userId).order('start_date', { ascending: false })
    if (data) { setCycles(data); if (data[0]) setSelectedCycleId(data[0].id) }
    setTimeout(() => setCycleSuccess(false), 3000)
  }

  const handleLogSymptoms = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedCycleId || selectedSymptoms.length === 0) return
    setSymptomLoading(true); setSymptomSuccess(false)

    const inserts = selectedSymptoms.map((type) => ({
      cycle_id: selectedCycleId,
      date: symptomDate,
      type,
      severity,
    }))

    await supabase.from('symptoms').insert(inserts)
    setSymptomSuccess(true); setSelectedSymptoms([]); setSymptomLoading(false)
    setTimeout(() => setSymptomSuccess(false), 3000)
  }

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)', maxWidth: '680px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Log Entry</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Record a cycle or today's symptoms</p>
      </motion.div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: 'var(--color-surface-2)',
        borderRadius: 'var(--radius-full)', padding: '4px',
        marginBottom: 'var(--space-xl)', width: 'fit-content',
      }}>
        {(['cycle', 'symptoms'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 24px', borderRadius: 'var(--radius-full)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)',
            fontWeight: 600, fontSize: '0.88rem', transition: 'all var(--transition-fast)',
            background: activeTab === tab ? 'var(--color-surface)' : 'transparent',
            color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-muted)',
            boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
          }}>
            {tab === 'cycle' ? '📅 New Cycle' : '🩺 Symptoms'}
          </button>
        ))}
      </div>

      {/* Cycle Form */}
      {activeTab === 'cycle' && (
        <motion.div key="cycle" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>
            <Plus size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--color-primary)' }} />
            Log New Cycle
          </h2>
          {cycleError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-md)' }}>{cycleError}</div>}
          {cycleSuccess && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)' }}>✓ Cycle logged successfully!</div>}
          <form onSubmit={handleLogCycle} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="periodLength">
                  Typical Period Length (days) *
                </label>
                <input id="periodLength" type="number" min="1" max="15" className="input-field" value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  required />
              </div>
              {cycles.length === 0 && (
                <div className="input-group">
                  <label className="input-label" htmlFor="cycleLength">
                    Average Cycle Length (days) *
                  </label>
                  <input id="cycleLength" type="number" min="15" max="60" className="input-field" value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    required />
                </div>
              )}
            </div>
            
            <div className="input-group">
              <label className="input-label">Select Cycle Dates *</label>
              <CalendarPicker 
                startDate={startDate} 
                endDate={endDate} 
                periodLength={Number(periodLength) || 5}
                onChange={(s, e) => {
                  setStartDate(s)
                  setEndDate(e)
                }} 
              />
              {!startDate && <p style={{color: 'var(--color-muted)', fontSize: '0.8rem'}}>Click a start date to begin tracking.</p>}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="notes">Notes (optional)</label>
              <textarea id="notes" className="input-field" placeholder="Any notes about this cycle..."
                value={notes} onChange={(e) => setNotes(e.target.value)}
                style={{ minHeight: '80px', resize: 'vertical' }} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={cycleLoading || !startDate} style={{ width: 'fit-content' }}>
              {cycleLoading ? <span className="spinner" /> : <><Save size={15} /> Save Cycle</>}
            </button>
          </form>
        </motion.div>
      )}

      {/* Symptoms Form */}
      {activeTab === 'symptoms' && (
        <motion.div key="symptoms" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--space-lg)' }}>🩺 Log Symptoms</h2>
          {cycles.length === 0 ? (
            <p style={{ color: 'var(--color-muted)' }}>Log a cycle first to track symptoms.</p>
          ) : (
            <>
              {symptomSuccess && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)' }}>✓ Symptoms saved!</div>}
              <form onSubmit={handleLogSymptoms} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                <div className="grid-2" style={{ gap: '12px' }}>
                  <div className="input-group">
                    <label className="input-label">Cycle</label>
                    <select className="input-field" value={selectedCycleId} onChange={(e) => setSelectedCycleId(e.target.value)}>
                      {cycles.map((c) => (
                        <option key={c.id} value={c.id}>
                          {format(new Date(c.start_date), 'MMM d, yyyy')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input type="date" className="input-field" value={symptomDate}
                      onChange={(e) => setSymptomDate(e.target.value)} max={format(new Date(), 'yyyy-MM-dd')} />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Symptoms</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {SYMPTOMS.map(({ id, label, emoji }) => (
                      <button key={id} type="button" onClick={() => toggleSymptom(id)} style={{
                        padding: '8px 14px', borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${selectedSymptoms.includes(id) ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: selectedSymptoms.includes(id) ? 'var(--color-primary-subtle)' : 'transparent',
                        color: selectedSymptoms.includes(id) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem',
                        fontWeight: 500, transition: 'all var(--transition-fast)',
                      }}>
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Severity: {severity}/5</label>
                  <input type="range" min={1} max={5} value={severity} onChange={(e) => setSeverity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                    <span>Mild</span><span>Moderate</span><span>Severe</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={symptomLoading || selectedSymptoms.length === 0} style={{ width: 'fit-content' }}>
                  {symptomLoading ? <span className="spinner" /> : <><Save size={15} /> Save Symptoms</>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
