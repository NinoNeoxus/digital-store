import Link from 'next/link';
import { Zap, Mail, MessageCircle } from 'lucide-react';

const footerLinks = {
    products: [
        { name: 'VPS & Server', href: '/category/vps-server' },
        { name: 'Pterodactyl', href: '/category/pterodactyl' },
        { name: 'Game Top Up', href: '/category/game-topup' },
        { name: 'Akun Premium', href: '/category/akun-premium' },
    ],
    company: [
        { name: 'Tentang Kami', href: '/about' },
        { name: 'Kebijakan Privasi', href: '/privacy' },
        { name: 'Syarat & Ketentuan', href: '/terms' },
        { name: 'FAQ', href: '/faq' },
    ],
    support: [
        { name: 'Hubungi Kami', href: '/contact' },
        { name: 'Discord', href: '#' },
        { name: 'WhatsApp', href: '#' },
    ],
};

export function Footer() {
    return (
        <footer className="bg-card/50 border-t border-white/5">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">
                                Schnuffelll<span className="text-primary">.Shop</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            Toko produk digital terpercaya. VPS, Hosting, Game Top Up, dan Akun Premium dengan harga terjangkau.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:support@schnuffelll.shop"
                                className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold mb-4">Produk</h3>
                        <ul className="space-y-3">
                            {footerLinks.products.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Perusahaan</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Bantuan</h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Schnuffelll.Shop. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Made with ❤️ by <span className="text-primary">@schnuffelll</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
