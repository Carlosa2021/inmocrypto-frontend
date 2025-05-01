'use client';

import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { mintTo } from 'thirdweb/extensions/erc721'; // O usa extensions/erc1155 si tu colección lo es
import { sendTransaction } from 'thirdweb';
import { nftCollectionContract } from '@/lib/contracts'; // Ajusta import según tu estructura
// import { client } from '@/lib/thirdweb/client-browser';

export default function CrearNFTPage() {
  const account = useActiveAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!account?.address) {
      setFeedback('Conecta tu wallet para mintear.');
      return;
    }
    if (!name || !description || !image) {
      setFeedback('Completa todos los campos e imagen.');
      return;
    }
    setLoading(true);
    try {
      // Prepara metadata para IPFS
      const imageFile = new File([image], image.name, {
        type: image.type,
      });
      // thirdweb/extensions/erc721 mintTo acepta el objeto de imagen directamente
      const tx = mintTo({
        contract: nftCollectionContract,
        to: account.address,
        nft: {
          name,
          description,
          image: imageFile,
        },
      });
      const txResult = await sendTransaction({
        transaction: tx,
        account,
      });
      setFeedback(
        '✅ NFT minteado con éxito. (Tx: ' + txResult.transactionHash + ')',
      );
      setName('');
      setDescription('');
      setImage(null);
    } catch (err: any) {
      setFeedback('Error al mintear: ' + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Crear nuevo NFT</h1>
      <form
        onSubmit={handleMint}
        className="bg-card dark:bg-zinc-900 rounded-2xl shadow-md p-8 space-y-6"
      >
        <div>
          <label className="block font-semibold mb-1">Nombre</label>
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-background"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-background"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">
            Imagen (JPG, PNG, SVG, GIF...)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="file:mr-2 file:rounded-full file:border file:px-3 file:py-1 file:bg-indigo-600 file:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl font-bold bg-indigo-600 hover:bg-pink-500 transition text-white shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Minteando NFT...' : 'Mintear NFT'}
        </button>
        {feedback && (
          <div className="mt-4 text-center text-base font-medium text-indigo-600 dark:text-pink-300">
            {feedback}
          </div>
        )}
      </form>
    </div>
  );
}
