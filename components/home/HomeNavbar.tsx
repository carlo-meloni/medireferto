'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : ''
      }`}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 no-underline">
        <NavLogo />
        MediReferto
      </Link>

      <ul className="hidden md:flex gap-8 list-none m-0 p-0">
        <li>
          <a href="#vantaggi" className="text-slate-500 hover:text-slate-900 text-sm font-medium no-underline transition-colors">
            Vantaggi
          </a>
        </li>
        <li>
          <a href="#ai" className="text-slate-500 hover:text-slate-900 text-sm font-medium no-underline transition-colors">
            Intelligenza AI
          </a>
        </li>
        <li>
          <a href="#prezzi" className="text-slate-500 hover:text-slate-900 text-sm font-medium no-underline transition-colors">
            Prezzi
          </a>
        </li>
      </ul>

      <div className="flex gap-3 items-center">
        <Link
          href="/login"
          className="px-5 py-2 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-100 transition-colors text-slate-900 no-underline"
        >
          Area Medici
        </Link>
        {/* <a
          href="#prezzi"
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(59,130,246,.35)] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(59,130,246,.45)] transition-all no-underline"
        >
          Prova Gratis
        </a> */}
      </div>
    </nav>
  )
}

function NavLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8" aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="url(#hp-ng)" />
      <path d="M10 20 Q12 12 16 16 Q20 20 22 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M16 8 L16 11 M16 21 L16 24 M8 16 L11 16 M21 16 L24 16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="hp-ng" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}
