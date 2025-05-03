'use client';

import { MediaRenderer } from 'thirdweb/react';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { useEffect, useState } from 'react';
import { client } from '@/lib/thirdweb/client-browser';

function resolveIPFS(uri: string): string {
  if (!uri) return '';
  return uri.replace(/^ipfs:\/\//, 'https://ipfs.thirdwebcdn.com/ipfs/');
}

interface Props {
  contract: ThirdwebContract;
  tokenId: number | bigint;
  className?: string;
}

export const IPFSNFTMedia = ({ contract, tokenId, className = '' }: Props) => {
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!contract) return;

      try {
        const nft = await getNFT({ contract, tokenId: BigInt(tokenId) });
        const image = nft.metadata?.image || '';
        setIpfsUrl(resolveIPFS(image));
      } catch (err) {
        console.error('Error al cargar metadata del NFT', err);
        setIpfsUrl(null);
      }
    };

    fetchMetadata();
  }, [contract, tokenId]);

  if (!ipfsUrl) {
    return (
      <p className="text-sm text-red-500 text-center">
        No se pudo cargar la imagen
      </p>
    );
  }

  return <MediaRenderer client={client} src={ipfsUrl} className={className} />;
};
