'use client';

import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { nftCollectionContract } from '@/lib/contracts';
import { Button } from '@/components/ui/button';

export default function CreateNFT() {
  const account = useActiveAccount();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [minting, setMinting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dirección del owner/admin (ajusta si es diferente)
  const contractOwner =
    '0xA62FeC1444118BD0e80c6cdA6a4873144ECe21ca'.toLowerCase();
  const isAdmin = account?.address?.toLowerCase() === contractOwner;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!account || !account.address) {
      setError('Conecta tu wallet de admin.');
      return;
    }
    if (!name || !desc || !image) {
      setError('Completa todos los campos e imagen.');
      return;
    }
    setMinting(true);
    try {
      // Sube imagen a IPFS con thirdweb
      const imgRes = await fetch('/api/thirdweb/upload', {
        method: 'POST',
        body: image,
      });
      if (!imgRes.ok) throw new Error('Error subiendo la imagen a IPFS.');
      const ipfsUrl = await imgRes.text();
      // Crea el objeto metadata
      const metadata = {
        name,
        description: desc,
        image: ipfsUrl,
      };
      // Sube metadata JSON a IPFS
      const metaRes = await fetch('/api/thirdweb/upload', {
        method: 'POST',
        body: JSON.stringify(metadata),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!metaRes.ok) throw new Error('Error subiendo la metadata a IPFS.');
      const metaUri = await metaRes.text();
      // Llama el mint (solo admin)
      // thirdweb v5: contract.write.mintTo([address, tokenURI])
      // O usa TransactionButton si necesitas feedback visual
      await nftCollectionContract.write.mintTo([account.address, metaUri]);
      setSuccess('NFT creado con éxito: ' + metaUri);
      setName('');
      setDesc('');
      setImage(null);
    } catch (err: any) {
      setError('Error al mintear: ' + (err.message || err.toString()));
    } finally {
      setMinting(false);
    }
  };

  if (!isAdmin)
    return (
      <div className="p-6 text-red-600 font-semibold">
        Acceso solo para el owner/admin.
      </div>
    );

  return (
    <section className="max-w-lg mx-auto bg-white shadow rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6">Crear NFT</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Descripción</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={minting || !image}
          className="w-full text-lg"
        >
          {minting ? 'Creando NFT...' : 'Crear NFT'}
        </Button>
      </form>
      {success && <div className="mt-4 text-green-600">{success}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </section>
  );
}
