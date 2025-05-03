'use client';

import { useEffect, useState } from 'react';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import { marketplaceContract, nftCollectionContract } from '@/lib/contracts';
import { NFTCard } from '@/components/ui/NFTCard';
import type { DirectListing } from 'thirdweb/extensions/marketplace';
import Image from 'next/image';

export default function MarketplacePage() {
  const [listings, setListings] = useState<DirectListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await getAllListings({
          contract: marketplaceContract,
          start: 0,
          count: 20n,
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

  return (
    <div className="flex flex-col bg-background text-foreground">
      {/* Banner Hero */}
      <section className="relative overflow-hidden min-h-[380px] md:min-h-[420px] px-4 sm:px-10 py-16 flex flex-col justify-center items-center bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-700 text-white shadow-xl rounded-3xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://ipfs.io/ipfs/QmXbLGHKb4KYYq2Tzz3AYnt2ZfuAg3ykqfsPco7JriwKBN"
            alt="Banner inversión web3"
            width={1500} // elige el tamaño real de tu banner
            height={400} // el alto real deseado
            className="w-full h-full object-cover opacity-70 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/70 via-purple-900/60 to-indigo-800/90 mix-blend-multiply" />
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg text-center">
            Invierte en inmuebles reales con Web3
          </h1>
          <p className="mt-6 text-lg md:text-2xl font-medium drop-shadow-md text-white/90 text-center">
            Compra tu nueva casa con criptomonedas y{' '}
            <span className="font-bold text-emerald-300">
              recibe en euros automáticamente
            </span>
            .<br />
            Seguridad blockchain, pago inmediato, propiedad digital.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 items-center justify-center"></div>
        </div>
      </section>

      {/* Sección de propiedades en venta */}
      <section
        id="listings"
        className="max-w-7xl mx-auto mt-20 px-4 py-10 bg-white dark:bg-zinc-900 shadow-xl rounded-3xl flex-1"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-zinc-800 dark:text-white">
          Propiedades en venta
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Cargando listados...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {listings.map((listing) => (
              <NFTCard
                key={listing.id.toString()}
                listingId={Number(listing.id)}
                tokenId={Number(listing.tokenId)}
                contract={nftCollectionContract}
                price={`${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
