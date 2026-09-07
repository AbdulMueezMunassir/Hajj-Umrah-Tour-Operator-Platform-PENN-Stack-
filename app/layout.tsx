import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'MHK Travels — Hajj & Umrah Tour Operators',
  description: 'Sri Lanka\'s trusted Hajj & Umrah travel partner.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen pt-[--header-height]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}