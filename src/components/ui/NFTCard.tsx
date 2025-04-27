'use client';
import { useRouter } from 'next/navigation';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import { Card, CardContent } from '@/components/ui/card';
import type { ThirdwebContract } from 'thirdweb';

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
        {/* Elimina border en Card y unifica fondo de media y Card */}
        <Card className="rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 bg-card dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          {/* Quita todo overlay del media: deja color igual al Card */}
          <div className="w-full h-60 bg-card dark:bg-zinc-900">
            <NFTMedia className="w-full h-full object-cover bg-card dark:bg-zinc-900" />
          </div>
          <CardContent className="p-4">
            <NFTName className="text-lg font-bold mb-1 truncate text-foreground" />
            <NFTDescription className="text-sm text-muted-foreground line-clamp-2 mb-2" />
            <span className="text-indigo-600 dark:text-indigo-300 font-medium">
              Precio: {price}
            </span>
          </CardContent>
        </Card>
      </NFTProvider>
    </div>
  );
};
