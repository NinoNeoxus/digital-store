'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, ShoppingCart, Heart, Share2, Zap, Shield } from 'lucide-react';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useToast } from '@/lib/use-toast';
import { Button } from '@/components/ui/button';

interface ProductVariant {
    id: string;
    name: string;
    price: number | string;
    comparePrice?: number | string | null;
    stock: number;
}

interface ProductImage {
    url: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    shortDesc?: string;
    thumbnail?: string;
    images: ProductImage[];
    category: { name: string; slug: string };
    variants: ProductVariant[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
    const { toast } = useToast();
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0] || {});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Combine thumbnail and images unique
    const allImages = [
        product.thumbnail,
        ...(product.images || []).map(img => img.url)
    ].filter((url): url is string => !!url); // Remove null/undefined

    // Unique images only
    const uniqueImages = Array.from(new Set(allImages));
    if (uniqueImages.length === 0) uniqueImages.push('/placeholder.jpg'); // Fallback

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

    const handleAddToCart = () => {
        // Here we would interact with Cart Context
        toast({
            title: "Berhasil",
            description: `Ditambahkan ke keranjang: ${product.name} - ${selectedVariant.name}`
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="space-y-4">
                <div className="aspect-video relative rounded-xl overflow-hidden group border border-white/10 bg-black/40">
                    <Image
                        src={uniqueImages[currentImageIndex]}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500 hover:scale-105"
                        priority
                    />
                    {uniqueImages.length > 1 && (
                        <>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-600">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-600">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
                {/* Thumbnails */}
                {uniqueImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {uniqueImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`aspect-video relative rounded-lg overflow-hidden border-2 transition-all ${i === currentImageIndex ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-transparent hover:border-white/20'
                                    }`}
                            >
                                <Image src={img} alt="Thumbnail" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                {/* Header */}
                <div>
                    <Link href={`/category/${product.category?.slug}`} className="text-sm text-cyan-400 font-medium hover:underline mb-2 inline-block">
                        {product.category?.name}
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                    {product.shortDesc && <p className="text-gray-400">{product.shortDesc}</p>}
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-300">Pilih Paket:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`p-4 rounded-xl border text-left transition-all ${selectedVariant?.id === variant.id
                                            ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                                            : 'border-white/10 hover:border-white/30 bg-white/5'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-sm">{variant.name}</span>
                                        {selectedVariant?.id === variant.id && <Check className="w-4 h-4 text-cyan-500" />}
                                    </div>
                                    <div className="mt-2">
                                        <span className="text-lg font-bold text-cyan-400">{formatPrice(Number(variant.price))}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4 backdrop-blur-sm">
                    <div className="flex justify-between items-end">
                        <span className="text-gray-400">Total Harga</span>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-white">{formatPrice(Number(selectedVariant?.price || 0))}</div>
                            {Number(selectedVariant?.stock) > 0 ? (
                                <span className="text-green-500 text-sm flex items-center justify-end gap-1">
                                    <Zap className="w-3 h-3" /> Stok Tersedia
                                </span>
                            ) : (
                                <span className="text-red-500 text-sm">Stok Habis</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 h-12 text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                            disabled={Number(selectedVariant?.stock) <= 0}
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {Number(selectedVariant?.stock) > 0 ? 'Beli Sekarang' : 'Habis'}
                        </Button>
                        <Button variant="outline" className="h-12 w-12 p-0 border-white/10 hover:bg-white/10">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="flex gap-3 items-center">
                        <div className="bg-cyan-500/10 p-2 rounded-lg">
                            <Zap className="w-6 h-6 text-cyan-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Proses Otomatis</h4>
                            <p className="text-xs text-gray-500">Langsung aktif detik ini juga</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Garansi 100%</h4>
                            <p className="text-xs text-gray-500">Uang kembali jika gagal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
