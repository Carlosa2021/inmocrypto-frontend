'use client';

import { useParams } from 'next/navigation';
import {
  useReadContract,
  NFTProvider,
  NFTMedia,
  NFTName,
  NFTDescription,
} from 'thirdweb/react';
import { nftCollectionContract, marketplaceContract } from '@/lib/contracts';
import { useState, useEffect } from 'react';
// import { BuyModal } from '@/components/ui/BuyModal';
// import { Button } from '@/components/ui/button';
import { BuyDirectListingButton } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from '@/lib/thirdweb/client-browser';

interface NFTMetadata {
  [key: string]: unknown;
  name?: string;
  description?: string;
  image?: string;
  ubicacion?: string;
  habitaciones?: string | number;
  superficie?: string | number;
}

export default function PropertyPage() {
  const { id } = useParams();
  const stringId = Array.isArray(id) ? id[0] : id;
  let listingId: bigint | undefined = undefined;
  try {
    listingId = stringId ? BigInt(stringId) : undefined;
  } catch {}

  const method =
    'function getListing(uint256 _listingId) view returns ((uint256 listingId, uint256 tokenId, uint256 quantity, uint256 pricePerToken, uint128 startTimestamp, uint128 endTimestamp, address listingCreator, address assetContract, address currency, uint8 tokenType, uint8 status, bool reserved) listing)';

  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method,
    params: listingId !== undefined ? [listingId] : [0n], // Siempre params length 1
  });

  const validListing =
    listingRaw &&
    typeof listingRaw === 'object' &&
    'listingId' in listingRaw &&
    'tokenId' in listingRaw &&
    'pricePerToken' in listingRaw &&
    'currency' in listingRaw;
  const tokenId = validListing ? (listingRaw.tokenId as bigint) : undefined;
  const pricePerToken = validListing
    ? (listingRaw.pricePerToken as bigint)
    : undefined;
  const detailListingId = validListing
    ? (listingRaw.listingId as bigint)
    : undefined;
  // const currency = validListing ? (listingRaw.currency as string) : '';

  const { data: tokenUriRaw } = useReadContract({
    contract: nftCollectionContract,
    method: 'tokenURI',
    params: [tokenId ?? 0n] as [bigint],
  });
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  useEffect(() => {
    if (!tokenUriRaw || typeof tokenUriRaw !== 'string') return;
    const uri = (tokenUriRaw as string).startsWith('ipfs://')
      ? (tokenUriRaw as string).replace('ipfs://', 'https://ipfs.io/ipfs/')
      : (tokenUriRaw as string);
    fetch(uri)
      .then((res) => res.json())
      .then(setMetadata)
      .catch(() => setMetadata(null));
  }, [tokenUriRaw]);

  // Estado para BuyModal
  // const [open, setOpen] = useState(false);

  if (!stringId || listingId === undefined)
    return <p>Propiedad no encontrada.</p>;
  if (isLoading) return <p>Cargando propiedad...</p>;
  if (!validListing) return <p>Propiedad no encontrada.</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <NFTProvider contract={nftCollectionContract} tokenId={tokenId!}>
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
              Precio: {pricePerToken ? Number(pricePerToken) / 1e18 : '--'} POL
            </p>
            {metadata && (
              <div className="mt-4 text-base text-gray-800 space-y-1">
                {metadata.ubicacion && (
                  <p>
                    <b>Ubicación:</b> {metadata.ubicacion}
                  </p>
                )}
                {metadata.habitaciones && (
                  <p>
                    <b>Habitaciones:</b> {metadata.habitaciones}
                  </p>
                )}
                {metadata.superficie && (
                  <p>
                    <b>Superficie:</b> {metadata.superficie} m²
                  </p>
                )}
                {Object.entries(metadata)
                  .filter(
                    ([key]) =>
                      ![
                        'name',
                        'description',
                        'image',
                        'ubicacion',
                        'habitaciones',
                        'superficie',
                      ].includes(key),
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      <b>{key}:</b> {String(value)}
                    </p>
                  ))}
              </div>
            )}
            <BuyDirectListingButton
              contractAddress="0x3fD5B4F1058416ea6BEeAc7dd3b239DD014a07a6"
              listingId={detailListingId!}
              quantity={1n}
              client={client}
              chain={polygon}
              onTransactionConfirmed={() =>
                alert('¡Compra realizada con éxito!')
              }
              onError={(err) => alert('Error en la compra: ' + err.message)}
            >
              Comprar
            </BuyDirectListingButton>
          </div>
        </div>
      </NFTProvider>
    </div>
  );
}
