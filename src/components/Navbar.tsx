'use client'

import Link from 'next/link'
import { Sun, Moon, ArrowRight } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            K<span>Y</span>W
          </Link>



          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
              style={{ padding: '8px 12px', borderRadius: '12px' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a href="#download" className="btn btn-primary btn-sm" style={{
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '0.85rem'
            }}>
              Download App
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>


    </nav>
  )
}

