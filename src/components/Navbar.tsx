'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookHeart, CalendarDays, History, Settings, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/guide', label: "His Guide", icon: BookHeart },
  { href: '/log', label: 'Log Cycle', icon: CalendarDays },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/signup'

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-inner">
          <Link href={user ? '/dashboard' : '/'} className="nav-logo">
            K<span>Y</span>W
          </Link>

          {user && !isAuthPage && (
            <ul className="nav-links">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
              style={{ padding: '7px 10px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user && (
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={15} />
                <span style={{ display: 'none' }}>Sign out</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

/* === MOBILE BOTTOM NAV === */
export function MobileNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  if (!user) return null

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--nav-bg)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--color-border)',
      display: 'none', zIndex: 100,
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
    }}
      className="mobile-nav"
    >
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '3px', padding: '4px 12px',
            color: pathname.startsWith(href) ? 'var(--color-primary)' : 'var(--color-muted)',
            fontSize: '0.7rem', fontFamily: 'var(--font-display)', fontWeight: 500,
            textDecoration: 'none',
          }}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
