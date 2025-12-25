import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/product/product-detail-client';

// Fetch product data
async function getProduct(slug: string) {
    const apiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3001/api';
    try {
        const res = await fetch(`${apiUrl}/products/${slug}`, {
            cache: 'no-store', // Always fresh data
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.product;
    } catch (error) {
        console.error('Fetch product error:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const product = await getProduct(params.slug);
    if (!product) {
        return { title: 'Produk Tidak Ditemukan' };
    }
    return {
        title: `${product.name} - CyberStore`,
        description: product.shortDesc || product.description.substring(0, 160),
    };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await getProduct(params.slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Breadcrumb */}
            <section className="bg-white/5 border-b border-white/5 backdrop-blur-sm sticky top-[64px] z-10">
                <div className="container py-4">
                    <nav className="flex items-center gap-2 text-sm text-gray-400 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-cyan-400 transition-colors">Produk</Link>
                        <span>/</span>
                        <Link href={`/category/${product.category?.slug}`} className="hover:text-cyan-400 transition-colors">
                            {product.category?.name || 'Kategori'}
                        </Link>
                        <span>/</span>
                        <span className="text-white truncate">{product.name}</span>
                    </nav>
                </div>
            </section>

            <div className="container py-8">
                <ProductDetailClient product={product} />

                {/* Description */}
                <div className="mt-12">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Deskripsi Produk</h2>
                        <div
                            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-a:text-cyan-400 prose-strong:text-white"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
