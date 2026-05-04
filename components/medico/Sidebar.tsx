'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  {
    label: 'Nuova visita',
    href: '/medico/visita/nuova',
    primary: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Visite',
    href: '/medico',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Pazienti',
    href: '/medico/pazienti',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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

  const initials = doctor
    ? `${doctor.firstName[0]}${doctor.lastName[0]}`.toUpperCase()
    : 'DR';

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r border-zinc-100 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-18' : 'w-60'
      }`}
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-100 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Image src="/logo.webp" alt="Doctor Twin" width={32} height={32} className="rounded-lg shrink-0" />
            <span className="text-sm font-semibold text-zinc-900 tracking-tight whitespace-nowrap">
              Doctor Twin
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors duration-150 ${
            collapsed ? 'mx-auto' : 'ml-auto'
          }`}
          aria-label={collapsed ? 'Espandi sidebar' : 'Comprimi sidebar'}
        >
          <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-hidden">
        {navItems.map((item) => {
          const active = item.href === '/medico'
            ? pathname === '/medico'
            : pathname.startsWith(item.href);

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`group flex items-center gap-2.5 px-3 py-2 mb-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white hover:shadow-sm hover:shadow-blue-200'
                }`}
              >
                <span className="shrink-0 transition-transform duration-150 group-hover:scale-110">
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-600 rounded-r-full" />
              )}
              <span className={`shrink-0 transition-transform duration-150 ${active ? '' : 'group-hover:translate-x-0.5'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-zinc-100 flex flex-col gap-0.5 shrink-0">
        <Link
          href="/medico/impostazioni"
          title={collapsed ? 'Impostazioni' : undefined}
          className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-150 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {!collapsed && <span>Impostazioni</span>}
        </Link>

        {/* Doctor profile */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[10px] font-bold text-white tracking-wide">{initials}</span>
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-800 truncate leading-snug">
                {doctor ? `Dr. ${doctor.lastName}` : '—'}
              </p>
              <p className="text-[10px] text-zinc-400 truncate leading-snug">
                {doctor?.specialization ?? ''}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          title={collapsed ? 'Esci' : undefined}
          className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Esci</span>}
        </button>
      </div>
    </aside>
  );
}
