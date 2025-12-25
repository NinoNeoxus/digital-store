import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft,
    ShoppingCart,
    Heart,
    Share2,
    Check,
    Zap,
    Shield,
    Server,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Sample product data
const product = {
    id: '1',
    name: 'VPS High Performance',
    slug: 'vps-high-performance',
    description: `
    <h2>VPS High Performance Indonesia</h2>
    <p>Virtual Private Server dengan performa tinggi untuk kebutuhan bisnis Anda. Didukung oleh infrastruktur premium dengan uptime 99.9%.</p>
    <h3>Keunggulan:</h3>
    <ul>
      <li>✅ Full Root Access</li>
      <li>✅ SSD NVMe Storage</li>
      <li>✅ Dedicated Resources</li>
      <li>✅ DDoS Protection</li>
      <li>✅ 24/7 Support</li>
    </ul>
    <p>Cocok untuk: Website, API Server, Game Server, VPN, dan lainnya.</p>
  `,
    shortDesc: 'VPS Indonesia dengan SSD NVMe dan uptime 99.9%',
    thumbnail: '/images/products/vps-server.png',
    images: [
        '/images/products/vps-server.png',
    ],
    category: { name: 'VPS & Server', slug: 'vps-server' },
    variants: [
        { id: '1', name: 'Starter - 1GB RAM', price: 50000, comparePrice: 75000, stock: 99 },
        { id: '2', name: 'Basic - 2GB RAM', price: 100000, comparePrice: 150000, stock: 99 },
        { id: '3', name: 'Standard - 4GB RAM', price: 200000, comparePrice: 300000, stock: 99 },
        { id: '4', name: 'Pro - 8GB RAM', price: 400000, comparePrice: 500000, stock: 50 },
    ],
};

export const metadata: Metadata = {
    title: product.name,
    description: product.shortDesc,
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

function getDiscountPercent(original: number, sale: number): number {
    return Math.round(((original - sale) / original) * 100);
}

export default function ProductDetailPage() {
    const selectedVariant = product.variants[0]; // Default to first variant

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <section className="bg-card/50 border-b border-white/5">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-foreground">Produk</Link>
                        <span>/</span>
                        <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
                            {product.category.name}
                        </Link>
                        <span>/</span>
                        <span className="text-foreground">{product.name}</span>
                    </nav>
                </div>
            </section>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left - Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-video relative rounded-xl overflow-hidden group">
                            <Image
                                src={product.thumbnail}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Navigation arrows */}
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className={`aspect-video relative rounded-lg overflow-hidden border-2 ${i === 1 ? 'border-primary' : 'border-transparent'} cursor-pointer hover:border-primary/50 transition-colors`}
                                >
                                    {i === 1 && product.thumbnail && (
                                        <Image
                                            src={product.thumbnail}
                                            alt={`${product.name} ${i}`}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    {i !== 1 && (
                                        <div className="absolute inset-0 bg-card" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Product Info */}
                    <div className="space-y-6">
                        {/* Category & Title */}
                        <div>
                            <Link
                                href={`/category/${product.category.slug}`}
                                className="text-sm text-primary font-medium hover:underline"
                            >
                                {product.category.name}
                            </Link>
                            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
                            <p className="text-muted-foreground mt-2">{product.shortDesc}</p>
                        </div>

                        {/* Variants */}
                        <div className="space-y-3">
                            <h3 className="font-semibold">Pilih Paket:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={variant.id}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${index === 0
                                                ? 'border-primary bg-primary/10'
                                                : 'border-white/10 hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <span className="font-medium">{variant.name}</span>
                                            {index === 0 && <Check className="w-5 h-5 text-primary" />}
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-lg font-bold text-primary">
                                                {formatPrice(variant.price)}
                                            </span>
                                            {variant.comparePrice && (
                                                <span className="text-sm text-muted-foreground line-through ml-2">
                                                    {formatPrice(variant.comparePrice)}
                                                </span>
                                            )}
                                        </div>
                                        {variant.comparePrice && (
                                            <span className="inline-block mt-1 text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                                Hemat {getDiscountPercent(variant.comparePrice, variant.price)}%
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Harga</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(selectedVariant.price)}
                                    </span>
                                    {selectedVariant.comparePrice && (
                                        <span className="block text-sm text-muted-foreground line-through">
                                            {formatPrice(selectedVariant.comparePrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-accent" />
                                <span>Stok tersedia: {selectedVariant.stock}</span>
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 btn-primary py-3 text-lg inline-flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Beli Sekarang
                                </button>
                                <button className="p-3 bg-secondary rounded-lg hover:bg-white/10 transition-colors">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-3 bg-secondary rounded-lg hover:bg-white/10 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                                <Zap className="w-8 h-8 text-primary" />
                                <div>
                                    <span className="font-medium text-sm">Proses Instan</span>
                                    <p className="text-xs text-muted-foreground">Langsung aktif setelah bayar</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                                <Shield className="w-8 h-8 text-accent" />
                                <div>
                                    <span className="font-medium text-sm">Garansi</span>
                                    <p className="text-xs text-muted-foreground">Uang kembali jika gagal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-12">
                    <div className="glass-card p-8">
                        <h2 className="text-2xl font-bold mb-6">Deskripsi Produk</h2>
                        <div
                            className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
