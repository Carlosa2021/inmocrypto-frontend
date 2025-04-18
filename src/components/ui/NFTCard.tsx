'use client';

import { useRouter } from 'next/navigation';
import { NFTProvider, NFTMedia, NFTName } from 'thirdweb/react';
import { Card, CardContent } from '@/components/ui/card';
import type { Contract } from 'thirdweb';
import type { BigNumberish } from 'ethers';

interface NFTCardProps {
  tokenId: BigNumberish;
  contract: Contract;
}

export const NFTCard = ({ tokenId, contract }: NFTCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/marketplace/${tokenId.toString()}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <NFTProvider contract={contract} tokenId={tokenId}>
        <Card className="transition-transform hover:scale-105 rounded-2xl shadow-lg overflow-hidden">
          <div className="w-full h-60">
            <NFTMedia className="w-full h-full object-cover" />
          </div>
          <CardContent className="p-4">
            <NFTName className="text-lg font-semibold mb-1 truncate" />
          </CardContent>
        </Card>
      </NFTProvider>
    </div>
  );
};
