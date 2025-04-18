'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllListings } from 'thirdweb/extensions/marketplace';
import { marketplaceContract, nftCollectionContract } from '@/lib/contracts';
import { NFTCard } from '@/components/ui/NFTCard';
import { Button } from '@/components/ui/button';
import ConnectWallet from '@/components/ConnectWallet';

export default function MarketplacePage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListings = async () => {
      try {
        const data = await getAllListings({
          contract: marketplaceContract,
          start: 0n,
          count: 20n,
        });
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-8 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl font-bold">
          Compra tu nueva casa con criptomonedas
        </h1>
        <p className="text-lg mt-2">Recibe el vendedor euros automáticamente</p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <Button size="lg" onClick={() => router.push('/marketplace')}>
            Explorar Propiedades
          </Button>
          <ConnectWallet />
        </div>
      </section>

      <section className="max-w-7xl mx-auto mt-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Propiedades en venta</h2>
        {loading ? (
          <p>Cargando listados...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <NFTCard
                key={listing.id.toString()}
                tokenId={listing.tokenId}
                contract={nftCollectionContract}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
