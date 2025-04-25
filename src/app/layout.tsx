import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThirdwebProvider } from 'thirdweb/react';
import { Navbar } from '@/components/Navbar';

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
  // Si quieres manejar dark/light global, usa una librería tipo next-themes,
  // o props/className simples:
  // const [isDarkMode, setIsDarkMode] = useState(false);
  // <html lang="es" className={isDarkMode ? 'dark' : ''}>
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProvider>
          <Navbar />
          <header className="flex justify-end p-4 bg-transparent" />
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
