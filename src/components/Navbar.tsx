'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import ConnectWallet from '@/components/ConnectWallet';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/marketplace', label: 'Explorar' },
  { href: '/mis-nfts', label: 'Mis Inmuebles' },
  { href: '/crear-nft', label: 'Crear NFT' },
  { href: '/admin', label: 'Admin' },
];

export function Navbar() {
  const { theme = 'light', setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Renderiza el botón solo en el cliente para evitar hydration mismatch
  const ThemeToggle = mounted && (
    <button
      aria-label={
        theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
      }
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full p-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition shadow"
      type="button"
    >
      {theme === 'dark' ? (
        <span aria-hidden="true">🌙</span>
      ) : (
        <span aria-hidden="true">☀️</span>
      )}
    </button>
  );

  return (
    <nav className="sticky top-4 z-30 mx-4 rounded-xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-md border border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 select-none"
          aria-label="Inicio ChainX"
        >
          <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            ChainX
          </span>
        </Link>

        {/* Links Desktop */}
        <div className="hidden md:flex gap-6 items-center text-base font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Theme Switch + Wallet */}
        <div className="flex items-center gap-4">
          {ThemeToggle}
          {/* Sólo muestra el wallet tras montaje para evitar hydration mismatch */}
          {mounted && (
            <ConnectWallet theme={theme === 'dark' ? 'dark' : 'light'} />
          )}
        </div>
      </div>

      {/* Mobile Links */}
      <div className="md:hidden flex flex-wrap items-center justify-center gap-3 pb-4 text-sm font-medium">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
