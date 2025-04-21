// src/components/Navbar.tsx
import ConnectWallet from '@/components/ConnectWallet';

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="w-full bg-white border-b flex flex-wrap gap-4 items-center justify-between px-6 py-3 shadow-md">
      <Link href="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.svg" className="h-55 w-81" alt="" />
        </div>
      </Link>
      <nav className="flex gap-6 text-gray-700 text-base">
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/mis-nfts">Mis NFTs</Link>
        <Link href="/crear-nft">Crear NFT</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <div>
        <ConnectWallet />
      </div>
    </header>
  );
}
