import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: {
        default: 'Schnuffelll Shop - Digital Products Store',
        template: '%s | Schnuffelll Shop',
    },
    description: 'Toko produk digital terpercaya. Jual VPS, Pterodactyl hosting, game top up, dan akun premium dengan harga terjangkau.',
    keywords: ['vps', 'hosting', 'pterodactyl', 'game topup', 'akun premium', 'digital store'],
    authors: [{ name: 'Schnuffelll' }],
    creator: 'Schnuffelll',
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: 'https://schnuffelll.shop',
        title: 'Schnuffelll Shop - Digital Products Store',
        description: 'Toko produk digital terpercaya. VPS, Pterodactyl, Game Top Up, Akun Premium.',
        siteName: 'Schnuffelll Shop',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Schnuffelll Shop',
        description: 'Toko produk digital terpercaya',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" className="dark">
            <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
