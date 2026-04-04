import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { QueryProvider } from '@/components/QueryProvider'

export const metadata: Metadata = {
  title: 'KYW — Know Your Women',
  description:
    'Track menstrual cycles and get science-backed daily guidance on how to support your partner through every phase.',
  keywords: ['menstrual cycle tracker', 'period tracker', 'relationship guide', 'KYW'],
  openGraph: {
    title: 'KYW — Know Your Women',
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
          <QueryProvider>
            <Navbar />
            <main className="page-wrapper">
              {children}
            </main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
