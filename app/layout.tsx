import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NavBar from '@/components/NavBar';
import './globals.css';
import dynamic from 'next/dynamic';

const AuthProvider = dynamic(() => import('@/lib/useAuth').then(mod => mod.AuthProvider), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Streakr AFL 2026',
  description: 'AFL Player Props, Perfected.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0F1115] text-[#EEE]`}>
        <NavBar />
        <main className="container mx-auto px-6 py-8">
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
