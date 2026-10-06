import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MHK Travels — Hajj & Umrah Tour Operators Sri Lanka',
  description:
    "Sri Lanka's trusted Hajj & Umrah tour operator. Premium packages with 5-star hotels, direct flights, and PayHere 20% advance booking.",
  keywords: [
    'Hajj',
    'Umrah',
    'Sri Lanka',
    'Pilgrimage',
    'MHK Travels',
    'Colombo',
    'Makkah',
    'Madinah',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
            <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-jakarta bg-surface text-on-surface antialiased">
        <Header />
        <main className="pt-[168px] min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}