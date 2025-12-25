'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/lib/use-toast';
import { X, Plus, Upload, Loader2, Save, Trash2, ImagePlus } from 'lucide-react';
import Image from 'next/image';

export default function AddProductPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [type, setType] = useState('MANUAL');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('0');

    // Images
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Variants
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string, price: number, stock: number }[]>([
        { name: 'Variant 1', price: 0, stock: 0 }
    ]);

    useEffect(() => {
        fetch('/api/categories?limit=100')
            .then(res => res.json())
            .then(data => {
                if (data.categories) setCategories(data.categories);
            })
            .catch(err => console.error('Failed to fetch categories', err));
    }, []);

    // Auto generate slug
    useEffect(() => {
        if (name) {
            const generated = name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setSlug(generated);
        }
    }, [name]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages(prev => [...prev, ...files]);

            const newUrls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        setVariants([...variants, { name: '', price: 0, stock: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index: number, field: string, value: string | number) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!categoryId) throw new Error('Pilih kategori terlebih dahulu');

            // 1. Upload Images
            const imageUrls: string[] = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => formData.append('images', image));

                const uploadRes = await fetch('/api/upload/multiple', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) throw new Error('Gagal upload gambar');
                const uploadData = await uploadRes.json();
                if (uploadData.files) {
                    imageUrls.push(...uploadData.files.map((f: any) => f.url));
                }
            }

            // 2. Prepare Product Data
            const productData = {
                name,
                slug,
                description,
                shortDesc,
                categoryId,
                type,
                images: imageUrls,
                variants: hasVariants ? variants.map((v, idx) => ({
                    ...v,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    sortOrder: idx
                })) : [
                    {
                        name: 'Default',
                        price: Number(price),
                        stock: Number(stock),
                        sortOrder: 0
                    }
                ]
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Gagal membuat produk');
            }

            toast({ title: 'Berhasil', description: 'Produk berhasil dibuat' });
            router.push('/admin/products');

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tambah Produk Baru</h1>
                    <p className="text-gray-400">Isi detail produk di bawah ini</p>
                </div>
                <Button variant="outline" onClick={() => router.back()} disabled={loading}>
                    Batal
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Produk</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Produk</Label>
                                <Input
                                    id="name"
                                    placeholder="Contoh: VPS High Performance"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="font-mono text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
                                <Input
                                    id="shortDesc"
                                    placeholder="Ringkasan produk untuk tampilan kartu"
                                    value={shortDesc}
                                    onChange={(e) => setShortDesc(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Lengkap (HTML Support)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="<p>Jelaskan detail produk Anda...</p>"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[200px] font-mono"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Media</CardTitle>
                            <Button
                                type="button"
                                variant="cyber"
                                size="sm"
                                onClick={() => document.getElementById('image-upload')?.click()}
                            >
                                <ImagePlus className="w-4 h-4 mr-2" />
                                Upload Gambar
                            </Button>
                            <input
                                id="image-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </CardHeader>
                        <CardContent>
                            {previewUrls.length === 0 ? (
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-10 text-center text-gray-500 hover:border-cyan-500/50 transition-colors">
                                    <Upload className="w-10 h-10 mx-auto mb-4 opacity-50" />
                                    <p>Belum ada gambar yang dipilih</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                                            <Image
                                                src={url}
                                                alt={`Preview ${index}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Varian Produk</CardTitle>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="hasVariants" className="cursor-pointer">Aktifkan Varian</Label>
                                <input
                                    id="hasVariants"
                                    type="checkbox"
                                    checked={hasVariants}
                                    onChange={(e) => setHasVariants(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 focus:ring-cyan-500"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!hasVariants ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Harga (Rp)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required={!hasVariants}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stok</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            required={!hasVariants}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {variants.map((variant, index) => (
                                        <div key={index} className="flex gap-4 items-end bg-white/5 p-4 rounded-lg border border-white/10">
                                            <div className="flex-1 space-y-2">
                                                <Label>Nama Varian</Label>
                                                <Input
                                                    value={variant.name}
                                                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                                    placeholder="Contoh: 1GB RAM"
                                                />
                                            </div>
                                            <div className="w-32 space-y-2">
                                                <Label>Harga</Label>
                                                <Input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <Label>Stok</Label>
                                                <Input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeVariant(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" onClick={addVariant} className="w-full border-dashed">
                                        <Plus className="w-4 h-4 mr-2" /> Tambah Varian
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kategori</Label>
                                <Select onValueChange={setCategoryId} value={categoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Tipe Produk</Label>
                                <Select onValueChange={setType} value={type}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MANUAL">Manual Delivery</SelectItem>
                                        <SelectItem value="AUTOMATED">Proses Otomatis</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 h-12 text-lg font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                Simpan Produk
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
