"use client";

import { useRouter } from "next/navigation";
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from "thirdweb/react";
import type { ThirdwebContract } from "thirdweb";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";

export interface RoundedNFTCardProps {
  listingId: number;
  tokenId: number;
  contract: ThirdwebContract;
  price: string;
}

// Skeleton visual para loading
function ImageSkeleton() {
  return (
    <div className="w-full h-full animate-pulse rounded-xl bg-gradient-to-br from-zinc-200/80 to-indigo-200/50 dark:from-zinc-800 dark:to-indigo-950" />
  );
}

export const RoundedNFTCard = ({
  listingId,
  tokenId,
  contract,
  price,
}: RoundedNFTCardProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(`/marketplace/detalles_propiedad/${listingId}`)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          router.push(`/marketplace/detalles_propiedad/${listingId}`);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de NFT listado ${listingId}`}
      className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pink-600 transition-transform"
      title={`Ver detalles de NFT #${tokenId}`}
    >
      <NFTProvider contract={contract} tokenId={BigInt(tokenId)}>
        <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900">
          <div className="w-full h-60 md:h-full">
            <NFTMedia
              className="w-full h-full object-cover rounded-xl"
              loadingComponent={<ImageSkeleton />}
              fallbackComponent={
                <div className="w-full h-full flex items-center justify-center font-bold text-base text-zinc-400">
                  Imagen no disponible
                </div>
              }
            />
          </div>
          <CardContent className="p-4">
            <NFTName className="text-lg font-semibold mb-1 text-zinc-800 dark:text-zinc-100 truncate" />
            <NFTDescription
              className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            />
            <p className="text-sm font-semibold mt-3 text-indigo-700 dark:text-indigo-300">
              Precio: {price}
            </p>
          </CardContent>
        </Card>
      </NFTProvider>
    </div>
  );
};
