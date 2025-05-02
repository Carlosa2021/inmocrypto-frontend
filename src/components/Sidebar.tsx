'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Marketplace', href: '/marketplace', color: 'indigo' },
  { label: 'Mis NFTs', href: '/mis-nfts', color: 'orange' },
  { label: 'Crear NFT', href: '/crear-nft', color: 'blue' },
  { label: 'Admin', href: '/admin', color: 'red' },
  { label: 'Whitelist', href: '/whitelist', color: 'teal' },
  { label: 'Estadísticas', href: '/estadisticas', color: 'violet' },
  { label: 'Perfil', href: '/perfil', color: 'yellow' },
  { label: 'Ayuda & FAQ', href: '/faq', color: 'cyan' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburger/mobile */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-50 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white/90 dark:bg-zinc-900/80 p-2 shadow-lg focus:outline-none focus:ring"
        onClick={() => setOpen(true)}
        aria-label="Abrir sidebar"
      >
        <svg
          className="w-7 h-7 text-indigo-600 dark:text-indigo-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar drawer mobile */}
      <div
        className={`fixed inset-0 z-40 transition-all md:hidden ${
          open ? 'bg-black/40 pointer-events-auto' : 'pointer-events-none'
        } ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        <aside
          className={`absolute left-0 top-0 h-full w-[240px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-xl transform transition-transform rounded-r-2xl ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ChainX
            </span>
            <button
              type="button"
              className="rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={() => setOpen(false)}
              aria-label="Cerrar sidebar"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 py-4 flex-1">
            {NAV_LINKS.map(({ label, href, color }) => (
              <SidebarLink
                key={href}
                label={label}
                href={href}
                color={color}
                active={pathname === href}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </aside>
      </div>

      {/* Sidebar normal desktop */}
      <aside className="hidden md:flex flex-col min-h-[calc(100vh-2rem)] mt-4 mx-4 w-[240px] bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xl px-4 py-6 gap-6 sticky top-4 z-20 rounded-2xl">
        <span className="font-black text-2xl pb-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center tracking-tight">
          ChainX
        </span>
        <nav className="flex-1 flex flex-col gap-2">
          {NAV_LINKS.map(({ label, href, color }) => (
            <SidebarLink
              key={href}
              label={label}
              href={href}
              color={color}
              active={pathname === href}
            />
          ))}
        </nav>
        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-4 pb-2 text-xs text-gray-400 dark:text-gray-500 text-center select-none">
          © 2025 ChainX
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  label,
  href,
  color,
  active,
  onClick,
}: {
  label: string;
  href: string;
  color: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium group ${
        active
          ? `bg-${color}-100 dark:bg-${color}-900 text-${color}-800 dark:text-${color}-200`
          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200'
      }`}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full bg-${color}-400 group-hover:bg-${color}-600 dark:bg-${color}-500 dark:group-hover:bg-${color}-300 mr-1`}
      />
      {label}
    </Link>
  );
}
