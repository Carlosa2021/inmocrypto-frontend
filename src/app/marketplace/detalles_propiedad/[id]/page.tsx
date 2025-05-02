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
    params: listingId !== undefined ? [listingId] : [0n],
  });

  const validListing =
    listingRaw &&
    typeof listingRaw === 'object' &&
    'listingId' in listingRaw &&
    'tokenId' in listingRaw &&
    'pricePerToken' in listingRaw;

  const tokenId = validListing ? (listingRaw.tokenId as bigint) : undefined;
  const pricePerToken = validListing
    ? (listingRaw.pricePerToken as bigint)
    : undefined;
  const detailListingId = validListing
    ? (listingRaw.listingId as bigint)
    : undefined;

  // NO genéricos, el hook ya infiere (y forzamos comprobación en el efecto)
  const { data: tokenUriRaw } = useReadContract({
    contract: nftCollectionContract,
    method: 'tokenURI',
    params: [tokenId ?? 0n] as [bigint],
  });

  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);

  useEffect(() => {
    if (!tokenUriRaw) return;
    const uri = String(tokenUriRaw).startsWith('ipfs://')
      ? String(tokenUriRaw).replace('ipfs://', 'https://ipfs.io/ipfs/')
      : String(tokenUriRaw);
    fetch(uri)
      .then((res) => res.json())
      .then(setMetadata)
      .catch(() => setMetadata(null));
  }, [tokenUriRaw]);

  if (!stringId || listingId === undefined)
    return <p>Propiedad no encontrada.</p>;
  if (isLoading) return <p>Cargando propiedad...</p>;
  if (!validListing) return <p>Propiedad no encontrada.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <NFTProvider contract={nftCollectionContract} tokenId={tokenId!}>
        <div className="grid md:grid-cols-2 gap-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl overflow-hidden">
          {/* Imagen */}
          <div className="w-full h-96 md:h-full">
            <NFTMedia className="w-full h-full object-cover rounded-xl" />
          </div>

          {/* Contenido */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">
                <NFTName />
              </h1>
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                <NFTDescription />
              </p>
              <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
                Precio: {pricePerToken ? Number(pricePerToken) / 1e18 : '--'}{' '}
                POL
              </p>

              {metadata && (
                <div className="space-y-1 text-sm text-zinc-800 dark:text-zinc-200 mb-6">
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
            </div>

            {/* Botón */}
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
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Comprar
            </BuyDirectListingButton>
          </div>
        </div>
      </NFTProvider>
    </div>
  );
}
