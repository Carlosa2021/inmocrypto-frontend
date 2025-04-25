'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import ConnectWallet from '@/components/ConnectWallet';

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-between px-6 py-3 shadow-md dark:shadow-lg transition-colors">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" className="h-40 w-64" alt="logo" />
        </div>
      </Link>
      <nav className="flex gap-6 text-gray-700 dark:text-gray-200 text-base">
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/mis-nfts">Mis NFTs</Link>
        <Link href="/crear-nft">Crear NFT</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <div className="flex items-center gap-4">
        {/* Botón de cambio de tema */}
        <button
          aria-label="Cambiar tema"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2 border dark:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <ConnectWallet theme={theme} />
      </div>
    </header>
  );
}
