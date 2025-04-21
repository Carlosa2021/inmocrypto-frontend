// src/components/Sidebar.tsx
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-50 border-r flex flex-col p-6">
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/profile.png"
          alt="User"
          className="h-12 w-12 rounded-full mb-2"
        />
        <span className="text-lg font-semibold">Usuario</span>
      </div>
      <nav className="flex flex-col gap-4 text-gray-800">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/mis-nfts">Mis NFTs</Link>
        <Link href="/favoritos">Favoritos</Link>
        <Link href="/ajustes">Ajustes</Link>
      </nav>
    </aside>
  );
}
