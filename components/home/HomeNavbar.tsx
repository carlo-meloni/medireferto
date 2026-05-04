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
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : ''
      }`}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 no-underline">
        <Image src="/logo.webp" alt="Doctor Twin" width={40} height={40} className="rounded-lg" />
        Doctor Twin
      </Link>

   

      <div className="flex gap-3 items-center">
        <Link
          href={areaHref}
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

