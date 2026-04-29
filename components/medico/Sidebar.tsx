'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  {
    label: 'Nuova visita',
    href: '/medico/visita/nuova',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Visite',
    href: '/medico',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Pazienti',
    href: '/medico/pazienti',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  doctor: { firstName: string; lastName: string; specialization: string | null } | null;
}

export default function Sidebar({ doctor }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-white border-r border-zinc-200 w-16 md:w-56">

      {/* HEADER */}
      <div className="flex items-center justify-center md:justify-between px-3 md:px-4 h-16 border-b border-zinc-200">

        {/* MOBILE: logo */}
        <div className="md:hidden flex items-center justify-center">
          <img
            src="/favicon.ico"
            alt="MediReferto"
            className="w-8 h-8 rounded-md"
          />
        </div>

        {/* DESKTOP: testo */}
        <span className="hidden md:block text-base font-semibold text-zinc-900">
          MediReferto
        </span>

        <div className="hidden md:block w-6 h-6" />
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const active =
            item.href === '/medico'
              ? pathname === '/medico'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                }
                justify-center md:justify-start
              `}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-2 py-4 border-t border-zinc-200 flex flex-col gap-2">

        {/* Impostazioni */}
        <Link
          href="/medico/impostazioni"
          className="
            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition
            justify-center md:justify-start
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>

          <span className="hidden md:inline">Impostazioni</span>
        </Link>

        {/* Doctor */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg justify-center md:justify-start">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-blue-700">
              {doctor
                ? `${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase()
                : 'DR'}
            </span>
          </div>

          <div className="hidden md:block min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">
              {doctor ? `Dr. ${doctor.lastName}` : '—'}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {doctor?.specialization ?? ''}
            </p>
          </div>
        </div>

        {/* Divider mobile */}
        <div className="md:hidden h-px bg-zinc-100 my-1" />

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="
            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
            text-zinc-600 hover:bg-red-50 hover:text-red-600 transition
            justify-center md:justify-start
          "
          title="Esci"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>

          <span className="hidden md:inline">Esci</span>
        </button>
      </div>
    </aside>
  );
}