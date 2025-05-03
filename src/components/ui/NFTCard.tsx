'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { IPFSNFTMedia } from './IPFSNFTMedia';
import { getNFT } from 'thirdweb/extensions/erc721';
import type { ThirdwebContract } from 'thirdweb';
import { useEffect, useState } from 'react';

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
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleClick = () => {
    router.push(`/marketplace/detalles_propiedad/${listingId}`);
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!contract) return;
      try {
        const nft = await getNFT({ contract, tokenId: BigInt(tokenId) });
        setName(nft.metadata?.name || 'Sin nombre');
        setDescription(nft.metadata?.description || 'Sin descripción');
      } catch (err) {
        console.error('Error al cargar metadata del NFT', err);
      }
    };

    fetchMetadata();
  }, [contract, tokenId]);

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
        <div className="w-full h-60 md:h-full">
          <IPFSNFTMedia
            contract={contract}
            tokenId={tokenId}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <CardContent className="p-4">
          <p className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate">
            {name || 'Cargando...'}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">
            {description || 'Cargando descripción...'}
          </p>
          <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
            Precio: {price || 'No disponible'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
