'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag } from 'lucide-react';

// Sample cart items
const cartItems = [
    {
        id: '1',
        name: 'VPS High Performance',
        variant: 'Basic - 2GB RAM',
        price: 100000,
        quantity: 1,
        image: '/images/products/vps-server.png',
    },
    {
        id: '2',
        name: 'Mobile Legends Diamonds',
        variant: '172 Diamonds',
        price: 38000,
        quantity: 2,
        image: '/images/products/mobile-legends.png',
    },
];

function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(price);
}

export default function CartPage() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const total = subtotal - discount;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-6">
                    <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto opacity-50" />
                    <div>
                        <h2 className="text-2xl font-bold">Keranjang Kosong</h2>
                        <p className="text-muted-foreground mt-2">
                            Yuk mulai belanja produk digital favoritmu!
                        </p>
                    </div>
                    <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                        Lihat Produk
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-card/50 border-b border-white/5">
                <div className="container py-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShoppingCart className="w-8 h-8" />
                        Keranjang Belanja
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {cartItems.length} item di keranjang
                    </p>
                </div>
            </section>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="glass-card p-4 flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-card shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.variant}</p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        {formatPrice(item.price)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col items-end justify-between">
                                    <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button className="p-1 bg-secondary rounded hover:bg-white/10 transition-colors">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button className="p-1 bg-secondary rounded hover:bg-white/10 transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card p-6 sticky top-20 space-y-6">
                            <h3 className="text-lg font-semibold">Ringkasan Pesanan</h3>

                            {/* Coupon */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Kode Promo
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Masukkan kode"
                                        className="flex-1 px-3 py-2 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button className="px-4 py-2 bg-secondary rounded-lg hover:bg-white/10 transition-colors">
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-accent">
                                        <span>Diskon</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <button className="w-full btn-primary py-3 text-lg inline-flex items-center justify-center gap-2">
                                Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            {/* Continue shopping */}
                            <Link
                                href="/products"
                                className="block text-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
