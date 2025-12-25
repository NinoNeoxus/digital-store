'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/lib/use-toast';

interface Product {
    id: string;
    name: string;
    slug: string;
    category: { name: string };
    _count: { variants: number };
}

export default function ProductsPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?limit=100');
            const data = await res.json();
            if (data.products) setProducts(data.products);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal mengambil data produk' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah anda yakin ingin menghapus produk ini?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus');

            toast({ title: 'Berhasil', description: 'Produk dihapus' });
            fetchProducts();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Gagal menghapus produk' });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Kelola Produk
                    </h1>
                    <p className="text-gray-400 mt-1">Daftar semua produk yang tersedia</p>
                </div>
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Produk ({products.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Varian</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            Belum ada produk.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span>{product.name}</span>
                                                    <span className="text-xs text-gray-500 font-mono">{product.slug}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="bg-white/10 px-2 py-1 rounded text-xs">
                                                    {product.category?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>{product._count?.variants || 0} Varian</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/product/${product.slug}`} target="_blank">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-yellow-400">
                                                        <Link href={`/admin/products/${product.id}/edit`}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="hover:text-red-400"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
