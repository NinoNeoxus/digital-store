'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    Menu,
    X,
    ShoppingCart,
    User,
    ChevronDown,
    Zap
} from 'lucide-react';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Produk', href: '/products' },
    {
        name: 'Kategori',
        href: '#',
        children: [
            { name: 'VPS & Server', href: '/category/vps-server' },
            { name: 'Pterodactyl', href: '/category/pterodactyl' },
            { name: 'Game Top Up', href: '/category/game-topup' },
            { name: 'Akun Premium', href: '/category/akun-premium' },
        ]
    },
];

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full glass-card border-b border-white/5">
            <nav className="container flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">
                        Schnuffelll<span className="text-primary">.Shop</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navigation.map((item) => (
                        item.children ? (
                            <div key={item.name} className="relative">
                                <button
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.name}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {categoryOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 glass-card border border-white/10 rounded-lg py-2 shadow-xl">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                                                onClick={() => setCategoryOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                            0
                        </span>
                    </button>

                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="btn-primary"
                    >
                        Daftar
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-muted-foreground"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/5">
                    <div className="container py-4 space-y-4">
                        {navigation.map((item) => (
                            item.children ? (
                                <div key={item.name} className="space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                                    <div className="pl-4 space-y-2">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.name}
                                                href={child.href}
                                                className="block text-foreground"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}

                        <div className="pt-4 border-t border-white/5 flex gap-4">
                            <Link href="/login" className="flex-1 btn-secondary text-center">
                                Login
                            </Link>
                            <Link href="/register" className="flex-1 btn-primary text-center">
                                Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
