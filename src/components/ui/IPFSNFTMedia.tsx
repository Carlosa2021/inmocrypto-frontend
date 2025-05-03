'use client';

import Image from 'next/image';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { useEffect, useState } from 'react';

interface Props {
  contract: ThirdwebContract;
  tokenId: number | bigint;
  className?: string;
}

export const IPFSNFTMedia = ({ contract, tokenId, className = '' }: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const nft = await getNFT({ contract, tokenId: BigInt(tokenId) });
        const ipfsImage = nft.metadata?.image || '';

        // Cambia ipfs://... por https://ipfscdn.io/ipfs/...
        const resolvedUrl = `https://ipfscdn.io/ipfs/${encodeURIComponent(
          ipfsImage.replace('ipfs://', ''),
        )}`;

        setImageUrl(resolvedUrl);
      } catch (err) {
        console.error('Error al cargar metadata del NFT', err);
        setImageUrl(null);
      }
    };

    fetchMetadata();
  }, [contract, tokenId]);

  if (!imageUrl) {
    return <p className="text-sm text-red-500">No se pudo cargar la imagen</p>;
  }

  return (
    <Image
      src={imageUrl}
      alt={`NFT ${tokenId}`}
      width={600}
      height={400}
      className={className}
      unoptimized // importante para evitar errores con IPFS
    />
  );
};
