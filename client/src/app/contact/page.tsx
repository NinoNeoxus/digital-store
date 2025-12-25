'use client';

import { useState } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Clock,
    Instagram,
    Youtube
} from 'lucide-react';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email',
        value: 'support@schnuffelll.shop',
        link: 'mailto:support@schnuffelll.shop',
    },
    {
        icon: Phone,
        title: 'WhatsApp',
        value: '+62 812-3456-7890',
        link: 'https://wa.me/6281234567890',
    },
    {
        icon: MapPin,
        title: 'Lokasi',
        value: 'Jakarta, Indonesia',
        link: null,
    },
    {
        icon: Clock,
        title: 'Jam Operasional',
        value: '24/7 Online Support',
        link: null,
    },
];

const socialLinks = [
    { icon: Instagram, name: 'Instagram', link: 'https://instagram.com/schnuffelll' },
    { icon: Youtube, name: 'YouTube', link: 'https://youtube.com/@schnuffelll' },
    { icon: MessageCircle, name: 'Discord', link: 'https://discord.gg/schnuffelll' },
];

export default function ContactPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
        }, 1500);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-card/50 border-b border-white/5 py-16">
                <div className="container text-center max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
                    <p className="text-xl text-muted-foreground">
                        Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda 24/7
                    </p>
                </div>
            </section>

            <div className="container py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            placeholder="nama@email.com"
                                            className="w-full px-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subjek</label>
                                    <select className="w-full px-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                                        <option value="">Pilih subjek...</option>
                                        <option value="order">Pertanyaan Order</option>
                                        <option value="product">Pertanyaan Produk</option>
                                        <option value="payment">Masalah Pembayaran</option>
                                        <option value="refund">Request Refund</option>
                                        <option value="partnership">Kerjasama / Partnership</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pesan</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tulis pesan Anda di sini..."
                                        className="w-full px-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Kirim Pesan
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        {/* Contact Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {contactInfo.map((info, index) => (
                                <a
                                    key={index}
                                    href={info.link || undefined}
                                    target={info.link?.startsWith('http') ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className={`glass-card p-6 ${info.link ? 'hover:border-primary/50 cursor-pointer' : ''} transition-colors`}
                                >
                                    <info.icon className="w-8 h-8 text-primary mb-3" />
                                    <h3 className="font-semibold">{info.title}</h3>
                                    <p className="text-muted-foreground text-sm mt-1">{info.value}</p>
                                </a>
                            ))}
                        </div>

                        {/* Social Media */}
                        <div className="glass-card p-8">
                            <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
                            <p className="text-muted-foreground mb-6">
                                Follow social media kami untuk update terbaru dan promo menarik
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-4 bg-card rounded-xl hover:bg-primary/20 hover:text-primary transition-colors"
                                        title={social.name}
                                    >
                                        <social.icon className="w-6 h-6" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* FAQ prompt */}
                        <div className="glass-card p-8 bg-primary/10 border-primary/30">
                            <h3 className="text-xl font-bold mb-2">Pertanyaan Umum?</h3>
                            <p className="text-muted-foreground mb-4">
                                Cek halaman FAQ kami untuk jawaban cepat atas pertanyaan umum
                            </p>
                            <a href="/faq" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                                Lihat FAQ
                                <span>→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
