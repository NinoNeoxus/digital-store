import { Metadata } from 'next';
import Link from 'next/link';
import {
    Shield,
    Zap,
    Users,
    Award,
    Target,
    Heart,
    CheckCircle,
    ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
    title: 'Tentang Kami',
    description: 'Schnuffelll Shop - Solusi digital terlengkap untuk bisnis dan gaming',
};

const stats = [
    { value: '10K+', label: 'Pelanggan Aktif' },
    { value: '50K+', label: 'Transaksi Sukses' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Customer Support' },
];

const values = [
    {
        icon: Shield,
        title: 'Keamanan',
        description: 'Transaksi aman dengan enkripsi data dan payment gateway terpercaya.',
    },
    {
        icon: Zap,
        title: 'Kecepatan',
        description: 'Proses otomatis dan instan untuk pengalaman belanja terbaik.',
    },
    {
        icon: Users,
        title: 'Komunitas',
        description: 'Membangun hubungan jangka panjang dengan pelanggan setia kami.',
    },
    {
        icon: Award,
        title: 'Kualitas',
        description: 'Hanya menyediakan produk berkualitas dengan garansi.',
    },
];

const timeline = [
    { year: '2023', title: 'Didirikan', description: 'Schnuffelll Shop didirikan dengan visi menjadi platform digital terdepan.' },
    { year: '2023', title: '1000 Pelanggan', description: 'Mencapai 1000 pelanggan pertama dalam 3 bulan.' },
    { year: '2024', title: 'Ekspansi Produk', description: 'Menambah layanan VPS, Pterodactyl, dan Game Topup.' },
    { year: '2024', title: 'Pertumbuhan', description: 'Melayani lebih dari 10.000 pelanggan aktif.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-card/50 border-b border-white/5 py-20">
                <div className="container text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Tentang <span className="text-gradient">Schnuffelll Shop</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Kami adalah platform digital store yang menyediakan berbagai produk dan layanan digital
                        untuk kebutuhan bisnis dan gaming Anda. Dengan komitmen pada kualitas dan kecepatan,
                        kami hadir untuk menjadi solusi digital terpercaya.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary">{stat.value}</div>
                                <div className="text-muted-foreground mt-2">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-card/30">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="glass-card p-8">
                            <Target className="w-12 h-12 text-primary mb-4" />
                            <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Menyediakan layanan digital berkualitas tinggi dengan harga terjangkau,
                                proses yang cepat, dan dukungan pelanggan yang responsif. Kami berkomitmen
                                untuk terus berinovasi dan memberikan pengalaman terbaik bagi setiap pelanggan.
                            </p>
                        </div>
                        <div className="glass-card p-8">
                            <Heart className="w-12 h-12 text-accent mb-4" />
                            <h2 className="text-2xl font-bold mb-4">Visi Kami</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Menjadi platform digital store terdepan di Indonesia yang dikenal karena
                                keandalan, kualitas produk, dan kepuasan pelanggan. Kami ingin menjadi
                                mitra terpercaya untuk semua kebutuhan digital Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16">
                <div className="container">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Prinsip yang menjadi fondasi dalam setiap layanan yang kami berikan
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="glass-card p-6 text-center hover:border-primary/50 transition-colors">
                                <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-sm text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-card/30">
                <div className="container max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Perjalanan Kami</h2>
                        <p className="text-muted-foreground">
                            Milestone penting dalam perjalanan Schnuffelll Shop
                        </p>
                    </div>
                    <div className="space-y-8">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-primary" />
                                    </div>
                                    {index !== timeline.length - 1 && (
                                        <div className="w-0.5 h-full bg-primary/20 mt-2" />
                                    )}
                                </div>
                                <div className="pb-8">
                                    <span className="text-sm text-primary font-medium">{item.year}</span>
                                    <h3 className="text-xl font-semibold mt-1">{item.title}</h3>
                                    <p className="text-muted-foreground mt-2">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container text-center max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Siap Untuk Mulai?</h2>
                    <p className="text-muted-foreground mb-8">
                        Bergabunglah dengan ribuan pelanggan yang sudah mempercayai Schnuffelll Shop
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                            Lihat Produk
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="/contact" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                            Hubungi Kami
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
