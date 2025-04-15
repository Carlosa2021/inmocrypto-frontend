'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resolveIPFS } from '@/lib/utils';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      // 👉 Aquí coloca la URI de la imagen del NFT que estás viendo en Thirdweb
      const url = resolveIPFS(
        'ipfs://QmWbJaa5sGZkPWnnS41Tkfp4yUY6mQy6ksvGXQdxJJcGvG',
      );
      console.log('✅ URL IPFS resuelta:', url);

      setImageUrl(url);
    };

    loadImage();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-8 text-center rounded-b-3xl shadow-lg">
        <h1 className="text-4xl font-bold">
          Compra tu nueva casa con criptomonedas
        </h1>
        <p className="text-lg mt-2">Recibe el vendedor euros automáticamente</p>
        <div className="mt-6">
          <Button size="lg" onClick={() => router.push('/marketplace')}>
            Explorar Propiedades
          </Button>
        </div>
      </section>

      {/* Hot NFTs */}
      <section className="max-w-7xl mx-auto mt-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Hot NFTs</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar inmueble..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <Card
              key={idx}
              className="hover:shadow-xl transition-all cursor-pointer"
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Propiedad"
                  width={400}
                  height={300}
                  className="rounded-t-2xl w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">Miami - MIA-1</h3>
                <p className="text-sm text-muted-foreground">0.2 ETH</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
