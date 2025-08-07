'use client';

import { useEffect, useState } from 'react';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import {
  marketplaceContract,
  nftCollectionContract,
  erc1155CollectionContract, // importa tu contrato 1155
} from '@/lib/contracts';
import { NFTCard } from '@/components/ui/NFTCard';
import type { DirectListing } from 'thirdweb/extensions/marketplace';

export default function MarketplacePage() {
  const [listings, setListings] = useState<DirectListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<'recent' | 'low-high' | 'high-low'>(
    'recent',
  );

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await getAllListings({
          contract: marketplaceContract,
          start: 0,
          count: 50n,
        });
        setListings(data as DirectListing[]);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, []);

  // Detecta la colección a la que pertenece el NFT
  function getCollectionContract(assetContractAddress: string) {
    if (
      assetContractAddress.toLowerCase() ===
      nftCollectionContract.address.toLowerCase()
    ) {
      return nftCollectionContract;
    }
    if (
      assetContractAddress.toLowerCase() ===
      erc1155CollectionContract.address.toLowerCase()
    ) {
      return erc1155CollectionContract;
    }
    return null;
  }

  // Filtrado y ordenamiento exactamente igual
  const filteredListings = listings
    .filter(
      (l) =>
        (l.asset?.metadata?.name?.toLowerCase() ?? '').includes(
          search.toLowerCase(),
        ) ||
        (l.asset?.metadata?.description?.toLowerCase() ?? '').includes(
          search.toLowerCase(),
        ),
    )
    .sort((a, b) => {
      if (sort === 'low-high') {
        return (
          Number(a.currencyValuePerToken.value) -
          Number(b.currencyValuePerToken.value)
        );
      } else if (sort === 'high-low') {
        return (
          Number(b.currencyValuePerToken.value) -
          Number(a.currencyValuePerToken.value)
        );
      }
      return Number(b.startTimeInSeconds) - Number(a.startTimeInSeconds);
    });

  return (
    <div className="flex flex-col bg-background text-foreground">
      <section className="relative ...">{/* ... banner ... */}</section>

      <section className="max-w-7xl mx-auto mt-10 px-4 flex flex-col md:flex-row items-center gap-6">
        <input
          type="text"
          value={search}
          placeholder="Buscar NFT por nombre o descripción"
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-full px-5 py-3 text-lg w-full md:w-96"
        />
        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as 'recent' | 'low-high' | 'high-low')
          }
          className="border rounded-full px-5 py-3 text-lg"
        >
          <option value="recent">Agregados recientemente</option>
          <option value="low-high">Precio: de menor a mayor</option>
          <option value="high-low">Precio: de mayor a menor</option>
        </select>
      </section>

      <section id="listings" className="max-w-7xl mx-auto mt-8 px-4 py-10 ...">
        <h2 className="text-3xl font-bold mb-14 text-center">Inmuebles Web3</h2>
        {loading ? (
          <p className="text-center text-gray-500">Cargando listados...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredListings.map((listing) => {
              const contract = getCollectionContract(
                listing.assetContractAddress,
              );
              if (!contract) return null;
              return (
                <NFTCard
                  key={listing.id.toString()}
                  listingId={Number(listing.id)}
                  tokenId={Number(listing.tokenId)}
                  contract={contract}
                  price={`${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
