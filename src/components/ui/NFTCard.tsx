'use client';

import { useRouter } from 'next/navigation';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import { Card } from '@/components/ui/card';
import type { ThirdwebContract } from 'thirdweb';
import Image from 'next/image';

export interface NFTCardProps {
  listingId: number;
  tokenId: number;
  contract: ThirdwebContract;
  price: string;
  image?: string;
  name?: string;
  description?: string;
}

export const NFTCard = ({
  listingId,
  tokenId,
  contract,
  price,
  image,
  name,
  description,
}: NFTCardProps) => {
  const router = useRouter();
  // Prepara src normalizado solo si tienes la propiedad image
  const imageUrl =
    image && image.startsWith('ipfs://')
      ? image.replace('ipfs://', 'https://ipfs.io/ipfs/')
      : image;
  return (
    <div
      onClick={() =>
        router.push(`/marketplace/detalles_propiedad/${listingId}`)
      }
      className="cursor-pointer"
    >
      <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
        <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
          {/* Imagen con fallback seguro */}
          <div className="w-full h-60 md:h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <NFTMedia
              className="w-full h-full object-cover rounded-xl"
              fallbackComponent={
                imageUrl ? (
                  <Image
                    src="ipfs://QmPj6kAtrmwdGnrjqbgp9nkskurQ7QEGMEkeuhGfVTy1f9/ibiza.webp"
                    alt={name || 'NFT'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-red-400">
                    Sin imagen
                  </div>
                )
              }
            />
          </div>
          <div className="p-4">
            <NFTName
              className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate"
              fallbackComponent={
                name ? (
                  <span>{name}</span>
                ) : (
                  <span className="text-red-400">Sin nombre</span>
                )
              }
            />
            <NFTDescription
              className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              fallbackComponent={
                description ? (
                  <span>{description}</span>
                ) : (
                  <span className="text-red-400">Sin descripción</span>
                )
              }
            />
            <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
              Precio: {price}
            </p>
          </div>
        </Card>
      </NFTProvider>
    </div>
  );
};
