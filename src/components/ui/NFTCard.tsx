'use client';

import React, { useState, useEffect } from 'react';
import { MediaRenderer } from 'thirdweb/react';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/thirdweb/client-browser';

// Skeleton inline; sustituir por el de shadcn/ui si lo tienes
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-xl ${className}`}
  />
);

export interface NFTCardProps {
  listingId: number;
  tokenId: number;
  contract: ThirdwebContract;
  price: string;
  showActions?: boolean;
  onFavorite?: () => void;
}

const gateways = [
  (cid: string, filename: string) =>
    `https://ipfs.thirdwebcdn.com/ipfs/${cid}/${filename}`,
  (cid: string, filename: string) => `https://ipfs.io/ipfs/${cid}/${filename}`,
  (cid: string, filename: string) =>
    `https://cloudflare-ipfs.com/ipfs/${cid}/${filename}`,
  (cid: string, filename: string) =>
    `https://gateway.pinata.cloud/ipfs/${cid}/${filename}`,
];

function resolveIPFS(ipfsUrl?: string): string[] {
  if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) return [ipfsUrl || ''];
  const withoutScheme = ipfsUrl.replace('ipfs://', '');
  const [cid, ...rest] = withoutScheme.split('/');
  const filename = rest.join('/');
  return gateways.map((fn) => fn(cid, filename));
}

export const NFTCard = ({
  listingId,
  tokenId,
  contract,
  price,
  showActions = false,
  onFavorite,
}: NFTCardProps) => {
  const router = useRouter();
  const [nft, setNFT] = useState<{
    metadata?: { name?: string; description?: string; image?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getNFT({ contract, tokenId: BigInt(tokenId) })
      .then((res) => {
        if (!cancelled) {
          setNFT(res);
          const urls = resolveIPFS(res.metadata?.image);
          setImageUrls(urls);
          setImgIdx(0);
          setImgError(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contract, tokenId]);

  const handleClick = () => {
    router.push(`/marketplace/detalles_propiedad/${listingId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${nft?.metadata?.name || 'NFT'}`}
      data-slot="nft-card"
    >
      <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group relative">
        <div className="w-full h-60 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          {loading ? (
            <Skeleton className="w-full h-52 md:h-60" />
          ) : !imgError && imageUrls[imgIdx] ? (
            <>
              <MediaRenderer
                client={client}
                src={imageUrls[imgIdx]}
                className="w-full h-52 md:h-60 object-cover rounded-xl transition-opacity"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrls[imgIdx]}
                alt=""
                style={{ display: 'none' }}
                loading="eager"
                onError={() => {
                  if (imgIdx + 1 < imageUrls.length) setImgIdx(imgIdx + 1);
                  else setImgError(true);
                }}
              />
            </>
          ) : (
            <span className="text-xs text-red-500 px-2">
              No se pudo cargar la imagen de este NFT.
            </span>
          )}
          {showActions && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onFavorite?.();
              }}
              className="absolute top-3 right-3 z-10 bg-white/80 dark:bg-zinc-900/80 rounded-full p-2 shadow-sm hover:bg-indigo-100 hover:dark:bg-indigo-900"
              aria-label="Marcar como favorito"
            >
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="currentColor"
                  className="text-pink-500"
                />
              </svg>
            </button>
          )}
        </div>
        <CardContent className="p-4 px-4">
          <p className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate">
            {loading ? (
              <Skeleton className="h-6 w-44" />
            ) : (
              nft?.metadata?.name ?? 'Sin nombre'
            )}
          </p>
          <p
            className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <Skeleton className="h-4 w-64 mb-0.5" />
            ) : (
              nft?.metadata?.description ?? 'Sin descripción'
            )}
          </p>
          <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
            Precio: {price}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
