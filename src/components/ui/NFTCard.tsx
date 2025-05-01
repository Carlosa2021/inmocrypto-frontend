'use client';

import { useRouter } from 'next/navigation';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import { Card, CardContent } from '@/components/ui/card';
import type { ThirdwebContract } from 'thirdweb';

// Tipado consistente con tu listado y props
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

  const handleClick = () => {
    router.push(`/marketplace/detalles_propiedad/${listingId}`);
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
      <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
        <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden">
          <div className="w-full h-60">
            <NFTMedia className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-4">
            <NFTName className="text-lg font-semibold mb-1 truncate" />
            <br />
            <NFTDescription className="text-sm text-gray-600 truncate" />
            <p className="text-sm font-medium mt-2">Precio: {price}</p>
          </CardContent>
        </Card>
      </NFTProvider>
    </div>
  );
};
