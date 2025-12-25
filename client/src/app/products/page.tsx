import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    Server,
    Gamepad2,
    Coins,
    Crown,
    Search,
    SlidersHorizontal,
    Package
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Produk',
    description: 'Jelajahi semua produk digital kami - VPS, Pterodactyl, Game Topup, dan Akun Premium',
};

async function getProducts() {
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001/api';
    try {
        const res = await fetch(`${apiUrl}/products?limit=50`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) return { products: [], pagination: {} };
        return await res.json();
    } catch (e) {
        console.error(e);
        return { products: [], pagination: {} };
    }
}

async function getCategories() {
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001/api';
    try {
        const res = await fetch(`${apiUrl}/categories`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) return { categories: [] };
        return await res.json();
    } catch (e) {
        console.error(e);
        return { categories: [] };
    }
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
    const lowestPrice = product.priceRange?.min || 0;

    // Icon mapping based on category slug
    const getIcon = (slug: string) => {
        if (slug?.includes('vps')) return Server;
        if (slug?.includes('pterodactyl')) return Gamepad2;
        if (slug?.includes('game')) return Coins;
        if (slug?.includes('premium')) return Crown;
        return Package;
    };

    const Icon = getIcon(product.category?.slug);

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group glass-card overflow-hidden product-card bloc h-full flex flex-col"
        >
            {/* Image */}
            <div className="aspect-video relative overflow-hidden bg-black/40">
                {product.thumbnail ? (
                    <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-cyan-500/30" />
                    </div>
                )}
                {product.isFeatured && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-cyan-600/80 text-[10px] font-bold text-white rounded uppercase tracking-wider">
                        Featured
                    </span>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Category */}
                <span className="text-xs text-cyan-400 font-medium">
                    {product.category?.name || 'Uncategorized'}
                </span>

                {/* Title */}
                <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 line-clamp-2 flex-1">
                    {product.shortDesc || product.description?.substring(0, 100)}
                </p>

                {/* Variants preview */}
                <div className="flex flex-wrap gap-1 min-h-[24px]">
                    {product.variants?.slice(0, 2).map((v: any, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-gray-400 border border-white/5">
                            {v.name}
                        </span>
                    ))}
                    {product.variants?.length > 2 && (
                        <span className="text-[10px] px-2 py-0.5 text-gray-500">
                            +{product.variants.length - 2} ops
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                    <div>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Mulai Dari</span>
                        <p className="text-lg font-bold text-cyan-400">
                            {formatPrice(lowestPrice)}
                        </p>
                    </div>
                    <span className="px-3 py-1.5 bg-white/5 hover:bg-cyan-600/20 hover:text-cyan-400 text-sm rounded-lg transition-colors border border-white/10 hover:border-cyan-500/50">
                        Detail
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default async function ProductsPage() {
    const { products } = await getProducts();
    const { categories } = await getCategories();

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <section className="bg-white/5 border-b border-white/5">
                <div className="container py-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Katalog Produk
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Temukan berbagai produk digital berkualitas tinggi untuk kebutuhan gaming, server, dan hiburan Anda.
                    </p>
                </div>
            </section>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="sticky top-24 bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
                                <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
                                Kategori
                            </h3>
                            <nav className="space-y-1">
                                <Link
                                    href="/products"
                                    className="flex items-center justify-between p-2 rounded-lg bg-cyan-600/10 text-cyan-400 font-medium"
                                >
                                    <span className="flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Semua Produk
                                    </span>
                                    <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded-full">
                                        {products.length}
                                    </span>
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link
                                        key={cat.id}
                                        href={`/category/${cat.slug}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                                    >
                                        <span className="flex items-center gap-2">
                                            {/* We could map icons dynamically if needed */}
                                            {cat.name}
                                        </span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Search & Sort */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white placeholder:text-gray-600"
                                />
                            </div>
                            <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm text-white [&>option]:text-black">
                                <option value="newest">Terbaru</option>
                                <option value="price-low">Harga: Rendah ke Tinggi</option>
                                <option value="price-high">Harga: Tinggi ke Rendah</option>
                                <option value="name">Nama: A-Z</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 border-dashed">
                                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white">Belum ada produk</h3>
                                <p className="text-gray-500">Silahkan kembali lagi nanti.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
}
