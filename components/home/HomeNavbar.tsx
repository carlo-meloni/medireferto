'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function HomeNavbar({ role }: { role?: string | null }) {
  const areaHref = role === 'ADMIN' ? '/admin' : role === 'DOCTOR' ? '/medico' : '/login'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border-b border-slate-200/70' : ''
      }`}
    >
      <Link href="/" className="flex items-center no-underline">
        <div className="relative overflow-hidden shrink-0" style={{ width: '140px', height: '36px' }}>
          <Image
            src="/dottor_twin_orizzontale.svg"
            alt="Doctor Twin"
            width={140}
            height={100}
            style={{ position: 'absolute', top: '-37px', left: 0 }}
            priority
          />
        </div>
      </Link>

   

      <div className="flex gap-3 items-center">
        <Link
          href={areaHref}
          className="px-5 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white/70 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-slate-800 no-underline shadow-sm"
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

