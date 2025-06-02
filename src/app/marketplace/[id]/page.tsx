'use client';

import { useParams } from 'next/navigation';
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
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
  // Siempre obtén el id pero nunca coloques hooks en condicional
  const params = useParams();
  const idParam = params?.id;

  // Convierte id para soportar string o string[]
  const id =
    typeof idParam === 'string'
      ? idParam
      : Array.isArray(idParam) && idParam.length > 0
      ? idParam[0]
      : undefined;

  // Los hooks NO pueden ser condicionales: llama SIEMPRE
  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method: 'getListing',
    params: id ? [BigInt(id)] : [0n], // nunca undefined!
  });

  const account = useActiveAccount();
  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  // Renderiza según los datos obtenidos
  if (isLoading) return <p>Cargando propiedad...</p>;
  if (!listingRaw || !id || id === '0') return <p>Propiedad no encontrada.</p>;

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
                  params: [
                    BigInt(listing.id),
                    1n, // Siempre bigint!
                    account?.address ?? '',
                  ],
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
