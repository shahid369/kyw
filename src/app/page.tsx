'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react'

const AppleLogo = () => (
  <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
  </svg>
)

const PlayStoreLogo = () => (
  <svg viewBox="0 0 512 512" width="24" height="24" style={{ flexShrink: 0 }}>
    <path fill="#00E5FF" d="M48.1,28.5c-4.5,4.7-7.1,12.3-7.1,22v411c0,9.7,2.6,17.3,7.1,22l1.6,1.6L279.3,256L49.7,26.9L48.1,28.5z"/>
    <path fill="#FF3D00" d="M356.1,332.9L279.3,256L49.7,485.6c6.1,6.5,16.2,7.3,27.5,0.7L356.1,332.9z"/>
    <path fill="#FFC107" d="M452.9,277.6L356.1,332.9L279.3,256l76.8-76.9l96.8,55.3c11.3,6.5,11.3,17.1,0,23.6C452.9,277.6,452.9,277.6,452.9,277.6z"/>
    <path fill="#4CAF50" d="M356.1,179.1L77.2,20.2c-11.3-6.5-21.4-5.7-27.5,0.7L279.3,256L356.1,179.1z"/>
  </svg>
)
import { FAQ } from '@/components/FAQ'

const BrandName = () => (
  <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
    know<span style={{ color: 'var(--color-primary)' }}>your</span><span className="text-glitter">women</span>
  </span>
)

const STATS = [
  { value: '500K+', label: 'Relationships Guided' },
  { value: '12M+', label: 'PMS Fights Blocked' },
  { value: '99.4%', label: 'Hormonal Match Rate' }
]

const PHASES = [
  {
    id: 'luteal',
    label: 'PMS / Luteal',
    phaseTitle: 'Luteal Phase (Days 15–28)',
    status: 'luteal',
    emoji: '🌸',
    riskLevel: 'Elevated Conflict Risk (94%)',
    biology: 'Progesterone rises and falls sharply, estrogen drops. Often triggers fatigue, anxiety, and heightened stress.',
    whatSheFeels: '“I feel completely overwhelmed, fatigued, and unsupported. I don’t have the energy to debate small issues, but I need your presence and care.”',
    whatToSay: '“Let me take care of dinner tonight. What do you need right now?”',
    whatToAvoid: '“Are you sure you’re fine?” or trying to logically debate her feelings.',
    dailyMission: 'Clean the kitchen unprompted or bring home her favorite comfort food.'
  },
  {
    id: 'menstrual',
    label: 'Menstrual Phase',
    phaseTitle: 'Menstrual Phase (Days 1–5)',
    status: 'menstrual',
    emoji: '🩸',
    riskLevel: 'Moderate Fatigue (Energy: 10%)',
    biology: 'Estrogen and progesterone are at their lowest. Physical cramping and shedding of uterine lining cause heavy energy drain.',
    whatSheFeels: '“I am in physical discomfort and my energy is depleted. I want to rest at home, but I don’t want to feel like a burden or hold you back.”',
    whatToSay: '“Please rest up. Let’s stay in, I’ll set up the heating pad.”',
    whatToAvoid: '“So we’re just doing nothing tonight?” or acting annoyed about plans shifting.',
    dailyMission: 'Prepare a warm water bottle or brew a cup of comforting herbal tea.'
  },
  {
    id: 'ovulatory',
    label: 'Ovulatory Phase',
    phaseTitle: 'Ovulation Phase (Days 12–14)',
    status: 'ovulatory',
    emoji: '☀️',
    riskLevel: 'Optimal Connection (Conflict Risk: 2%)',
    biology: 'Estrogen and luteinizing hormone peak. Energy, mood stability, and social drive are naturally at their highest.',
    whatSheFeels: '“I feel energetic, social, and deeply connected. Let’s go out, make memories, and have meaningful conversations together!”',
    whatToSay: '“Let’s go to that new restaurant you wanted to try tonight!”',
    whatToAvoid: 'Being distant, cancelling dates, or avoiding deep communication.',
    dailyMission: 'Plan a spontaneous date night or ask her about her long-term goals.'
  }
]

export default function LandingPage() {
  const [selectedPhase, setSelectedPhase] = useState(PHASES[0])

  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedPhase((current) => {
        const currentIndex = PHASES.findIndex((phase) => phase.id === current.id)
        const nextIndex = (currentIndex + 1) % PHASES.length
        return PHASES[nextIndex]
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [selectedPhase])

  const isGold = selectedPhase.id === 'ovulatory';
  const sayColor = isGold ? 'hsl(142, 70%, 25%)' : 'hsl(142, 70%, 75%)';
  const avoidColor = isGold ? 'hsl(0, 75%, 35%)' : 'hsl(0, 75%, 75%)';

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Background decoration blobs */}
      <div className="gradient-blob" style={{
        top: '-10%', right: '-5%', width: '800px', height: '800px',
        background: 'radial-gradient(circle, hsla(335, 85%, 60%, 0.08) 0%, transparent 70%)'
      }} />
      <div className="gradient-blob" style={{
        top: '40%', left: '-10%', width: '700px', height: '700px',
        background: 'radial-gradient(circle, hsla(200, 78%, 52%, 0.06) 0%, transparent 70%)'
      }} />
      <div className="gradient-blob" style={{
        bottom: '-5%', right: '5%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, hsla(285, 80%, 55%, 0.08) 0%, transparent 70%)'
      }} />

      {/* Hero Section */}
      <section style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '120px',
        paddingBottom: '80px',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
            


            {/* Title */}
            <h1 style={{ 
              marginBottom: '24px', 
              lineHeight: 1.1, 
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              letterSpacing: '-0.04em'
            }}>
              Know the Mood Before You<br/>
              <span style={{ 
                background: 'linear-gradient(135deg, var(--color-primary), hsl(285, 80%, 55%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800
              }}>
                Start the Conversation.
              </span>
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '1.28rem',
              maxWidth: '680px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
              color: 'var(--color-text-secondary)'
            }}>
              <BrandName /> acts like a personal relationship guide. Understand her cycle phase, track daily observations, and get science-backed communication strategies to support her through every phase.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }} id="download">
              <Link href="#" style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'var(--color-text)', color: 'var(--color-bg)',
                padding: '16px 32px', borderRadius: '18px', textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: 'var(--shadow-md)',
                fontWeight: 600
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}>
                <AppleLogo />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8, letterSpacing: '0.05em', fontWeight: 500 }}>Download on the</span>
                  <span style={{ fontSize: '1.15rem', lineHeight: 1, fontWeight: 700 }}>App Store</span>
                </div>
              </Link>

              <Link href="#" style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'var(--color-text)', color: 'var(--color-bg)',
                padding: '16px 32px', borderRadius: '18px', textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: 'var(--shadow-md)',
                fontWeight: 600
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}>
                <PlayStoreLogo />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.72rem', opacity: 0.8, letterSpacing: '0.05em', fontWeight: 500 }}>GET IT ON</span>
                  <span style={{ fontSize: '1.15rem', lineHeight: 1, fontWeight: 700 }}>Google Play</span>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simulation / Interactive Caller ID Section */}
      <section style={{ padding: 'var(--space-2xl) 0', position: 'relative', zIndex: 10 }} id="simulator">
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              How <BrandName /> works in real life
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
              Select a cycle phase to see how our app translates physical and hormonal changes into a practical de-escalation checklist and daily mission.
            </p>
          </div>

          <div className="sim-grid">
            
            {/* Left Column: Interactive Cycle Dashboard Preview */}
            <div>
              <div className="simulation-box">
                
                {/* Simulator controls */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Select a cycle phase to see the guide:
                  </label>
                  <div className="sim-controls">
                    {PHASES.map((phase) => (
                      <button
                        key={phase.id}
                        onClick={() => setSelectedPhase(phase)}
                        className={`sim-btn ${selectedPhase.id === phase.id ? 'active' : ''}`}
                      >
                        {phase.label}
                        {selectedPhase.id === phase.id && (
                          <span key={selectedPhase.id} className="sim-progress" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Phase Dashboard Card */}
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                      In-App Cycle Guide Preview
                    </span>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPhase.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className={`phase-card ${selectedPhase.status}`}
                    >
                      <div className="caller-id-header">
                        <div className="caller-avatar" style={{ fontSize: '1.5rem' }}>
                          {selectedPhase.emoji}
                        </div>
                        <div className="caller-info">
                          <h4>{selectedPhase.phaseTitle}</h4>
                          <div className="phase-badge">
                            {selectedPhase.riskLevel}
                          </div>
                        </div>
                      </div>

                      <div className="phase-tips-box">
                        <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '4px' }}>
                          🔬 Biology & Hormones
                        </h5>
                        <p style={{ marginBottom: '12px' }}>
                          {selectedPhase.biology}
                        </p>

                        <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '4px' }}>
                          💬 Under-the-Surface Mood
                        </h5>
                        <p style={{ marginBottom: '12px', fontStyle: 'italic' }}>
                          {selectedPhase.whatSheFeels}
                        </p>
                        
                        <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '4px' }}>
                          🗣️ How to Communicate
                        </h5>
                        <p style={{ margin: '4px 0 2px' }}>
                          <span style={{ fontWeight: 700, color: sayColor }}>Say:</span> {selectedPhase.whatToSay}
                        </p>
                        <p style={{ marginBottom: '12px' }}>
                          <span style={{ fontWeight: 700, color: avoidColor }}>Avoid:</span> {selectedPhase.whatToAvoid}
                        </p>

                        <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '4px' }}>
                          🎯 Today's Mission
                        </h5>
                        <p>{selectedPhase.dailyMission}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </div>

            {/* Right Column: Premium CSS Device Frame containing generated screenshot */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="phone-mockup-wrapper">
                <div className="phone-frame">
                  <div className="phone-notch" />
                  <div className="phone-screen">
                    {/* Render the high fidelity generated mockup image */}
                    <Image 
                      src="/image.png" 
                      alt="knowyourwomen Application UI" 
                      fill 
                      sizes="320px"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>



      {/* FAQ Section */}
      <section style={{ padding: 'var(--space-2xl) 0', position: 'relative', zIndex: 10 }} id="faq">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="badge badge-neutral" style={{ marginBottom: '16px' }}>
              Common Questions
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
              Have questions about data privacy, science, or tracking? We have got you covered.
            </p>
          </div>

          <FAQ />
        </div>
      </section>

      {/* Dynamic CTA Footer Section */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, hsl(335, 85%, 60%), hsl(285, 80%, 55%))',
        color: 'white',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: 'white', fontSize: '3rem', letterSpacing: '-0.03em' }}>
            Bring Empathy Back to Your Relationship.
          </h2>
          <p style={{ maxWidth: '580px', margin: '0 auto 40px', fontSize: '1.2rem', opacity: 0.9, color: 'white' }}>
            Join over 500,000 partners who have neutralized cycle fights and built healthier, more supportive relationships today.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'white', color: '#0f172a',
              padding: '16px 32px', borderRadius: '18px', textDecoration: 'none',
              fontWeight: 600, transition: 'transform 0.2s',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <AppleLogo />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.6, letterSpacing: '0.05em' }}>Download on the</span>
                <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>App Store</span>
              </div>
            </Link>
            
            <Link href="#" style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'white', color: '#0f172a',
              padding: '16px 32px', borderRadius: '18px', textDecoration: 'none',
              fontWeight: 600, transition: 'transform 0.2s',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <PlayStoreLogo />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.6, letterSpacing: '0.05em' }}>GET IT ON</span>
                <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>Google Play</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
