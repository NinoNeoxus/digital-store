import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Syarat & Ketentuan',
    description: 'Syarat dan ketentuan penggunaan layanan Schnuffelll Shop',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen">
            <section className="bg-card/50 border-b border-white/5 py-12">
                <div className="container max-w-4xl">
                    <h1 className="text-3xl font-bold">Syarat & Ketentuan</h1>
                    <p className="text-muted-foreground mt-2">Update terakhir: 25 Desember 2025</p>
                </div>
            </section>

            <div className="container max-w-4xl py-12">
                <div className="glass-card p-8">
                    <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
                        <h3>1. Pendahuluan</h3>
                        <p>
                            Selamat datang di Schnuffelll Shop. Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini.
                        </p>

                        <h3>2. Layanan</h3>
                        <p>
                            Kami menyediakan layanan produk digital termasuk namun tidak terbatas pada VPS, Hosting, Pterodactyl Panel, Top Up Game, dan Akun Premium. Kami berhak mengubah, menangguhkan, atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
                        </p>

                        <h3>3. Pembayaran & Pengembalian Dana</h3>
                        <ul>
                            <li>Pembayaran harus dilakukan penuh sebelum layanan diaktifkan.</li>
                            <li>Dana dapat dikembalikan (Refund) jika layanan tidak dapat dikirimkan dalam waktu yang dijanjikan.</li>
                            <li>Refund tidak berlaku jika kesalahan ada pada pihak pengguna (misal: salah input ID game).</li>
                        </ul>

                        <h3>4. Penggunaan yang Dilarang</h3>
                        <p>
                            Layanan VPS dan Hosting kami tidak boleh digunakan untuk aktivitas ilegal seperti:
                        </p>
                        <ul>
                            <li>Mining Cryptocurrency</li>
                            <li>DDoS Attack / Botnet</li>
                            <li>Hosting konten ilegal / phishing</li>
                            <li>Spam email</li>
                        </ul>
                        <p>
                            Pelanggaran terhadap aturan ini akan mengakibatkan penghentian layanan secara sepihak tanpa refund.
                        </p>

                        <h3>5. Batasan Tanggung Jawab</h3>
                        <p>
                            Schnuffelll Shop tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan kami.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
