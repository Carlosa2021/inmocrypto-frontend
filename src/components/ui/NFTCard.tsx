'use client';
import React, { useState, useEffect } from 'react';
import { MediaRenderer } from 'thirdweb/react';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/thirdweb/client-browser';

export interface NFTCardProps {
  listingId: number;
  tokenId: number;
  contract: ThirdwebContract;
  price: string;
}

export const NFTCard = ({
  listingId,
  tokenId,
  contract,
  price,
}: NFTCardProps) => {
  const router = useRouter();
  const [metadata, setMetadata] = useState<null | {
    name?: string;
    description?: string;
    image?: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  const resolveIPFS = (url?: string) =>
    url?.startsWith('ipfs://')
      ? url.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : url;

  useEffect(() => {
    setLoading(true);
    getNFT({ contract, tokenId: BigInt(tokenId) })
      .then((nft) => {
        setMetadata({
          name: nft?.metadata?.name ?? 'Sin nombre',
          description: nft?.metadata?.description ?? 'Sin descripción',
          image: resolveIPFS(nft?.metadata?.image),
        });
      })
      .catch(() => setMetadata(null))
      .finally(() => setLoading(false));
  }, [contract, tokenId]);

  const handleClick = () => {
    router.push(`/marketplace/detalles_propiedad/${listingId}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
        <div className="w-full h-60 md:h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          {loading ? (
            <span>Cargando imagen...</span>
          ) : metadata?.image ? (
            <MediaRenderer
              client={client}
              src={metadata.image}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-sm text-red-500">
              No se pudo cargar la imagen
            </span>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate">
            {loading ? 'Cargando nombre...' : metadata?.name ?? 'Sin nombre'}
          </p>
          <p
            className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {loading
              ? 'Cargando descripción...'
              : metadata?.description ?? 'Sin descripción'}
          </p>
          <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
            Precio: {price}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
