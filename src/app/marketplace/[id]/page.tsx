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

// NUNCA declares ni uses hooks en condicional, ni hagas BigInt(undefined).
export default function PropertyPage() {
  // Consigue id seguro
  const params = useParams();
  const idRaw = params?.id;
  const idString =
    typeof idRaw === 'string'
      ? idRaw
      : Array.isArray(idRaw) && idRaw.length > 0
      ? idRaw[0]
      : undefined;

  // No uses hooks en condicional: maneja 'idString' después.
  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method: 'getListing',
    params: [idString ? BigInt(idString) : 0n], // 0n seguro si no hay id
  });
  const account = useActiveAccount();
  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  // Renderiza sin errores: nunca pasarás undefined al hook ni a BigInt.
  const notFound =
    !idString ||
    idString === '0' ||
    !listingRaw ||
    (idString && BigInt(idString) === 0n);

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
