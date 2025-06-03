'use client';

import { useParams } from 'next/navigation';
import {
  useReadContract,
  useActiveAccount,
  useSendTransaction,
  NFTProvider,
  NFTMedia,
  NFTName,
  NFTDescription,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { nftCollectionContract, marketplaceContract } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import type { DirectListing } from 'thirdweb/extensions/marketplace';

export default function PropertyPage() {
  // 1. Obtener id seguro (string || undefined)
  const params = useParams();
  const idRaw = params?.id;
  const idString =
    typeof idRaw === 'string'
      ? idRaw
      : Array.isArray(idRaw) && idRaw.length > 0
      ? idRaw[0]
      : undefined;

  // 2. Siempre un bigint VÁLIDO
  const bigintId = idString ? BigInt(idString) : 0n;
  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method: 'getListing',
    params: [bigintId],
  });

  const account = useActiveAccount();
  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  // 3. No hay propiedad válida si idString no existe, es "0" o viene sin resultado
  const notFound =
    !idString || idString === '0' || !listingRaw || bigintId === 0n;

  if (isLoading) return <p>Cargando propiedad...</p>;
  if (notFound) return <p>Propiedad no encontrada.</p>;

  const listing = listingRaw as unknown as DirectListing;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <NFTProvider
        contract={nftCollectionContract}
        tokenId={BigInt(listing.tokenId)}
      >
        <div className="rounded-xl overflow-hidden shadow-xl">
          <NFTMedia className="w-full h-96 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">
              <NFTName />
            </h1>
            <p className="text-gray-600 mb-6">
              <NFTDescription />
            </p>
            <p className="text-xl font-semibold mb-4">
              Precio: {listing.currencyValuePerToken.displayValue}{' '}
              {listing.currencyValuePerToken.symbol}
            </p>
            <Button
              disabled={isBuying || !account}
              onClick={() => {
                const transaction = prepareContractCall({
                  contract: marketplaceContract,
                  method:
                    'function buyFromListing(uint256 listingId, uint256 quantityToBuy, address recipient)',
                  params: [BigInt(listing.id), 1n, account?.address ?? ''],
                });
                buyNow(transaction);
              }}
            >
              {isBuying ? 'Comprando...' : 'Comprar'}
            </Button>
          </div>
        </div>
      </NFTProvider>
    </div>
  );
}
