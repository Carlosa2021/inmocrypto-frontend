'use client';

import { useEffect, useState, useMemo } from 'react';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import {
  marketplaceContract,
  nftCollectionContract,
  erc1155CollectionContract, // importa tu contrato 1155
} from '@/lib/contracts';
import { NFTCard } from '@/components/ui/NFTCard';
import type { DirectListing } from 'thirdweb/extensions/marketplace';

// Puedes ajustar según tus filtros:
type SortKey = 'recent' | 'low-high' | 'high-low';

export default function MarketplacePage() {
  const [listings, setListings] = useState<DirectListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getAllListings({
      contract: marketplaceContract,
      start: 0,
      count: 50n,
    })
      .then((data) => {
        if (!isMounted) return;
        setListings(data as DirectListing[]);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
        if (isMounted)
          setError('Error al cargar los listados. Intenta de nuevo...');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // useMemo para filtros y orden (óptimo)
  const filteredListings = useMemo(() => {
    const term = search.toLowerCase();
    const filtered = listings.filter(
      (l) =>
        (l.asset?.metadata?.name?.toLowerCase() ?? '').includes(term) ||
        (l.asset?.metadata?.description?.toLowerCase() ?? '').includes(term),
    );
    return filtered.sort((a, b) => {
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
      // 'recent' por fecha de inicio, descendente
      return Number(b.startTimeInSeconds) - Number(a.startTimeInSeconds);
    });
  }, [listings, search, sort]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <section className="relative py-12 md:py-24 bg-gradient-to-b from-indigo-50 to-transparent dark:from-zinc-900">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
            Marketplace Inmobiliario Web3
          </h1>
          <p className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-300">
            Compra o explora propiedades tokenizadas como NFTs en Polygon.
            Seguro, rápido y abierto.
          </p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto mt-10 px-4 flex flex-col md:flex-row items-center gap-6">
        <input
          type="text"
          value={search}
          placeholder="Buscar NFT por nombre o descripción"
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-full px-5 py-3 text-lg w-full md:w-96 transition"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="border rounded-full px-5 py-3 text-lg transition"
        >
          <option value="recent">Agregados recientemente</option>
          <option value="low-high">Precio: de menor a mayor</option>
          <option value="high-low">Precio: de mayor a menor</option>
        </select>
      </section>
      <section
        id="listings"
        className="max-w-7xl mx-auto mt-8 px-4 py-10 flex-1"
      >
        <h2 className="text-3xl font-bold mb-14 text-center">Inmuebles Web3</h2>
        {loading ? (
          <p className="text-center text-gray-500 text-lg">
            Cargando listados...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : filteredListings.length === 0 ? (
          <p className="text-center text-zinc-400 text-lg">
            No se encontraron propiedades para tu búsqueda.
          </p>
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
