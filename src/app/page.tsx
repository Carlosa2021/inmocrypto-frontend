'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Margen superior para separar del navbar */}
      <div className="h-16" />

      <main className="flex flex-col items-center justify-center px-4">
        <img
          src="/images/fondo.png"
          alt="Banner Web3 Real Estate"
          className="w-full max-w-xl md:max-w-3xl rounded-3xl shadow-xl"
        />
      </main>

      <section className="w-full flex justify-center mt-10 mb-14">
        <Link href="/marketplace">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-full hover:bg-indigo-700 transition text-lg font-semibold shadow-md">
            ropiedades
          </button>
        </Link>
      </section>
    </>
  );
}
