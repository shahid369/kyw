'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, Mail, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function DeleteAccountPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Email address is required.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setError('')

    // Generate pre-filled email template for account deletion
    const subject = encodeURIComponent('Account Deletion Request - KYW App')
    const body = encodeURIComponent(
      `Dear knowyourwomen Support Team,\n\n` +
      `I am writing to formally request the permanent deletion of my knowyourwomen account and all associated personal data.\n\n` +
      `Below are my account details for verification:\n` +
      `- Registered Email: ${email}\n` +
      `- Full Name / Partner Name: ${name || 'Not provided'}\n` +
      `- Reason for Deletion: ${reason || 'Not provided'}\n\n` +
      `I understand that this action is permanent and will result in the irreversible deletion of my cycle history, partner profile details, symptoms tracking, and personal settings.\n\n` +
      `Please process this request within the standard 24-48 hour window and send a confirmation to my registered email when complete.\n\n` +
      `Thank you.`
    )

    const mailtoUrl = `mailto:knowyourwomenapp@gmail.com?subject=${subject}&body=${body}`

    // Open user's default email client
    window.location.href = mailtoUrl
    setSubmitted(true)
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
      <style>{`
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text);
          font-size: 0.95rem;
          margin-top: 6px;
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .form-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-subtle);
        }
        .warning-box {
          background: var(--color-danger-bg);
          border: 1px solid var(--color-danger);
          border-radius: 16px;
          padding: var(--space-md);
          margin-bottom: var(--space-lg);
          display: flex;
          gap: 12px;
        }
        .warning-icon {
          color: var(--color-danger);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .warning-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
      `}</style>

      {/* Decorative Blobs */}
      <div className="gradient-blob" style={{
        top: '10%', right: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, hsla(335, 85%, 60%, 0.05) 0%, transparent 70%)'
      }} />
      <div className="gradient-blob" style={{
        bottom: '10%', left: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, hsla(285, 80%, 55%, 0.04) 0%, transparent 70%)'
      }} />

      <div className="container" style={{ maxWidth: '600px', zIndex: 10 }}>
        
        {/* Back Link */}
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          marginBottom: '24px',
          transition: 'color var(--transition-fast)'
        }}
        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {!submitted ? (
          <div className="card card-elevated" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                background: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '12px',
                borderRadius: '16px',
                display: 'inline-flex'
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                  Delete Your Account
                </h1>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  Request permanent erasure of your account and personal data
                </p>
              </div>
            </div>

            <div className="warning-box">
              <AlertTriangle className="warning-icon" size={18} />
              <div className="warning-text">
                <strong>Important Notice:</strong> Account deletion is permanent and cannot be undone. You will lose access to all cycle statistics, custom partner profiles, comfort styles, logs, and preference personalisation.
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Registered Email Address <span style={{ color: 'var(--color-primary)' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Your Name / Partner's Name <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  Reason for leaving <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
                </label>
                <textarea
                  placeholder="Tell us how we can improve the app..."
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {error && (
                <div style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--color-danger-bg)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid hsla(0, 70%, 50%, 0.15)'
                }}>
                  <AlertTriangle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  marginTop: '8px'
                }}
              >
                <Mail size={18} />
                Generate Deletion Email
              </button>
            </form>
          </div>
        ) : (
          <div className="card card-elevated" style={{ padding: '40px 32px', borderRadius: '24px', textAlign: 'center' }}>
            <div style={{
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              padding: '16px',
              borderRadius: '50%',
              display: 'inline-flex',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
              Request Drafted Successfully
            </h2>
            
            <p style={{ fontSize: '1rem', marginBottom: '24px', lineHeight: '1.6' }}>
              We've drafted a deletion request email and opened it in your email client.
              <br />
              <strong style={{ color: 'var(--color-text)' }}>Please verify and send the email from your registered address</strong> to complete the verification.
            </p>

            <div style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '32px',
              fontSize: '0.9rem'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--color-primary)" />
                What happens next?
              </h4>
              <ol style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-secondary)' }}>
                <li>Our support team receives your email request.</li>
                <li>We verify the ownership of the account linked to the email address.</li>
                <li>Your profile, cycle logs, partner details, and metadata are permanently scrubbed.</li>
                <li>You will receive a confirmation email once the process is complete (within 24-48 hours).</li>
              </ol>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  // Fallback triggering the mailto link again if they missed it
                  const subject = encodeURIComponent('Account Deletion Request - KYW App')
                  const body = encodeURIComponent(
                    `Dear knowyourwomen Support Team,\n\n` +
                    `I am writing to formally request the permanent deletion of my knowyourwomen account and all associated personal data.\n\n` +
                    `Below are my account details for verification:\n` +
                    `- Registered Email: ${email}\n` +
                    `- Full Name / Partner Name: ${name || 'Not provided'}\n` +
                    `- Reason for Deletion: ${reason || 'Not provided'}\n\n` +
                    `I understand that this action is permanent and will result in the irreversible deletion of my cycle history, partner profile details, symptoms tracking, and personal settings.\n\n` +
                    `Please process this request within the standard 24-48 hour window and send a confirmation to my registered email when complete.\n\n` +
                    `Thank you.`
                  )
                  window.location.href = `mailto:knowyourwomenapp@gmail.com?subject=${subject}&body=${body}`
                }}
                className="btn btn-ghost"
                style={{ justifyContent: 'center', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
              >
                Re-open Email Draft
              </button>

              <Link href="/" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}>
                Return to Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
