'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Heart, Sun, Moon, Trash2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/components/ThemeProvider'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggleTheme } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      setEmail(user.email ?? '')
      const { data } = await supabase.from('profiles').select('name, partner_name').eq('id', user.id).single()
      if (data) { setName(data.name ?? ''); setPartnerName(data.partner_name ?? '') }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setSaving(true); setError(''); setSuccess(false)
    const { error } = await supabase.from('profiles').upsert({ id: userId, name, partner_name: partnerName })
    if (error) { setError(error.message) } else { setSuccess(true); setTimeout(() => setSuccess(false), 3000) }
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('This will permanently delete your account and all data. Are you absolutely sure?')) return
    if (!confirm('Last chance — this cannot be undone.')) return
    // Delete user data then sign out
    if (userId) {
      await supabase.from('symptoms').delete().eq('cycle_id', userId)
      await supabase.from('cycles').delete().eq('user_id', userId)
      await supabase.from('profiles').delete().eq('id', userId)
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-2xl)', maxWidth: '600px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your profile and preferences</p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card card-elevated" style={{ padding: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--color-primary)" /> Profile
          </h2>
          {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)' }}>✓ Profile updated!</div>}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="grid-2" style={{ gap: '12px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="name">Your Name</label>
                <input id="name" type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="partner">Her Name</label>
                <div style={{ position: 'relative' }}>
                  <Heart size={14} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                  <input id="partner" type="text" className="input-field" value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)} placeholder="Her name" style={{ paddingLeft: '38px' }} />
                </div>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field" value={email} disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Email cannot be changed</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: 'fit-content' }}>
              {saving ? <span className="spinner" /> : <><Save size={15} /> Save Changes</>}
            </button>
          </form>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="card" style={{ padding: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {theme === 'dark' ? <Moon size={18} color="var(--color-secondary)" /> : <Sun size={18} color="var(--phase-ovulation)" />}
            Appearance
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--color-text)', display: 'block' }}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                {theme === 'dark' ? 'Easier on the eyes' : 'Bright and clean'}
              </p>
            </div>
            <button onClick={toggleTheme} className="btn btn-ghost" style={{ gap: '8px' }}>
              {theme === 'dark' ? <><Sun size={15} /> Light Mode</> : <><Moon size={15} /> Dark Mode</>}
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card" style={{ padding: 'var(--space-lg)', borderColor: 'hsl(0, 72%, 58%, 0.3)' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-sm)', color: 'var(--phase-menstrual)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={18} /> Danger Zone
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
            Permanently delete your account and all associated cycle data. This cannot be undone.
          </p>
          <button onClick={handleDeleteAccount} className="btn btn-ghost btn-sm" style={{ color: 'var(--phase-menstrual)', borderColor: 'hsl(0, 72%, 58%, 0.4)' }}>
            <Trash2 size={14} /> Delete Account
          </button>
        </motion.div>
      </div>
    </div>
  )
}
