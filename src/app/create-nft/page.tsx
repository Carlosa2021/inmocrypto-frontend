'use client';

import { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
<<<<<<< HEAD
import { uploadToIPFS } from '@/lib/thirdweb/uploadToIPFS';
import { nftCollectionContract } from '@/lib/contracts';

export default function CreateNFTPage() {
  const [imageUri, setImageUri] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const user = useActiveAccount();
  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uri = await uploadToIPFS(file);
    setImageUri(uri);
    console.log('✅ URI subida:', uri);
  };

  const handleMint = async () => {
    if (!user || !imageUri) return alert('Falta imagen o wallet no conectada');

    const transaction = prepareContractCall({
      contract: nftCollectionContract,
      method: 'function mintTo(address to, string uri)',
      params: [user.address, imageUri],
    });

    await sendTransaction(transaction);

    alert('✅ NFT creado!');
    setName('');
    setDesc('');
    setImageUri('');
=======
import { nftCollectionContract } from '@/lib/contracts';
import { uploadToIPFS } from '@/lib/thirdweb/uploadToIPFS';
import Image from 'next/image';

// Normalización robusta para IPFS (thirdweb puede retornar string o string[])
function normalizeUri(uri: string | string[] | undefined): string {
  if (!uri) return '';
  return Array.isArray(uri) ? uri[0] : uri;
}

export default function CreateNFTPage() {
  const user = useActiveAccount();
  const { mutateAsync: sendTransaction, isPending } = useSendTransaction();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Subida local y preview instantánea
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Flujo profesional: imagen → metadata → mint
  const handleMint = async () => {
    setFeedback(null);

    if (!user) return setFeedback('⚠️ Conecta tu wallet.');
    if (!imageFile) return setFeedback('⚠️ Sube una imagen.');
    if (!name.trim() || !desc.trim())
      return setFeedback('⚠️ Completa nombre y descripción.');

    setIsUploading(true);
    try {
      // 1. Sube imagen a IPFS
      const imageUriRaw = await uploadToIPFS(imageFile);
      const imageUri = normalizeUri(imageUriRaw);

      // 2. Sube METADATA a IPFS como objeto JS
      const metadata = {
        name: name.trim(),
        description: desc.trim(),
        image: imageUri,
      };
      const metadataUriRaw = await uploadToIPFS(metadata);
      const metadataUri = normalizeUri(metadataUriRaw);

      // 3. Mint
      const tx = prepareContractCall({
        contract: nftCollectionContract,
        method: 'function mintTo(address to, string uri)',
        params: [user.address, metadataUri],
      });
      await sendTransaction(tx);

      setFeedback('✅ NFT minteado con éxito.');
      setName('');
      setDesc('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error: unknown) {
      setFeedback(
        '❌ Error al mintear: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    } finally {
      setIsUploading(false);
    }
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear nuevo NFT</h1>
<<<<<<< HEAD

      <input type="file" onChange={handleUpload} className="mb-4" />

      <input
        placeholder="Nombre del NFT"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      <textarea
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      <button
        onClick={handleMint}
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? 'Minteando...' : 'Mintear NFT'}
      </button>
    </div>
  );
}
=======
      <div className="space-y-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-2"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Preview"
            width={192}
            height={192}
            className="w-48 h-48 object-cover rounded-xl border border-zinc-300 shadow mb-4"
            priority
          />
        )}
        <input
          placeholder="Nombre del NFT"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
        <textarea
          placeholder="Descripción"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="mb-2 w-full p-2 border rounded"
        />
        <button
          onClick={handleMint}
          disabled={isPending || isUploading}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending || isUploading ? 'Minteando...' : 'Mintear NFT'}
        </button>
        {feedback && (
          <div className="mt-4 text-center text-base font-medium text-green-400">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper para uploadToIPFS (en tu lib o aquí):
// export async function uploadToIPFS(data: File | object): Promise<string | string[]> { ... }
>>>>>>> e90d06be950c230c762bcd0e7d6f2084d1dc7dad
