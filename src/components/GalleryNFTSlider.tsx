'use client';

import { useRouter } from 'next/navigation';
import { NFTProvider, NFTMedia, NFTName, NFTDescription } from 'thirdweb/react';
import type { ThirdwebContract } from 'thirdweb';
import { Card, CardContent } from '@/components/ui/card';
import * as React from 'react';

// Tipos estrictos para props
interface NFT {
  listingId: number;
  tokenId: number;
  contract: ThirdwebContract;
  price: string;
}

interface GallerySliderProps {
  nfts: NFT[];
}

// Componente Skeleton para estado de carga
function ImageSkeleton() {
  return (
    <div className="w-full h-full animate-pulse rounded-xl bg-gradient-to-br from-zinc-200/80 to-indigo-200/50 dark:from-zinc-800 dark:to-indigo-950" />
  );
}

export default function GalleryNFTSlider({ nfts }: GallerySliderProps) {
  const router = useRouter();
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  // Actualización de sombras-scroll a los costados
  React.useEffect(() => {
    // Copias la referencia actual en una variable local
    const el = sliderRef.current;
    if (!el) return;
    const updateShadow = () => {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth - 10);
    };
    updateShadow();
    el.addEventListener('scroll', updateShadow);
    window.addEventListener('resize', updateShadow);
    // En el cleanup usas ESA MISMA variable (el)
    return () => {
      el.removeEventListener('scroll', updateShadow);
      window.removeEventListener('resize', updateShadow);
    };
  }, []);

  // Función para scroll lateral con flechas
  const scrollBy = (amount: number) => {
    sliderRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  if (!nfts?.length) {
    return (
      <div className="w-full py-10 text-center text-zinc-400 dark:text-zinc-600 text-lg font-medium">
        No hay NFTs para mostrar.
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Flecha izquierda */}
      {canScrollLeft && (
        <button
          aria-label="Ver anteriores"
          onClick={() => scrollBy(-320)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white/90 dark:from-zinc-900/80 to-transparent p-2 rounded-full shadow-lg hover:bg-white/95 dark:hover:bg-zinc-900/95 transition"
        >
          <span className="text-2xl text-indigo-400">&lsaquo;</span>
        </button>
      )}
      {/* Flecha derecha */}
      {canScrollRight && (
        <button
          aria-label="Ver siguientes"
          onClick={() => scrollBy(320)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white/90 dark:from-zinc-900/80 to-transparent p-2 rounded-full shadow-lg hover:bg-white/95 dark:hover:bg-zinc-900/95 transition"
        >
          <span className="text-2xl text-indigo-400">&rsaquo;</span>
        </button>
      )}

      {/* Carrusel horizontal */}
      <div
        className="flex gap-6 p-4 min-w-max max-w-full overflow-x-auto scroll-smooth snap-x snap-mandatory"
        ref={sliderRef}
        tabIndex={0}
        aria-label="Galería de NFTs"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        {nfts.map((nft) => (
          <div
            key={nft.listingId}
            onClick={() =>
              router.push(`/marketplace/detalles_propiedad/${nft.listingId}`)
            }
            className="cursor-pointer min-w-[260px] max-w-[280px] flex-shrink-0 snap-start outline-none focus-visible:ring-2 focus-visible:ring-pink-600 transition-transform"
            tabIndex={0}
            aria-label={`Ir a detalles de propiedad NFT ${nft.listingId}`}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push(`/marketplace/detalles_propiedad/${nft.listingId}`);
              }
            }}
            title={`Ver detalles de NFT #${nft.tokenId}`}
          >
            <NFTProvider contract={nft.contract} tokenId={BigInt(nft.tokenId)}>
              <Card className="rounded-2xl shadow-md overflow-hidden bg-white dark:bg-zinc-900 transition-transform duration-200 hover:scale-105">
                <div className="w-full h-52">
                  <NFTMedia
                    className="w-full h-full object-cover rounded-xl"
                    loadingComponent={<ImageSkeleton />}
                    fallbackComponent={
                      <div className="w-full h-full flex items-center justify-center font-bold text-base text-zinc-400">
                        Imagen no disponible
                      </div>
                    }
                  />
                </div>
                <CardContent className="p-3">
                  <NFTName className="text-md font-bold text-zinc-800 dark:text-zinc-100 truncate mb-1" />
                  <NFTDescription
                    className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2"
                    style={{
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  />
                  <p className="text-sm font-semibold mt-2 text-indigo-700 dark:text-indigo-300">
                    Precio: {nft.price}
                  </p>
                </CardContent>
              </Card>
            </NFTProvider>
          </div>
        ))}
      </div>
      {/* Sombra sutil responsive UX */}
      <div
        className={`pointer-events-none absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white via-transparent to-transparent dark:from-zinc-900 z-5 ${
          canScrollLeft ? '' : 'opacity-0'
        }`}
      />
      <div
        className={`pointer-events-none absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white via-transparent to-transparent dark:from-zinc-900 z-5 ${
          canScrollRight ? '' : 'opacity-0'
        }`}
      />
    </div>
  );
}
