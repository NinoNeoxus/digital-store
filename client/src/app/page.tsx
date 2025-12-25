import Link from 'next/link';
import {
    Server,
    Gamepad2,
    Coins,
    Crown,
    ArrowRight,
    Zap,
    Shield,
    Headphones,
    ChevronRight
} from 'lucide-react';

// Hero Section
function HeroSection() {
    return (
        <section className="hero-bg relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="container relative py-24 md:py-32 lg:py-40">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        <Zap className="w-4 h-4" />
                        <span>Proses Instant & Otomatis</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                        Solusi Digital Terlengkap untuk{' '}
                        <span className="text-gradient">Bisnis & Gaming</span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        VPS Premium, Pterodactyl Hosting, Game Top Up, dan Akun Premium.
                        Semua dalam satu platform dengan harga terjangkau.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/products"
                            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3"
                        >
                            Lihat Produk
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/register"
                            className="btn-outline inline-flex items-center gap-2 text-lg px-8 py-3"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-accent" />
                            <span className="text-sm">Pembayaran Aman</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-sm">Proses Instan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Headphones className="w-5 h-5 text-primary" />
                            <span className="text-sm">Support 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Categories Section
const categories = [
    {
        name: 'VPS & Server',
        slug: 'vps-server',
        description: 'Virtual Private Server dengan performa tinggi untuk website dan aplikasi.',
        icon: Server,
        color: 'from-blue-500 to-cyan-500',
        count: 8,
    },
    {
        name: 'Pterodactyl Panel',
        slug: 'pterodactyl',
        description: 'Game server hosting dengan panel Pterodactyl yang mudah digunakan.',
        icon: Gamepad2,
        color: 'from-purple-500 to-pink-500',
        count: 5,
    },
    {
        name: 'Game Top Up',
        slug: 'game-topup',
        description: 'Top up diamond, UC, dan mata uang game lainnya dengan harga terbaik.',
        icon: Coins,
        color: 'from-amber-500 to-orange-500',
        count: 20,
    },
    {
        name: 'Akun Premium',
        slug: 'akun-premium',
        description: 'Akun premium Netflix, Spotify, dan layanan streaming lainnya.',
        icon: Crown,
        color: 'from-emerald-500 to-teal-500',
        count: 12,
    },
];

function CategoriesSection() {
    return (
        <section className="py-20 md:py-28">
            <div className="container">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Kategori Produk
                    </h2>
                    <p className="text-muted-foreground">
                        Pilih kategori produk yang kamu butuhkan
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.slug}
                                href={`/category/${category.slug}`}
                                className="group glass-card p-6 product-card"
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} p-3 mb-4`}>
                                    <Icon className="w-full h-full text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {category.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {category.count} produk
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Features Section
const features = [
    {
        icon: Zap,
        title: 'Proses Instan',
        description: 'Produk langsung dikirim otomatis setelah pembayaran berhasil.',
    },
    {
        icon: Shield,
        title: 'Pembayaran Aman',
        description: 'Transaksi dijamin aman dengan berbagai metode pembayaran.',
    },
    {
        icon: Headphones,
        title: 'Support 24/7',
        description: 'Tim support siap membantu kapanpun kamu butuhkan.',
    },
];

function FeaturesSection() {
    return (
        <section className="py-20 bg-card/50">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center p-6">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// CTA Section
function CTASection() {
    return (
        <section className="py-20">
            <div className="container">
                <div className="glass-card glow p-8 md:p-12 text-center relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-glow-gradient opacity-50" />

                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Siap Mulai?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            Daftar sekarang dan dapatkan akses ke semua produk digital terbaik dengan harga spesial.
                        </p>
                        <Link
                            href="/register"
                            className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3"
                        >
                            Buat Akun Gratis
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Main Page
export default function HomePage() {
    return (
        <>
            <HeroSection />
            <CategoriesSection />
            <FeaturesSection />
            <CTASection />
        </>
    );
}
