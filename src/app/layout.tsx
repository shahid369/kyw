import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'knowyourwomen — Track & Support Your Partner',
  description:
    'Track menstrual cycles and get science-backed daily guidance on how to support your partner through every phase.',
  keywords: ['menstrual cycle tracker', 'period tracker', 'relationship guide', 'knowyourwomen'],
  openGraph: {
    title: 'knowyourwomen — Track & Support Your Partner',
    description: 'Understand her cycle. Be better every day.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="page-wrapper">
            {children}
          </main>
          {/* Footer */}
          <footer style={{
            padding: 'var(--space-xl) 0',
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
            marginTop: 'var(--space-2xl)'
          }}>
            <div className="container">
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginBottom: '12px' }}>
                © {new Date().getFullYear()} know<span style={{ color: 'var(--color-primary)' }}>your</span><span className="text-glitter">women</span>. Built with empathy and science.
                <br />
                <span style={{ fontSize: '0.78rem' }}>
                  Health information provided is for educational purposes only and is not medical advice.
                </span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.85rem' }}>
                <a href="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="/terms" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms of Service</a>
                <a href="mailto:knowyourwomenapp@gmail.com" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Contact Support</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
