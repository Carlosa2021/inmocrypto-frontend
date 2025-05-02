'use client';

import { useActiveAccount } from 'thirdweb/react';
import { getOwnedNFTs } from 'thirdweb/extensions/erc721';
import { useEffect, useState } from 'react';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import { Card, CardContent } from '@/components/ui/card';
import { nftCollectionContract } from '@/lib/contracts';

// Ajusta el tipo según la estructura real de tu contrato/NFT
interface OwnedNFT {
  id: bigint;
  // Si necesitas más campos, agrégalos aquí.
}

export default function MisNFTsPage() {
  const account = useActiveAccount();
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account?.address) {
        setNfts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const nfts721 = await getOwnedNFTs({
          contract: nftCollectionContract,
          owner: account.address,
        });
        setNfts(nfts721);
      } catch (err) {
        console.error('Error al obtener NFTs:', err);
        setNfts([]);
      }
      setLoading(false);
    };
    fetchNFTs();
    // Elimina 'nftCollectionContract' del array de dependencias, sólo deja variables primitivas
  }, [account?.address]);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Mis NFTs</h1>
      {loading ? (
        <div className="text-lg mt-12 text-gray-500">Cargando tus NFTs...</div>
      ) : nfts.length === 0 ? (
        <div className="mt-16 text-center text-xl font-semibold text-muted-foreground">
          No tienes NFTs en esta wallet <br />
          <span className="text-base font-normal">
            (Asegúrate de estar en la red correcta y con la wallet conectada)
          </span>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
          {nfts.map((nft) => (
            <NFTProvider
              contract={nftCollectionContract}
              tokenId={nft.id}
              key={nft.id.toString()}
            >
              <Card className="rounded-2xl shadow-md hover:scale-105 bg-card dark:bg-zinc-900 transition-transform cursor-pointer overflow-hidden">
                <div className="w-full h-60 bg-card dark:bg-zinc-900">
                  <NFTMedia className="w-full h-full object-cover rounded-t-2xl bg-card dark:bg-zinc-900" />
                </div>
                <CardContent className="p-4 flex flex-col gap-2">
                  <NFTName className="text-lg font-bold truncate text-foreground" />
                  <NFTDescription className="text-xs text-muted-foreground line-clamp-2" />
                </CardContent>
              </Card>
            </NFTProvider>
          ))}
        </div>
      )}
    </div>
  );
}
