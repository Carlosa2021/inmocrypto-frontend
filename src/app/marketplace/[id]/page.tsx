'use client';

import { useParams } from 'next/navigation';
import { useReadContract } from 'thirdweb/react';
import { marketplace } from '@/lib/contracts';
import Image from 'next/image'; // 👈 importante

// 🔧 IPFS resolver
function resolveIPFS(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : url;
}

// ✅ Tipado opcional si no lo tienes externo
type NFTListing = {
  asset?: {
    name?: string;
    description?: string;
    image?: string;
  };
  currencyValuePerToken?: {
    displayValue?: string;
    symbol?: string;
  };
};

export default function PropertyPage() {
  const { id } = useParams();

  const { data: listing, isLoading } = useReadContract({
    contract: marketplace,
    method: 'getListing',
    params: [id as string],
  });

  const image = resolveIPFS((listing as NFTListing)?.asset?.image);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {isLoading ? (
        <p>Cargando propiedad...</p>
      ) : listing ? (
        <div>
          {image && (
            <Image
              src={image}
              alt={
                (listing as NFTListing)?.asset?.name || 'Imagen de propiedad'
              }
              width={1200}
              height={600}
              className="rounded-xl w-full h-96 object-cover"
              unoptimized // 👈 si estás usando IPFS o URLs externas sin dominio configurado
            />
          )}
          <h1 className="text-3xl font-bold mt-4">
            {(listing as NFTListing)?.asset?.name || 'Sin nombre'}
          </h1>
          <p className="text-gray-600 mt-2">
            {(listing as NFTListing)?.asset?.description || 'Sin descripción'}
          </p>
          <p className="mt-4 text-xl font-semibold">
            Precio:{' '}
            {(listing as NFTListing)?.currencyValuePerToken?.displayValue ||
              '0.0'}{' '}
            {(listing as NFTListing)?.currencyValuePerToken?.symbol || ''}
          </p>
        </div>
      ) : (
        <p>No se encontró la propiedad.</p>
      )}
    </div>
  );
}
