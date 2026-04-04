'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Brain, Shield, ArrowRight, Sparkles } from 'lucide-react'

const PHASES = [
  { phase: 'menstrual', emoji: '🔴', label: 'Menstrual', color: 'hsl(0, 72%, 58%)' },
  { phase: 'follicular', emoji: '🌱', label: 'Follicular', color: 'hsl(200, 78%, 52%)' },
  { phase: 'ovulation', emoji: '✨', label: 'Ovulation', color: 'hsl(45, 92%, 52%)' },
  { phase: 'luteal', emoji: '🍂', label: 'Luteal', color: 'hsl(265, 60%, 62%)' },
  { phase: 'pms', emoji: '⚡', label: 'PMS', color: 'hsl(280, 72%, 58%)' },
]

const FEATURES = [
  {
    icon: Heart,
    title: 'Phase-Aware Guidance',
    body: 'Get daily, actionable tips on how to behave based on exactly where she is in her cycle.',
  },
  {
    icon: Brain,
    title: 'Science-Backed',
    body: 'Every insight is grounded in hormonal biology — not guesswork or stereotypes.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    body: 'All data is encrypted and stored securely. Only you can access your information.',
  },
]

export default function LandingPage() {
  return (
    <div style={{ paddingTop: 0 }}>
      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(330, 82%, 60%, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-5%', left: '-10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(200, 78%, 52%, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ maxWidth: '700px' }}
          >
            <div className="badge badge-pms" style={{ marginBottom: '24px', fontSize: '0.82rem' }}>
              <Sparkles size={13} />
              Science-backed relationship guidance
            </div>

            <h1 style={{ marginBottom: '24px', lineHeight: 1.1 }}>
              Know Her Cycle.{' '}
              <span style={{ color: 'var(--color-primary)' }}>
                Be Better Every Day.
              </span>
            </h1>

            <p style={{
              fontSize: '1.2rem',
              maxWidth: '560px',
              marginBottom: '40px',
              lineHeight: 1.7,
              color: 'var(--color-text-secondary)',
            }}>
              KYW tracks menstrual cycles and gives men real, science-based,
              daily guidance on how to show up for their partner — phase by phase.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Phase Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ marginTop: '64px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            {PHASES.map(({ phase, emoji, label, color }, i) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 18px',
                  background: 'var(--color-surface)',
                  border: `1px solid ${color}40`,
                  borderRadius: 'var(--radius-full)',
                  boxShadow: `0 0 20px ${color}15`,
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: '0.88rem', color,
                }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'var(--space-2xl) 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}
          >
            <h2>Why KYW?</h2>
            <p style={{ maxWidth: '500px', margin: '12px auto 0' }}>
              Most men know nothing about the hormonal phases their partner goes through.
              KYW changes that — with clarity and science.
            </p>
          </motion.div>

          <div className="grid-3">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                className="card card-elevated"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{ padding: 'var(--space-xl) var(--space-lg)' }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-md)',
                }}>
                  <Icon size={22} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '0.92rem' }}>{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: 'var(--space-2xl) 0',
        background: 'linear-gradient(135deg, hsl(330, 82%, 60%, 0.1) 0%, hsl(265, 65%, 62%, 0.1) 100%)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 style={{ marginBottom: '16px' }}>Ready to understand her better?</h2>
            <p style={{ maxWidth: '460px', margin: '0 auto 32px' }}>
              Join thousands of couples using KYW to build stronger, more empathetic relationships.
            </p>
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Tracking Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'var(--space-xl) 0',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <div className="container">
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
            © 2025 KYW — Know Your Women. Built with empathy and science.
            <br />
            <span style={{ fontSize: '0.78rem' }}>
              Health information provided is for educational purposes only and is not medical advice.
            </span>
          </p>
        </div>
      </footer>
    </div>
  )
}
