'use client';

import { useActiveAccount, useNFTs } from 'thirdweb/react';
import { polygon } from 'thirdweb/chains';
import { client } from '@/lib/thirdweb/client-browser';

export default function MisNfts() {
  const account = useActiveAccount();
  // Hook universal thirdweb para Polygon
  const { data: nfts, isLoading } = useNFTs({
    address: account?.address || '',
    client,
    chain: polygon,
  });

  return (
    <section className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Mis NFTs</h2>
      {!account?.address && <p>Conecta tu wallet para ver tus NFTs.</p>}
      {isLoading ? (
        <p>Cargando NFTs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts && nfts.length > 0 ? (
            nfts.map((nft) => (
              <div
                key={nft.contractAddress + '-' + nft.tokenId}
                className="border p-4 rounded-xl flex flex-col items-center bg-white shadow-md"
              >
                {nft.metadata?.image && (
                  <img
                    src={nft.metadata.image}
                    alt={nft.metadata.name}
                    className="h-36 w-36 object-cover rounded-md mb-3"
                  />
                )}
                <p className="font-semibold text-lg mb-1">
                  {nft.metadata?.name || `ID #${nft.tokenId}`}
                </p>
                <code className="text-xs text-gray-500 break-all mb-2">
                  {nft.contractAddress}
                </code>
                {nft.balance && (
                  <p className="text-xs text-gray-700">
                    Cantidad: {nft.balance}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No tienes NFTs en tu wallet de Polygon.</p>
          )}
        </div>
      )}
    </section>
  );
}
