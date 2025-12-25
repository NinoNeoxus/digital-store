import { Metadata } from 'next';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
    title: 'FAQ',
    description: 'Pertanyaan umum seputar layanan Schnuffelll Shop',
};

const faqs = [
    {
        category: 'Umum',
        items: [
            {
                question: 'Apa itu Schnuffelll Shop?',
                answer: 'Schnuffelll Shop adalah platform penyedia layanan digital lengkap mulai dari VPS, Pterodactyl Panel, hingga Top Up Game dan Akun Premium.'
            },
            {
                question: 'Apakah layanan ini aman?',
                answer: 'Ya, keamanan adalah prioritas kami. Semua transaksi dienkripsi dan kami menggunakan payment gateway terpercaya.'
            },
        ]
    },
    {
        category: 'Pembayaran & Order',
        items: [
            {
                question: 'Metode pembayaran apa saja yang tersedia?',
                answer: 'Kami menerima berbagai metode pembayaran termasuk QRIS, Virtual Account (BCA, Mandiri, BNI, BRI), dan E-Wallet (GoPay, OVO, Dana).'
            },
            {
                question: 'Berapa lama proses transaksi?',
                answer: 'Untuk produk otomatis seperti Top Up Game dan VPS, proses biasanya instan (1-5 menit). Untuk produk manual, maksimal 24 jam.'
            },
        ]
    },
    {
        category: 'Produk & Layanan',
        items: [
            {
                question: 'Apakah ada garansi?',
                answer: 'Ya, kami memberikan garansi untuk setiap produk sesuai dengan ketentuan masing-masing layanan. Garansi uang kembali jika produk tidak berfungsi.'
            },
            {
                question: 'Bagaimana cara akses VPS setelah pembelian?',
                answer: 'Detail akses VPS (IP, Username, Password) akan dikirimkan otomatis ke email Anda dan dashboard member area setelah pembayaran berhasil.'
            },
        ]
    }
];

export default function FAQPage() {
    return (
        <div className="min-h-screen">
            <section className="bg-card/50 border-b border-white/5 py-16">
                <div className="container text-center max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4">Pertanyaan Umum</h1>
                    <p className="text-xl text-muted-foreground">
                        Temukan jawaban untuk pertanyaan yang sering diajukan
                    </p>
                </div>
            </section>

            <div className="container py-12 max-w-4xl">
                <div className="space-y-12">
                    {faqs.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <HelpCircle className="w-6 h-6 text-primary" />
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <div key={i} className="glass-card hover:border-primary/30 transition-colors">
                                        <details className="group p-6 cursor-pointer">
                                            <summary className="flex items-center justify-between font-semibold text-lg list-none">
                                                {item.question}
                                                <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                                            </summary>
                                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
