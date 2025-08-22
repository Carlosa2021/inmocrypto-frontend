import { ThirdwebProvider } from 'thirdweb/react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { ReactNode } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InmoCrypto Marketplace',
  description: 'Tokenización de inmuebles con Web3 y Thirdweb',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThirdwebProvider>
            {/* Envolvemos todo el layout en overflow-x-hidden para evitar scroll horizontal */}
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
              {/* Navbar fijo */}
              <Navbar />

              {/* Contenido principal */}
              <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 md:px-8 py-8">
                {children}
              </main>

              {/* Footer también centrado y con padding */}
              <footer className="w-full border-t mt-12">
                <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-6">
                  <Footer />
                </div>
              </footer>
            </div>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
