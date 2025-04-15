'use client';

import { useParams } from 'next/navigation';
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
} from 'thirdweb/react';
import { marketplace } from '@/lib/contracts';
import Image from 'next/image';

// Resolver IPFS
function resolveIPFS(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith('ipfs://')
    ? url.replace('ipfs://', 'https://ipfs.io/ipfs/')
    : url;
}

// Tipado del listing
type NFTListing = {
  id: string | number | bigint;
  asset: {
    name: string;
    description: string;
    image: string;
  };
  currencyValuePerToken: {
    displayValue: string;
    symbol: string;
  };
};

export default function PropertyPage() {
  const { id } = useParams();
  const account = useActiveAccount();

  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplace,
    method: 'getListing',
    params: [id as string],
  });

  const listing = listingRaw as NFTListing;

  const { mutate: buyNow, isLoading: isBuying, error } = useSendTransaction();

  const image = resolveIPFS(listing?.asset?.image);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {isLoading ? (
        <p>Cargando propiedad...</p>
      ) : listing ? (
        <div>
          {image && (
            <Image
              src={image}
              alt={listing.asset.name || 'Imagen de propiedad'}
              width={1200}
              height={600}
              className="rounded-xl w-full h-96 object-cover"
              unoptimized
            />
          )}
          <h1 className="text-3xl font-bold mt-4">{listing.asset.name}</h1>
          <p className="text-gray-600 mt-2">{listing.asset.description}</p>
          <p className="mt-4 text-xl font-semibold">
            Precio: {listing.currencyValuePerToken.displayValue}{' '}
            {listing.currencyValuePerToken.symbol}
          </p>

          <button
            disabled={isBuying || !account}
            onClick={() =>
              buyNow({
                contract: marketplace,
                method: 'buyFromListing', // este método está bien con SDK v5
                params: {
                  listingId: listing.id,
                  quantity: 1,
                  receiver: account?.address || '',
                },
              })
            }
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            {isBuying ? 'Comprando...' : 'Comprar propiedad'}
          </button>

          {error && (
            <p className="text-red-600 mt-2">
              Error al comprar: {error.message}
            </p>
          )}
        </div>
      ) : (
        <p>No se encontró la propiedad.</p>
      )}
    </div>
  );
}
