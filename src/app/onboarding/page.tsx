'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, X, Plus, Check, SkipForward } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ── Types ──────────────────────────────────────────────────
type LoveLanguage = 'words' | 'acts' | 'quality_time' | 'touch' | 'gifts'
type PersonalityTag = 'introvert' | 'extrovert' | 'sensitive' | 'independent' | 'playful' | 'ambitious' | 'nurturing' | 'creative'
type ComfortStyle = 'physical' | 'alone_time' | 'distraction'
type CommStyle = 'direct' | 'indirect' | 'needs_space_first'

// ── Seed data ──────────────────────────────────────────────
const LOVE_LANGUAGES: { value: LoveLanguage; label: string; emoji: string; desc: string }[] = [
  { value: 'words', label: 'Words of Affirmation', emoji: '💬', desc: 'Verbal appreciation, compliments, messages' },
  { value: 'acts', label: 'Acts of Service', emoji: '🛠️', desc: 'Doing things without being asked' },
  { value: 'quality_time', label: 'Quality Time', emoji: '⌚', desc: 'Undivided attention, no distractions' },
  { value: 'touch', label: 'Physical Touch', emoji: '🤝', desc: 'Hugs, proximity, physical warmth' },
  { value: 'gifts', label: 'Thoughtful Gifts', emoji: '🎁', desc: 'Small gestures that show you remember' },
]

const PERSONALITY_TAGS: { value: PersonalityTag; emoji: string }[] = [
  { value: 'introvert', emoji: '🌙' },
  { value: 'extrovert', emoji: '☀️' },
  { value: 'sensitive', emoji: '🌸' },
  { value: 'independent', emoji: '🦅' },
  { value: 'playful', emoji: '🎭' },
  { value: 'ambitious', emoji: '🚀' },
  { value: 'nurturing', emoji: '🌿' },
  { value: 'creative', emoji: '🎨' },
]

const SEED_COMFORT_FOODS = ['Dark chocolate', 'Maggi', 'Biryani', 'Ice cream', 'Chai', 'Hot soup', 'Pizza', 'Pasta', 'Samosa', 'Cookies']
const SEED_SHOWS = ['The Office', 'Friends', 'Schitt\'s Creek', 'Grey\'s Anatomy', 'Gilmore Girls', 'Brooklyn Nine-Nine', 'Bridgerton', 'Emily in Paris']
const SEED_ACTIVITIES = ['Long walks', 'Cooking together', 'Movie night', 'Painting', 'Reading', 'Baking', 'Hiking', 'Music', 'Dancing', 'Shopping']
const SEED_LIKES = ['Candles', 'Cozy blankets', 'True crime podcasts', 'Plants', 'Coffee', 'Sunsets', 'Books', 'Journaling', 'Skincare', 'Travel']
const SEED_DISLIKES = ['Loud environments', 'Unsolicited advice', 'Being interrupted', 'Last-minute changes', 'Mess', 'Being ignored', 'Crowds']

const COMFORT_STYLES: { value: ComfortStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'physical', label: 'Close & Connected', emoji: '🤗', desc: 'Hugs, warmth, physical presence' },
  { value: 'alone_time', label: 'Space to Recharge', emoji: '🌿', desc: 'Quiet time alone first, then reconnect' },
  { value: 'distraction', label: 'Something to Switch Off', emoji: '📺', desc: 'A show, activity, or distraction helps most' },
]

const COMM_STYLES: { value: CommStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'direct', label: 'Direct & Open', emoji: '💡', desc: 'She likes to talk it through clearly' },
  { value: 'indirect', label: 'Gentle & Indirect', emoji: '🌊', desc: 'She hints rather than states, follow her lead' },
  { value: 'needs_space_first', label: 'Space First, Then Talk', emoji: '⏳', desc: 'She needs processing time before opening up' },
]

// ── Chip Component ─────────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 14px', borderRadius: '999px',
        border: `1.5px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        color: selected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.15s',
        fontWeight: selected ? 600 : 400,
      }}
    >
      {selected && <Check size={12} />}
      {label}
    </button>
  )
}

// ── Chip input (type + Enter to add custom) ────────────────
function ChipInput({
  values, seeds, onChange, placeholder,
}: {
  values: string[]; seeds: string[]; onChange: (v: string[]) => void; placeholder: string
}) {
  const [input, setInput] = useState('')

  const toggle = (val: string) => {
    const norm = val.trim()
    if (!norm) return
    onChange(values.includes(norm) ? values.filter(v => v !== norm) : [...values, norm])
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); toggle(input); setInput('') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Seed chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {seeds.map(s => (
          <Chip key={s} label={s} selected={values.includes(s)} onClick={() => toggle(s)} />
        ))}
      </div>

      {/* Custom selected */}
      {values.filter(v => !seeds.includes(v)).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {values.filter(v => !seeds.includes(v)).map(v => (
            <span
              key={v}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '999px',
                background: 'var(--color-primary)', color: 'white',
                fontSize: '0.83rem', fontWeight: 600,
              }}
            >
              {v}
              <button type="button" onClick={() => toggle(v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', padding: 0 }}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="input-field"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          style={{ paddingRight: '44px' }}
        />
        <button
          type="button"
          onClick={() => { toggle(input); setInput('') }}
          disabled={!input.trim()}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)',
            opacity: input.trim() ? 1 : 0.3,
          }}
        >
          <Plus size={18} />
        </button>
      </div>
      <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', marginTop: '-4px' }}>
        Select from above or type your own and press Enter ↵
      </p>
    </div>
  )
}

// ── Radio card ─────────────────────────────────────────────
function RadioCard({ emoji, label, desc, selected, onClick }: {
  emoji: string; label: string; desc: string; selected: boolean; onClick: () => void
}) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
        border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: selected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
        cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{emoji}</span>
      <div>
        <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--color-text)', fontFamily: 'var(--font-display)', marginBottom: '2px' }}>
          {label}
        </strong>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{desc}</span>
      </div>
      {selected && (
        <span style={{ marginLeft: 'auto', color: 'var(--color-primary)', flexShrink: 0 }}>
          <Check size={18} />
        </span>
      )}
    </button>
  )
}

// ── Progress bar ───────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ marginBottom: 'var(--space-xl)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontFamily: 'var(--font-display)' }}>
          Step {current} of {total}
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>
          {Math.round((current / total) * 100)}% complete
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'var(--color-border)', overflow: 'hidden' }}>
        <motion.div
          initial={false}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 999 }}
        />
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const TOTAL = 5

  // Step 1 — Love language + personality
  const [loveLanguage, setLoveLanguage] = useState<LoveLanguage | null>(null)
  const [personality, setPersonality] = useState<PersonalityTag[]>([])

  // Step 2 — Likes
  const [likes, setLikes] = useState<string[]>([])

  // Step 3 — Dislikes
  const [dislikes, setDislikes] = useState<string[]>([])

  // Step 4 — Comfort foods + shows + activities
  const [comfortFoods, setComfortFoods] = useState<string[]>([])
  const [favShows, setFavShows] = useState<string[]>([])
  const [favActivities, setFavActivities] = useState<string[]>([])

  // Step 5 — Comfort style + comm style
  const [comfortStyle, setComfortStyle] = useState<ComfortStyle | null>(null)
  const [commStyle, setCommStyle] = useState<CommStyle | null>(null)

  const saveProgress = async (overrideStep?: number) => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('partner_profiles').upsert({
      user_id: user.id,
      love_language: loveLanguage,
      personality,
      comfort_style: comfortStyle,
      communication_style: commStyle,
      likes,
      dislikes,
      comfort_foods: comfortFoods,
      fav_shows: favShows,
      fav_activities: favActivities,
      onboarding_step: overrideStep ?? step,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    setSaving(false)
  }

  const next = async () => {
    await saveProgress()
    if (step < TOTAL) setStep(s => s + 1)
    else { await saveProgress(5); router.push('/dashboard') }
  }

  const back = () => setStep(s => Math.max(1, s - 1))

  const skip = async () => {
    await saveProgress(step)
    router.push('/dashboard')
  }

  const finish = async () => {
    await saveProgress(5)
    router.push('/dashboard')
  }

  const stepLabels = ['Her Style', 'What She Loves', 'What She Dislikes', 'Her Comfort List', 'How She Copes']

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>
            K<span style={{ color: 'var(--color-primary)' }}>Y</span>W
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem' }}>
            Tell us about her — the guide gets sharper with every answer.
          </p>
        </motion.div>

        <div className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
          <ProgressBar current={step} total={TOTAL} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {/* ── Step 1: Love language + Personality ── */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                    Her Style ✨
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>
                    How does she feel most loved? What words come to mind when you think of her?
                  </p>

                  <div className="input-group">
                    <label className="input-label">Her primary love language</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {LOVE_LANGUAGES.map(ll => (
                        <RadioCard
                          key={ll.value}
                          emoji={ll.emoji}
                          label={ll.label}
                          desc={ll.desc}
                          selected={loveLanguage === ll.value}
                          onClick={() => setLoveLanguage(ll.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="input-group" style={{ marginTop: 'var(--space-lg)' }}>
                    <label className="input-label">Her personality (pick all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                      {PERSONALITY_TAGS.map(pt => (
                        <Chip
                          key={pt.value}
                          label={`${pt.emoji} ${pt.value.charAt(0).toUpperCase() + pt.value.slice(1)}`}
                          selected={personality.includes(pt.value)}
                          onClick={() => setPersonality(prev =>
                            prev.includes(pt.value) ? prev.filter(p => p !== pt.value) : [...prev, pt.value]
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Likes ── */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                    What She Loves 💛
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>
                    Things that light her up — hobbies, objects, habits, vibes. Add as many as you can.
                  </p>
                  <ChipInput
                    values={likes}
                    seeds={SEED_LIKES}
                    onChange={setLikes}
                    placeholder="e.g. rainy days, mystery novels, overnight oats..."
                  />
                </div>
              )}

              {/* ── Step 3: Dislikes ── */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                    What She Dislikes 🚫
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>
                    Things that drain her or trigger her. Knowing this helps you avoid missteps.
                  </p>
                  <ChipInput
                    values={dislikes}
                    seeds={SEED_DISLIKES}
                    onChange={setDislikes}
                    placeholder="e.g. passive aggression, cold food, being woken up..."
                  />
                </div>
              )}

              {/* ── Step 4: Comfort foods + shows + activities ── */}
              {step === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                      Her Comfort List 🍜
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>
                      The specific things that make her feel at home — food, shows, activities.
                    </p>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Comfort foods</label>
                    <ChipInput
                      values={comfortFoods}
                      seeds={SEED_COMFORT_FOODS}
                      onChange={setComfortFoods}
                      placeholder="e.g. her mum's dal, hot cocoa..."
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Favourite shows / movies</label>
                    <ChipInput
                      values={favShows}
                      seeds={SEED_SHOWS}
                      onChange={setFavShows}
                      placeholder="e.g. Suits, Kota Factory..."
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Activities she enjoys together</label>
                    <ChipInput
                      values={favActivities}
                      seeds={SEED_ACTIVITIES}
                      onChange={setFavActivities}
                      placeholder="e.g. stargazing, thrift shopping..."
                    />
                  </div>
                </div>
              )}

              {/* ── Step 5: Comfort style + comm style ── */}
              {step === 5 && (
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>
                    How She Copes 🌿
                  </h2>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>
                    When she's having a tough day — what actually helps? How does she prefer to communicate?
                  </p>

                  <div className="input-group">
                    <label className="input-label">When she's upset or low, she wants…</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {COMFORT_STYLES.map(cs => (
                        <RadioCard
                          key={cs.value}
                          emoji={cs.emoji}
                          label={cs.label}
                          desc={cs.desc}
                          selected={comfortStyle === cs.value}
                          onClick={() => setComfortStyle(cs.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="input-group" style={{ marginTop: 'var(--space-lg)' }}>
                    <label className="input-label">Her communication style when stressed</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                      {COMM_STYLES.map(cs => (
                        <RadioCard
                          key={cs.value}
                          emoji={cs.emoji}
                          label={cs.label}
                          desc={cs.desc}
                          selected={commStyle === cs.value}
                          onClick={() => setCommStyle(cs.value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <button
              type="button"
              onClick={back}
              className="btn btn-ghost btn-sm"
              style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
            >
              <ArrowLeft size={15} /> Back
            </button>

            <button
              type="button"
              onClick={skip}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-muted)', fontSize: '0.82rem' }}
            >
              <SkipForward size={14} /> Skip for now
            </button>

            <button
              type="button"
              onClick={step === TOTAL ? finish : next}
              className="btn btn-primary btn-sm"
              disabled={saving}
            >
              {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> :
                step === TOTAL
                  ? <><Check size={15} /> Done</>
                  : <>Next <ArrowRight size={15} /></>
              }
            </button>
          </div>
        </div>

        {/* Step label */}
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
          {stepLabels[step - 1]} — all of this can be edited any time in Settings
        </p>
      </div>
    </div>
  )
}
