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
    <nav className="backdrop-blur sticky top-0 z-30 w-full py-3 px-2 md:px-10 bg-white/80 dark:bg-zinc-900/70 border-b dark:border-zinc-800 shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-x-8">
        {/* Logo y nombre de marca */}
        <Link
          href="/"
          className="group flex items-center gap-2 cursor-pointer select-none"
        >
          <span className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            ChainX
          </span>
        </Link>
        {/* Navegación */}
        <nav className="hidden md:flex gap-8 items-center text-base font-medium">
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/marketplace"
          >
            Marketplace
          </Link>
          <Link
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            href="/mis-nfts"
          >
            Mis NFTs
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
        <div className="flex items-center gap-4">
          {/* Botón cambio tema */}
          <button
            aria-label="Cambiar tema"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 border dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition shadow"
          >
            {mounted ? (theme === 'dark' ? '🌙' : '☀️') : null}
          </button>
          {/* Botón cuenta (ya muestra dirección y saldo) */}
          <ConnectWallet theme={theme} />
        </div>
      </div>
      {/* Navbar Mobile */}
      <div className="md:hidden flex flex-wrap items-center gap-3 justify-center pt-4 select-none">
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2"
          href="/marketplace"
        >
          Marketplace
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2"
          href="/mis-nfts"
        >
          Mis NFTs
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2"
          href="/crear-nft"
        >
          Crear NFT
        </Link>
        <Link
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2"
          href="/admin"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
