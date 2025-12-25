import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    Server,
    Gamepad2,
    Coins,
    Crown,
    Search,
    SlidersHorizontal
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Produk',
    description: 'Jelajahi semua produk digital kami - VPS, Pterodactyl, Game Topup, dan Akun Premium',
};

// Static categories for now
const categories = [
    { name: 'Semua', slug: 'all', icon: null, count: 45 },
    { name: 'VPS & Server', slug: 'vps-server', icon: Server, count: 8 },
    { name: 'Pterodactyl', slug: 'pterodactyl', icon: Gamepad2, count: 5 },
    { name: 'Game Top Up', slug: 'game-topup', icon: Coins, count: 20 },
    { name: 'Akun Premium', slug: 'akun-premium', icon: Crown, count: 12 },
];

// Sample products with images
const sampleProducts = [
    {
        id: '1',
        name: 'VPS High Performance',
        slug: 'vps-high-performance',
        shortDesc: 'VPS Indonesia dengan SSD NVMe dan uptime 99.9%',
        thumbnail: '/images/products/vps-server.png',
        category: { name: 'VPS & Server', slug: 'vps-server' },
        priceRange: { min: 50000, max: 400000 },
        isFeatured: true,
        variants: [
            { name: 'Starter - 1GB RAM', price: 50000 },
            { name: 'Basic - 2GB RAM', price: 100000 },
        ],
    },
    {
        id: '2',
        name: 'Minecraft Server Hosting',
        slug: 'minecraft-server-hosting',
        shortDesc: 'Server Minecraft dengan panel mudah dan setup instan',
        thumbnail: '/images/products/minecraft-server.png',
        category: { name: 'Pterodactyl', slug: 'pterodactyl' },
        priceRange: { min: 35000, max: 120000 },
        isFeatured: true,
        variants: [
            { name: '2GB RAM (10-15 Players)', price: 35000 },
            { name: '4GB RAM (20-30 Players)', price: 65000 },
        ],
    },
    {
        id: '3',
        name: 'Mobile Legends Diamonds',
        slug: 'mobile-legends-diamonds',
        shortDesc: 'Top up diamond ML murah dan instan',
        thumbnail: '/images/products/mobile-legends.png',
        category: { name: 'Game Top Up', slug: 'game-topup' },
        priceRange: { min: 19000, max: 456000 },
        isFeatured: true,
        variants: [
            { name: '86 Diamonds', price: 19000 },
            { name: '172 Diamonds', price: 38000 },
        ],
    },
    {
        id: '4',
        name: 'Netflix Premium',
        slug: 'netflix-premium',
        shortDesc: 'Akun Netflix Private, UHD 4K, Full Garansi',
        thumbnail: '/images/products/netflix.png',
        category: { name: 'Akun Premium', slug: 'akun-premium' },
        priceRange: { min: 45000, max: 400000 },
        isFeatured: true,
        variants: [
            { name: '1 Bulan', price: 45000 },
            { name: '3 Bulan', price: 120000 },
        ],
    },
    {
        id: '5',
        name: 'Spotify Premium',
        slug: 'spotify-premium',
        shortDesc: 'Akun Spotify Premium tanpa iklan',
        thumbnail: '/images/products/spotify.png',
        category: { name: 'Akun Premium', slug: 'akun-premium' },
        priceRange: { min: 15000, max: 150000 },
        isFeatured: false,
        variants: [
            { name: '1 Bulan', price: 15000 },
            { name: '6 Bulan', price: 75000 },
        ],
    },
    {
        id: '6',
        name: 'Free Fire Diamonds',
        slug: 'free-fire-diamonds',
        shortDesc: 'Top up diamond Free Fire cepat & murah',
        thumbnail: '/images/products/free-fire.png',
        category: { name: 'Game Top Up', slug: 'game-topup' },
        priceRange: { min: 15000, max: 350000 },
        isFeatured: false,
        variants: [
            { name: '100 Diamonds', price: 15000 },
            { name: '310 Diamonds', price: 45000 },
        ],
    },
    {
        id: '7',
        name: 'Valorant Points',
        slug: 'valorant-points',
        shortDesc: 'Top up VP Valorant instant',
        thumbnail: '/images/products/valorant.png',
        category: { name: 'Game Top Up', slug: 'game-topup' },
        priceRange: { min: 16000, max: 800000 },
        isFeatured: false,
        variants: [
            { name: '125 VP', price: 16000 },
            { name: '420 VP', price: 50000 },
        ],
    },
    {
        id: '8',
        name: 'VPS Standard',
        slug: 'vps-standard',
        shortDesc: 'VPS dengan performa stabil untuk website',
        thumbnail: '/images/products/vps-server.png',
        category: { name: 'VPS & Server', slug: 'vps-server' },
        priceRange: { min: 75000, max: 300000 },
        isFeatured: false,
        variants: [
            { name: '2GB RAM', price: 75000 },
            { name: '4GB RAM', price: 150000 },
        ],
    },
];

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

// Product Card Component
function ProductCard({ product }: { product: typeof sampleProducts[0] }) {
    const lowestPrice = product.priceRange.min;

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group glass-card overflow-hidden product-card"
        >
            {/* Image */}
            <div className="aspect-video relative overflow-hidden">
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        {product.category.slug === 'vps-server' && <Server className="w-16 h-16 text-primary/50" />}
                        {product.category.slug === 'pterodactyl' && <Gamepad2 className="w-16 h-16 text-primary/50" />}
                        {product.category.slug === 'game-topup' && <Coins className="w-16 h-16 text-primary/50" />}
                        {product.category.slug === 'akun-premium' && <Crown className="w-16 h-16 text-primary/50" />}
                    </div>
                )}
                {product.isFeatured && (
                    <span className="absolute top-2 left-2 badge badge-primary">
                        Featured
                    </span>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <span className="text-xs text-primary font-medium">
                    {product.category.name}
                </span>

                {/* Title */}
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.shortDesc}
                </p>

                {/* Variants preview */}
                <div className="flex flex-wrap gap-1">
                    {product.variants.slice(0, 2).map((v, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                            {v.name}
                        </span>
                    ))}
                    {product.variants.length > 2 && (
                        <span className="text-xs px-2 py-1 text-muted-foreground">
                            +{product.variants.length - 2} lagi
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div>
                        <span className="text-xs text-muted-foreground">Mulai dari</span>
                        <p className="text-lg font-bold text-primary">
                            {formatPrice(lowestPrice)}
                        </p>
                    </div>
                    <span className="btn-primary text-sm px-3 py-1.5">
                        Lihat
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-card/50 border-b border-white/5">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold mb-2">Semua Produk</h1>
                    <p className="text-muted-foreground">
                        Temukan produk digital terbaik untuk kebutuhan kamu
                    </p>
                </div>
            </section>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="glass-card p-4 sticky top-20">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4" />
                                Kategori
                            </h3>
                            <nav className="space-y-1">
                                {categories.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <Link
                                            key={cat.slug}
                                            href={cat.slug === 'all' ? '/products' : `/category/${cat.slug}`}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
                                        >
                                            <span className="flex items-center gap-2">
                                                {Icon && <Icon className="w-4 h-4" />}
                                                {cat.name}
                                            </span>
                                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                                {cat.count}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Search & Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    className="w-full pl-10 pr-4 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                            <select className="px-4 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                                <option value="newest">Terbaru</option>
                                <option value="price-low">Harga: Rendah ke Tinggi</option>
                                <option value="price-high">Harga: Tinggi ke Rendah</option>
                                <option value="name">Nama: A-Z</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sampleProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-secondary rounded-lg text-muted-foreground" disabled>
                                    Previous
                                </button>
                                <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">1</span>
                                <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-white/10 transition-colors">2</button>
                                <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-white/10 transition-colors">3</button>
                                <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-white/10 transition-colors">
                                    Next
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
