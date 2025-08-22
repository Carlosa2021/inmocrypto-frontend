'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      {/* Hero principal con fondo inmobiliario, con llamada de acción clara */}
      <section className="w-full flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-tr from-indigo-100/50 via-white to-indigo-50/20 px-6 pt-20 pb-10">
        <div className="flex flex-col items-center max-w-2xl text-center gap-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-indigo-800 drop-shadow-sm">
            Crea, descubre y comparte NFTs irrepetibles para tus mejores
            recuerdos.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Nuestro marketplace te permite transformar cualquier momento
            —familiar, social, corporativo o personal— en un NFT único. Celebra
            bautizos, bodas, logros y acontecimientos especiales con tecnología
            Web3, IA y la seguridad de Polygon.
          </p>
          <Link href="/marketplace">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-full hover:bg-indigo-700 transition text-lg font-semibold shadow-lg mt-4">
              Explorar momentos y eventos
            </button>
          </Link>
        </div>
        {/* Imagen de portada representativa */}
        <Image
          src="/images/fondo.png"
          alt="Banner Web3 Real Estate"
          width={1200} // Usa el ancho real o el máximo útil para el diseño
          height={600} // Lo mismo para alto (debe ser un número)
          className="mt-12 w-full max-w-3xl rounded-3xl shadow-xl border"
          priority // Opcional: para hero arriba de todo, carga antes
          quality={90} // Opcional: controla compresión, 75-90 ideal
          sizes="(max-width: 1200px) 100vw, 1200px" // Responsive
        />
        ;
      </section>

      {/* Sección de beneficios/valores del marketplace */}
      <section className="w-full flex flex-col md:flex-row justify-center items-stretch gap-10 py-14 bg-white border-t">
        <div className="flex-1 px-4 max-w-xs text-center">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">
            Comparte tu experiencia las 24/7
          </h3>
          <p className="text-gray-500">
            Inmortaliza y comparte cualquier logro o evento: familiar, social o
            empresarial, con colecciones únicas o ediciones especiales.
          </p>
        </div>
        <div className="flex-1 px-4 max-w-xs text-center">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">
            Creador manual & IA integrada
          </h3>
          <p className="text-gray-500">
            Crea tu NFT desde cero con tu propio diseño o deja que nuestra IA te
            ayude a generar arte y metadata únicos.
          </p>
        </div>
        <div className="flex-1 px-4 max-w-xs text-center">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">
            Propiedad & seguridad Web3
          </h3>
          <p className="text-gray-500">
            Todos los NFTs existen en Polygon y están protegidos por contratos
            inteligentes. Autenticidad, verificación y true ownership.
          </p>
        </div>
      </section>

      {/* Llamado secundario */}
      <section className="flex flex-col items-center justify-center py-14 bg-indigo-50 border-t border-indigo-100">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-800">
          ¿Quieres crear tu propio NFT de un momento especial?
        </h2>
        <Link href="/crear-nft">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white px-7 py-3 rounded-full text-base font-bold shadow-md">
            Empieza ahora
          </button>
        </Link>
      </section>
    </>
  );
}
