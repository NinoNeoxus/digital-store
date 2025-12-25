import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-8xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
                    <p className="text-muted-foreground max-w-md">
                        Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
                    </p>
                </div>

                <Link
                    href="/"
                    className="btn-primary inline-flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}
