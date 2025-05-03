'use client';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
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
      <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
        <div className="w-full h-60 md:h-full">
          {/* NFTProvider da contexto de metadatos, imagen y loading/fallback UI por defecto! */}
          <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
            <NFTMedia
              className="w-full h-full object-cover rounded-xl"
              loadingComponent={<span>Cargando imagen...</span>}
              fallbackComponent={<span>No se pudo cargar la imagen</span>}
            />
            <CardContent className="p-4">
              <NFTName className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate" />
              <NFTDescription
                className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              />
              <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
                Precio: {price}
              </p>
            </CardContent>
          </NFTProvider>
        </div>
      </Card>
    </div>
  );
};
