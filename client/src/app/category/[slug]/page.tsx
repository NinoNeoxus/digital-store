import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    Server,
    Gamepad2,
    Coins,
    Crown,
    ArrowLeft
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Kategori',
    description: 'Jelajahi produk berdasarkan kategori',
};

// Static categories
const categoriesData: Record<string, {
    name: string;
    description: string;
    icon: typeof Server;
    products: Array<{
        id: string;
        name: string;
        slug: string;
        shortDesc: string;
        thumbnail: string;
        priceRange: { min: number; max: number };
        variants: Array<{ name: string; price: number }>;
    }>;
}> = {
    'vps-server': {
        name: 'VPS & Server',
        description: 'Virtual Private Server dengan performa tinggi untuk website dan aplikasi',
        icon: Server,
        products: [
            {
                id: '1',
                name: 'VPS High Performance',
                slug: 'vps-high-performance',
                shortDesc: 'VPS Indonesia dengan SSD NVMe dan uptime 99.9%',
                thumbnail: '/images/products/vps-server.png',
                priceRange: { min: 50000, max: 400000 },
                variants: [
                    { name: 'Starter - 1GB RAM', price: 50000 },
                    { name: 'Basic - 2GB RAM', price: 100000 },
                ],
            },
            {
                id: '2',
                name: 'VPS Standard',
                slug: 'vps-standard',
                shortDesc: 'VPS dengan performa stabil untuk website',
                thumbnail: '/images/products/vps-server.png',
                priceRange: { min: 75000, max: 300000 },
                variants: [
                    { name: '2GB RAM', price: 75000 },
                    { name: '4GB RAM', price: 150000 },
                ],
            },
        ],
    },
    'pterodactyl': {
        name: 'Pterodactyl Panel',
        description: 'Game server hosting dengan panel Pterodactyl yang mudah digunakan',
        icon: Gamepad2,
        products: [
            {
                id: '3',
                name: 'Minecraft Server Hosting',
                slug: 'minecraft-server-hosting',
                shortDesc: 'Server Minecraft dengan panel mudah dan setup instan',
                thumbnail: '/images/products/minecraft-server.png',
                priceRange: { min: 35000, max: 120000 },
                variants: [
                    { name: '2GB RAM (10-15 Players)', price: 35000 },
                    { name: '4GB RAM (20-30 Players)', price: 65000 },
                ],
            },
        ],
    },
    'game-topup': {
        name: 'Game Top Up',
        description: 'Top up diamond, UC, dan mata uang game lainnya dengan harga terbaik',
        icon: Coins,
        products: [
            {
                id: '4',
                name: 'Mobile Legends Diamonds',
                slug: 'mobile-legends-diamonds',
                shortDesc: 'Top up diamond ML murah dan instan',
                thumbnail: '/images/products/mobile-legends.png',
                priceRange: { min: 19000, max: 456000 },
                variants: [
                    { name: '86 Diamonds', price: 19000 },
                    { name: '172 Diamonds', price: 38000 },
                ],
            },
            {
                id: '5',
                name: 'Free Fire Diamonds',
                slug: 'free-fire-diamonds',
                shortDesc: 'Top up diamond Free Fire cepat & murah',
                thumbnail: '/images/products/free-fire.png',
                priceRange: { min: 15000, max: 350000 },
                variants: [
                    { name: '100 Diamonds', price: 15000 },
                    { name: '310 Diamonds', price: 45000 },
                ],
            },
            {
                id: '6',
                name: 'Valorant Points',
                slug: 'valorant-points',
                shortDesc: 'Top up VP Valorant instant',
                thumbnail: '/images/products/valorant.png',
                priceRange: { min: 16000, max: 800000 },
                variants: [
                    { name: '125 VP', price: 16000 },
                    { name: '420 VP', price: 50000 },
                ],
            },
        ],
    },
    'akun-premium': {
        name: 'Akun Premium',
        description: 'Akun premium Netflix, Spotify, dan layanan streaming lainnya',
        icon: Crown,
        products: [
            {
                id: '7',
                name: 'Netflix Premium',
                slug: 'netflix-premium',
                shortDesc: 'Akun Netflix Private, UHD 4K, Full Garansi',
                thumbnail: '/images/products/netflix.png',
                priceRange: { min: 45000, max: 400000 },
                variants: [
                    { name: '1 Bulan', price: 45000 },
                    { name: '3 Bulan', price: 120000 },
                ],
            },
            {
                id: '8',
                name: 'Spotify Premium',
                slug: 'spotify-premium',
                shortDesc: 'Akun Spotify Premium tanpa iklan',
                thumbnail: '/images/products/spotify.png',
                priceRange: { min: 15000, max: 150000 },
                variants: [
                    { name: '1 Bulan', price: 15000 },
                    { name: '6 Bulan', price: 75000 },
                ],
            },
        ],
    },
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
    const category = categoriesData[params.slug];

    if (!category) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold">Kategori Tidak Ditemukan</h1>
                    <p className="text-muted-foreground">
                        Kategori yang kamu cari tidak ada.
                    </p>
                    <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Lihat Semua Produk
                    </Link>
                </div>
            </div>
        );
    }

    const Icon = category.icon;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-card/50 border-b border-white/5">
                <div className="container py-8">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-foreground">Produk</Link>
                        <span>/</span>
                        <span className="text-foreground">{category.name}</span>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/20 rounded-xl">
                            <Icon className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{category.name}</h1>
                            <p className="text-muted-foreground mt-1">{category.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container py-8">
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-muted-foreground">
                        Menampilkan {category.products.length} produk
                    </p>
                    <select className="px-4 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="newest">Terbaru</option>
                        <option value="price-low">Harga: Rendah ke Tinggi</option>
                        <option value="price-high">Harga: Tinggi ke Rendah</option>
                    </select>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group glass-card overflow-hidden product-card"
                        >
                            {/* Image */}
                            <div className="aspect-video relative overflow-hidden">
                                <Image
                                    src={product.thumbnail}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.shortDesc}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {product.variants.slice(0, 2).map((v, i) => (
                                        <span key={i} className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                                            {v.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Mulai dari</span>
                                        <p className="text-lg font-bold text-primary">
                                            {formatPrice(product.priceRange.min)}
                                        </p>
                                    </div>
                                    <span className="btn-primary text-sm px-3 py-1.5">Lihat</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
