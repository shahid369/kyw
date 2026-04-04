'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError('Please accept the health disclaimer to continue.'); return }
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) {
      const friendly: Record<string, string> = {
        'email rate limit exceeded': 'Too many sign-up attempts. Please wait a few minutes and try again.',
        'user already registered': 'An account with this email already exists. Try signing in instead.',
        'password should be at least 6 characters': 'Password must be at least 8 characters.',
      }
      const msg = Object.entries(friendly).find(([k]) =>
        signUpError.message.toLowerCase().includes(k)
      )?.[1] ?? signUpError.message
      setError(msg); setLoading(false); return
    }


    // Upsert profile — the DB trigger may have already created a blank row,
    // so we upsert to safely set name/partner_name either way.
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        name,
        partner_name: partnerName,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      
      if (profileError) {
        setError(`Account created, but profile failed to save: ${profileError.message}`)
        setLoading(false)
        return
      }
    }
    router.push('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-lg)',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card card-elevated"
        style={{ width: '100%', maxWidth: '460px', padding: 'var(--space-xl)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            K<span style={{ color: 'var(--color-primary)' }}>Y</span>W
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Create your free account
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 'var(--space-md)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="grid-2" style={{ gap: '12px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="name">Your Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
                <input id="name" type="text" className="input-field" placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '40px' }} required />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="partner">Her Name</label>
              <div style={{ position: 'relative' }}>
                <Heart size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
                <input id="partner" type="text" className="input-field" placeholder="Her name" value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)} style={{ paddingLeft: '40px' }} required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input id="email" type="email" className="input-field" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '40px' }} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="pwd">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }} />
              <input id="pwd" type={showPassword ? 'text' : 'password'} className="input-field"
                placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', paddingRight: '42px' }} required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)',
              }}>
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Health Disclaimer */}
          <div style={{
            padding: 'var(--space-md)', borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary-subtle)', border: '1px solid var(--color-border)',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <input type="checkbox" id="disclaimer" checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: '3px', cursor: 'pointer', accentColor: 'var(--color-primary)', flexShrink: 0 }} />
            <label htmlFor="disclaimer" style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
              I understand that KYW provides educational cycle information only — not medical advice.
              Cycle predictions are estimates based on logged data.
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
            {loading ? <span className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
