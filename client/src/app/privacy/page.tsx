import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kebijakan Privasi',
    description: 'Kebijakan privasi Schnuffelll Shop',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen">
            <section className="bg-card/50 border-b border-white/5 py-12">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
                    <p className="text-muted-foreground mt-2">Update terakhir: 25 Desember 2025</p>
                </div>
            </section>

            <div className="container max-w-4xl py-12">
                <div className="glass-card p-8">
                    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                        <h3>1. Informasi yang Kami Kumpulkan</h3>
                        <p>
                            Kami mengumpulkan informasi yang Anda berikan saat mendaftar atau melakukan pembelian, seperti:
                        </p>
                        <ul>
                            <li>Nama</li>
                            <li>Alamat Email</li>
                            <li>Nomor WhatsApp</li>
                            <li>Detail Pembayaran</li>
                        </ul>

                        <h3>2. Bagaimana Kami Menggunakan Data Anda</h3>
                        <p>
                            Data Anda digunakan untuk:
                        </p>
                        <ul>
                            <li>Memproses pesanan dan transaksi Anda.</li>
                            <li>Mengirimkan informasi akses produk (seperti detail login VPS).</li>
                            <li>Menghubungi Anda terkait layanan pelanggan.</li>
                            <li>Meningkatkan layanan dan pengalaman pengguna kami.</li>
                        </ul>

                        <h3>3. Keamanan Data</h3>
                        <p>
                            Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Password akun Anda disimpan dalam bentuk terenkripsi (hashed).
                        </p>

                        <h3>4. Berbagi Informasi dengan Pihak Ketiga</h3>
                        <p>
                            Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak lain. Data hanya dibagikan kepada penyedia layanan pembayaran (Payment Gateway) untuk memproses transaksi.
                        </p>

                        <h3>5. Cookies</h3>
                        <p>
                            Website kami menggunakan cookies untuk menyimpan preferensi login dan meningkatkan kenyamanan Anda saat berselancar di situs kami.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
