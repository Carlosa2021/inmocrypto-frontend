'use client';

export default function Home() {
  const scrollToMarketplace = () => {
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <main
        className="relative min-h-[110vh] flex items-center justify-center text-center px-4 py-16 bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={{
          backgroundImage: "url('/images/fondo.png')",
        }}
      >
        {/* Solo imagen como banner visual */}
      </main>

      <section className="w-full flex justify-center py-10 ">
        <button
          onClick={scrollToMarketplace}
          className="bg-indigo-600 text-white px-8 py-4 rounded-full hover:bg-indigo-700 transition text-lg font-semibold shadow-md"
        >
          Ver propiedades
        </button>
      </section>
    </>
  );
}
