import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import ConnectWallet from '@/components/ConnectWallet';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <header
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1rem',
            }}
          >
            <ConnectWallet />
          </header>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
