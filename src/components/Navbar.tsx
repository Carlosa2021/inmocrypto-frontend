'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import ConnectWallet from '@/components/ConnectWallet';
import { useState, useEffect } from 'react';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-4 z-30 mx-4 rounded-xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-md border border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 select-none">
          <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            ChainX
          </span>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex gap-6 items-center text-base font-medium">
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/marketplace"
          >
            Explorar
          </Link>
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/mis-nfts"
          >
            Mis Inmuebles
          </Link>
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/crear-nft"
          >
            Crear NFT
          </Link>
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/admin"
          >
            Admin
          </Link>
        </nav>

        {/* Theme y Wallet */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Cambiar tema"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 border dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition shadow"
          >
            {mounted ? (theme === 'dark' ? '🌙' : '☀️') : null}
          </button>
          <ConnectWallet theme={theme} />
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-wrap items-center justify-center gap-3 pb-4 text-sm font-medium">
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
          href="/marketplace"
        >
          Explorar
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
          href="/mis-nfts"
        >
          Mis Inmuebles
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
          href="/crear-nft"
        >
          Crear NFT
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 px-2"
          href="/admin"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
