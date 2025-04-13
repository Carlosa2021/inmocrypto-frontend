'use client';

import React from 'react';
import { useDirectListings } from '@/lib/thirdweb/hooks/useListings';
import Image from 'next/image'; // 👈 al inicio

// ✅ Tipo correcto para listings
type NFTListing = {
  id: string | number | bigint;
  asset: {
    metadata?: {
      image?: string;
      name?: string;
      description?: string;
    };
  };
  currencyValuePerToken: {
    displayValue: string;
    symbol: string;
  };
};

// 🔧 Función para resolver IPFS
function resolveIPFS(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : url;
}

export default function PropertyList() {
  const { listings, isLoading, error } = useDirectListings();

  if (isLoading) return <p>Cargando propiedades...</p>;
  if (error) return <p>Error cargando listings.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {(listings as NFTListing[])?.map((listing) => {
        const image = resolveIPFS(listing.asset?.metadata?.image);

        return (
          <div
            key={listing.id.toString()}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
          >
            {image && (
              <Image
                src={image}
                alt={listing.asset?.metadata?.name || 'Imagen de propiedad'}
                width={800}
                height={400}
                className="rounded-lg w-full h-48 object-cover mb-4"
                unoptimized
              />
            )}
            <h2 className="text-xl font-bold">
              {listing.asset?.metadata?.name || 'Sin nombre'}
            </h2>
            <p className="text-gray-600">
              {listing.asset?.metadata?.description || 'Sin descripción'}
            </p>
            <p className="mt-2 font-semibold">
              {listing.currencyValuePerToken?.displayValue}{' '}
              {listing.currencyValuePerToken?.symbol}
            </p>
          </div>
        );
      })}
    </div>
  );
}
