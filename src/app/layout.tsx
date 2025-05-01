import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from 'next-themes';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
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
            {/* Contenedor principal del layout */}
            <div className="flex flex-col min-h-screen">
              {/* Navbar en la parte superior */}
              <Navbar />
              <div className="flex flex-1">
                {/* Sidebar en la parte izquierda */}
                <Sidebar />
                {/* Contenido principal */}
                <main className="flex-1 p-4 overflow-auto">{children}</main>
              </div>
            </div>
            <Footer />
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
