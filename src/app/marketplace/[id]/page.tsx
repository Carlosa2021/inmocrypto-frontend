'use client';
<<<<<<< HEAD

import { useParams } from 'next/navigation';
import {
  useReadContract,
  useSendTransaction,
  useActiveAccount,
=======
import { useParams } from 'next/navigation';
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
  NFTProvider,
  NFTMedia,
  NFTName,
  NFTDescription,
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
<<<<<<< HEAD
import { nftCollectionContract, marketplaceContract } from '@/lib/contracts';
import { Button } from '@/components/ui/button';
import type { DirectListing } from 'thirdweb/extensions/marketplace';

export default function PropertyPage() {
  const { id } = useParams();
  const account = useActiveAccount();

  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method: 'getListing',
    params: [BigInt(id)],
  });

  const { mutate: buyNow, isPending: isBuying } = useSendTransaction();

  if (isLoading) return <p>Cargando propiedad...</p>;
  if (!listingRaw) return <p>Propiedad no encontrada.</p>;

  const listing = listingRaw as DirectListing;
=======
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import type { DirectListing } from 'thirdweb/extensions/marketplace';
import { useState } from 'react';

// Hook robusto para obtener el id de la propiedad (BigInt siempre)
function useListingId(): bigint | undefined {
  const params = useParams();
  const idRaw = params?.id;
  if (typeof idRaw === 'string' && idRaw) return BigInt(idRaw);
  if (Array.isArray(idRaw) && idRaw.length > 0 && idRaw[0])
    return BigInt(idRaw[0]);
  return undefined;
}

export default function PropertyPage() {
  const listingId = useListingId();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Lee la data del listing usando thirdweb/react hook
  const { data: listingRaw, isLoading } = useReadContract({
    contract: marketplaceContract,
    method: 'getListing',
    params: [listingId ?? 0n], // Usa 0n si es indefinido para evitar errores de contrato
  });

  let listing: MarketplaceListingWithType | null = null;
  if (isListingObject(listingRaw)) {
    // Object/struct shape (preferred in modern SDK)
    const raw = listingRaw;
    listing = {
      id: String(raw['listingId'] ?? raw['id'] ?? ''),
      listingId: String(raw['listingId'] ?? raw['id'] ?? ''),
      tokenId: raw['tokenId'] as string | number | bigint,
      quantity: (raw['quantity'] as string | number | bigint) ?? 1,
      pricePerToken: raw['pricePerToken'] as string | number | bigint,
      assetContractAddress: raw['assetContract'] as string,
      tokenType: Number(raw['tokenType'] ?? 0),
      currencyValuePerToken: raw[
        'currencyValuePerToken'
      ] as MarketplaceListingWithType['currencyValuePerToken'],
    };
  } else if (Array.isArray(listingRaw) && listingRaw.length >= 10) {
    // fallback for legacy tuple array
    listing = {
      id: listingRaw[0] as string | number | bigint,
      listingId: listingRaw[0] as string | number | bigint,
      tokenId: listingRaw[1] as string | number | bigint,
      quantity: listingRaw[2] as string | number | bigint,
      pricePerToken: listingRaw[3] as string | number | bigint,
      assetContractAddress: listingRaw[7] as string,
      tokenType: Number(listingRaw[9] ?? 0),
      currencyValuePerToken: undefined,
    };
  }

  const notFound =
    !idString ||
    idString === '0' ||
    !listingRaw ||
    listingId === 0n ||
    !listing;

  function getNftContract(addr: string) {
    if (addr.toLowerCase() === nftCollectionContract.address.toLowerCase()) {
      return nftCollectionContract;
    }
    if (
      addr.toLowerCase() === erc1155CollectionContract.address.toLowerCase()
    ) {
      return erc1155CollectionContract;
    }
    return nftCollectionContract;
  }

  const nftContract =
    listing && listing.assetContractAddress
      ? getNftContract(listing.assetContractAddress)
      : nftCollectionContract;

  const tokenId = listing?.tokenId ? BigInt(listing.tokenId) : 0n;
  const isERC1155 = listing?.tokenType === 1;

  const { data: totalSupply1155, isLoading: supplyLoading } = useReadContract({
    contract: nftContract,
    method: 'totalSupply',
    params: [tokenId],
    queryOptions: { enabled: isERC1155 && !!tokenId },
  });

  const supplyAvailable = useMemo(() => {
    const listingQty = listing?.quantity ? Number(listing.quantity) : 1;
    const onChainSupply = totalSupply1155
      ? Number(totalSupply1155)
      : listingQty;
    return isERC1155 ? Math.min(listingQty, onChainSupply) : 1;
  }, [listing?.quantity, totalSupply1155, isERC1155]);

  const [quantityToBuy, setQuantityToBuy] = useState(1);
  const account = useActiveAccount();
  const { mutateAsync: buyNow, isPending: isBuying } = useSendTransaction();

  const notFound =
    !listingId ||
    listingId === 0n ||
    !listingRaw ||
    (typeof listingRaw === 'string' && !listingRaw);

  if (isLoading) return <p className="p-8 text-xl">Cargando propiedad...</p>;
  if (notFound)
    return <p className="p-8 text-xl text-red-600">Propiedad no encontrada.</p>;

  const listing = listingRaw as unknown as DirectListing;

  // Handler profesional para comparar y feedback
  const handleBuy = async () => {
    setFeedback(null);
    if (!account) {
      setFeedback('⚠️ Conecta tu wallet para comprar.');
      return;
    }
    try {
      const transaction = prepareContractCall({
        contract: marketplaceContract,
        method:
          'function buyFromListing(uint256 listingId, uint256 quantityToBuy, address recipient)',
        params: [BigInt(listing.id), 1n, account.address],
      });
      await buyNow(transaction);
      setFeedback('✅ ¡Compra realizada con éxito!');
    } catch (error: unknown) {
      setFeedback(
        '❌ Error al comprar: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  };
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad

  return (
    <div className="max-w-4xl mx-auto p-8">
      <NFTProvider
        contract={nftCollectionContract}
        tokenId={BigInt(listing.tokenId)}
      >
<<<<<<< HEAD
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
                  method: 'buyFromListing',
                  params: [BigInt(listing.id), 1, account?.address || ''],
                });
                buyNow(transaction);
              }}
            >
              {isBuying ? 'Comprando...' : 'Comprar'}
            </Button>
=======
        <div className="rounded-xl overflow-hidden shadow-xl bg-white dark:bg-zinc-900">
          <NFTMedia className="w-full h-96 object-cover bg-zinc-100 dark:bg-zinc-800" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
              <NFTName />
              {isERC1155 ? (
                <span className="px-2 text-xs font-semibold rounded bg-indigo-100 text-indigo-700">
                  ERC-1155
                </span>
              ) : (
                <span className="px-2 text-xs font-semibold rounded bg-green-100 text-green-700">
                  ERC-721
                </span>
              )}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-6">
              <NFTDescription />
            </p>
            <p className="text-2xl font-semibold mb-4">
              Precio:{' '}
              <span className="text-indigo-600">
                {listing.currencyValuePerToken.displayValue}
              </span>{' '}
              <span className="uppercase">
                {listing.currencyValuePerToken.symbol}
              </span>
            </p>
            {isERC1155 && (
              <div className="mb-4 text-purple-600 text-lg flex items-center gap-4">
                NFTs disponibles: <b>{supplyAvailable}</b>
                <span>
                  <input
                    type="number"
                    min={1}
                    max={supplyAvailable}
                    step={1}
                    value={quantityToBuy}
                    className="border rounded px-2 py-1 w-[70px] text-center"
                    onChange={(e) => {
                      let v = Number(e.target.value);
                      if (isNaN(v) || v < 1) v = 1;
                      if (v > supplyAvailable) v = supplyAvailable;
                      setQuantityToBuy(v);
                    }}
                  />
                </span>
              </div>
            )}
            <Button
              disabled={isBuying || !account}
              onClick={handleBuy}
              className="w-full py-3 text-lg font-bold"
            >
              {isBuying ? 'Comprando...' : 'Comprar'}
            </Button>
            {feedback && (
              <div className="mt-5 text-center text-red-500 dark:text-red-400 font-medium">
                {feedback}
              </div>
            )}
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
          </div>
        </div>
      </NFTProvider>
    </div>
  );
}
