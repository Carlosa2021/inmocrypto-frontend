'use client';

import React from 'react';
import { useDirectListings } from '@/lib/thirdweb/hooks/useListings';
import { NFTCard } from '@/components/ui/NFTCard';
import { nftCollectionContract } from '@/lib/contracts';

// SkeletonCard simple; reemplaza por shadcn/ui Skeleton si lo prefieres
const SkeletonCard = () => (
  <div className="rounded-2xl shadow-md bg-white dark:bg-zinc-900 border animate-pulse overflow-hidden cursor-pointer h-[340px]">
    <div className="w-full h-60 bg-zinc-200 dark:bg-zinc-800" />
    <div className="p-4 flex flex-col gap-2">
      <div className="h-6 w-40 bg-zinc-300 dark:bg-zinc-700 rounded mb-1" />
      <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
      <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
    </div>
  </div>
);

export default function PropertyList() {
  const { listings, isLoading, error } = useDirectListings();

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  if (error)
    return (
      <p className="py-12 text-center text-red-500">
        Error cargando propiedades: {error.message}
      </p>
    );

  if (!listings || listings.length === 0) {
    return (
      <div className="py-16 text-center text-xl text-muted-foreground">
        No hay propiedades listadas actualmente.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {listings.map((listing) => (
        <NFTCard
          key={String(listing.id)}
          listingId={Number(listing.id)}
          tokenId={Number(listing.tokenId)}
          contract={nftCollectionContract}
          price={
            listing.currencyValuePerToken.displayValue +
            ' ' +
            listing.currencyValuePerToken.symbol
          }
        />
      ))}
    </div>
  );
}
