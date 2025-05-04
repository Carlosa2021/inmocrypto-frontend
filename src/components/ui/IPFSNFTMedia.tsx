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

// ✅ Función para convertir ipfs:// a gateway válido (Thirdweb CDN)
const resolveIPFS = (url: string) => {
  if (!url) return '';
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', 'https://ipfs.thirdwebcdn.com/ipfs/')
    : url;
};

export const IPFSNFTMedia = ({ contract, tokenId, className = '' }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setIsLoading(true);
        const nft = await getNFT({ contract, tokenId: BigInt(tokenId) });
        const rawImage = nft.metadata?.image || '';
        const resolved = resolveIPFS(rawImage);
        setImageUrl(resolved);
        setHasError(false);
      } catch (err) {
        console.error('Error al cargar metadata del NFT', err);
        setHasError(true);
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetadata();
  }, [contract, tokenId]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Cargando imagen...</p>;
  }

  if (hasError || !imageUrl) {
    return <p className="text-sm text-red-500">No se pudo cargar la imagen</p>;
  }

  return <MediaRenderer client={client} src={imageUrl} className={className} />;
};
