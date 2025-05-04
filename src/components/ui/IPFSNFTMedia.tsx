'use client';

import { MediaRenderer } from 'thirdweb/react';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { useEffect, useState } from 'react';
import { client } from '@/lib/thirdweb/client-browser';

interface Props {
  contract: ThirdwebContract;
  tokenId: number | bigint;
  className?: string;
}

// Helper para convertir ipfs:// a tu API interna
function resolveIpfsProxy(url: string): string {
  if (!url) return '';
  if (!url.startsWith('ipfs://')) return url;
  const path = url.replace('ipfs://', '');
  return `/api/ipfs-proxy?path=${encodeURIComponent(path)}`;
}

export const IPFSNFTMedia = ({ contract, tokenId, className = '' }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const nft = await getNFT({
          contract,
          tokenId: BigInt(tokenId),
        });
        const rawImage = nft.metadata?.image || '';
        if (!rawImage) {
          setError('No hay imagen definida en los metadatos del NFT');
          setImageUrl(null);
          return;
        }
        const resolved = resolveIpfsProxy(rawImage);
        setImageUrl(resolved);
        setError(null);
      } catch {
        setError('Error al cargar metadata del NFT');
        setImageUrl(null);
      }
    };
    fetchMetadata();
  }, [contract, tokenId]);

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }
  if (!imageUrl) {
    return <p className="text-sm text-gray-500">Cargando imagen…</p>;
  }

  return <MediaRenderer client={client} src={imageUrl} className={className} />;
};
