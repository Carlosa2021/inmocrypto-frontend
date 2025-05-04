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

const resolveIPFS = (url: string) => {
  if (!url) return '';
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : url;
};

export const IPFSNFTMedia = ({ contract, tokenId, className = '' }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const nft = await getNFT({
          contract,
          tokenId: BigInt(tokenId),
        });
        const rawImage = nft.metadata?.image || '';
        const resolved = resolveIPFS(rawImage);
        setImageUrl(resolved);
      } catch {
        setImageUrl(null);
      }
    };
    fetchMetadata();
  }, [contract, tokenId]);

  if (!imageUrl) {
    return <p className="text-sm text-red-500">No se pudo cargar la imagen</p>;
  }
  return <MediaRenderer client={client} src={imageUrl} className={className} />;
};
