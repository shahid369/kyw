'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Lightbulb, FlaskConical, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentPhaseInfo, PHASE_CONFIG, type Cycle } from '@/lib/cycle-engine'
import { GUIDE_CONTENT, getRandomTip } from '@/lib/guide-content'
import { PhaseBadge } from '@/components/PhaseComponents'

export default function GuidePage() {
  const router = useRouter()
  const supabase = createClient()
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    science: true, dos: true, donts: true, tip: true, script: false,
  })

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

  const toggle = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))

  const phaseInfo = getCurrentPhaseInfo(cycles)
  const phase = phaseInfo?.phase ?? 'unknown'
  const config = PHASE_CONFIG[phase]
  const guide = GUIDE_CONTENT[phase]
  const randomTip = getRandomTip(phase)

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)', maxWidth: '800px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Today's Guide for Him
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '2rem' }}>{guide.title}</h1>
          <PhaseBadge phase={phase} size="lg" />
        </div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}>{guide.subtitle}</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

        {/* Science section */}
        <GuideSection
          id="science"
          icon={<FlaskConical size={18} />}
          title={guide.whatIsHappening.heading}
          expanded={expandedSections.science}
          onToggle={() => toggle('science')}
          color={config.color}
        >
          <p style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
            {guide.whatIsHappening.body}
          </p>
        </GuideSection>

        {/* Do's */}
        <GuideSection
          id="dos"
          icon={<CheckCircle2 size={18} color="hsl(142, 60%, 45%)" />}
          title="What To Do Today"
          expanded={expandedSections.dos}
          onToggle={() => toggle('dos')}
          color="hsl(142, 60%, 45%)"
          accent="hsl(142, 60%, 45%, 0.1)"
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
            {guide.dos.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', background: 'hsl(142, 60%, 45%, 0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: 'hsl(142, 60%, 38%)', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px',
                }}>✓</span>
                <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
              </motion.li>
            ))}
          </ul>
        </GuideSection>

        {/* Don'ts */}
        {guide.donts.length > 0 && (
          <GuideSection
            id="donts"
            icon={<XCircle size={18} color="var(--phase-menstrual)" />}
            title="What To Avoid"
            expanded={expandedSections.donts}
            onToggle={() => toggle('donts')}
            color="var(--phase-menstrual)"
            accent="hsl(0, 72%, 58%, 0.08)"
          >
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
              {guide.donts.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', background: 'hsl(0, 72%, 58%, 0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    color: 'var(--phase-menstrual)', fontSize: '0.7rem', fontWeight: 700, marginTop: '2px',
                  }}>✗</span>
                  <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
                </motion.li>
              ))}
            </ul>
          </GuideSection>
        )}

        {/* Tip of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card card-elevated"
          style={{
            background: `linear-gradient(135deg, ${config.color}12, ${config.color}05)`,
            borderColor: `${config.color}30`,
            padding: 'var(--space-lg)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: `${config.color}20`, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0,
            }}>
              <Lightbulb size={20} color={config.color} />
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', color: config.color, marginBottom: '6px' }}>
                TIP OF THE DAY
              </p>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                "{randomTip}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Communication Script */}
        {guide.communicationScript && (
          <GuideSection
            id="script"
            icon={<MessageSquare size={18} />}
            title="What To Say (Script)"
            expanded={expandedSections.script}
            onToggle={() => toggle('script')}
            color={config.color}
          >
            <div style={{
              padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)', borderLeft: `3px solid ${config.color}`,
            }}>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.8, fontStyle: 'italic' }}>
                {guide.communicationScript}
              </p>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-muted)', marginTop: '8px' }}>
              Adapt this to your own voice — sincerity matters more than the exact words.
            </p>
          </GuideSection>
        )}
      </div>
    </div>
  )
}

function GuideSection({
  id, icon, title, expanded, onToggle, color, accent, children,
}: {
  id: string; icon: React.ReactNode; title: string; expanded: boolean;
  onToggle: () => void; color?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ padding: 0, overflow: 'hidden' }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-md) var(--space-lg)',
          background: expanded && accent ? accent : 'transparent',
          border: 'none', cursor: 'pointer', borderBottom: expanded ? '1px solid var(--color-border)' : 'none',
          transition: 'background var(--transition-fast)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: color ?? 'var(--color-primary)' }}>{icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text)' }}>
            {title}
          </span>
        </div>
        {expanded ? <ChevronUp size={16} color="var(--color-muted)" /> : <ChevronDown size={16} color="var(--color-muted)" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 'var(--space-lg)' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
