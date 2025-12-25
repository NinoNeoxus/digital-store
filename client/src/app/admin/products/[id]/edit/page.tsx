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
import { X, Plus, Upload, Loader2, Save, Trash2, ImagePlus, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface ProductImage {
    id: string;
    url: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Form State
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [shortDesc, setShortDesc] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [type, setType] = useState('MANUAL');

    // Images
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // Variants
    const [hasVariants, setHasVariants] = useState(false);
    const [variants, setVariants] = useState<{ name: string, price: number, stock: number }[]>([
        { name: 'Default', price: 0, stock: 0 }
    ]);
    const [singlePrice, setSinglePrice] = useState('0');
    const [singleStock, setSingleStock] = useState('0');

    // Fetch Initial Data
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Categories
                const catRes = await fetch('/api/categories?limit=100');
                const catData = await catRes.json();
                if (catData.categories) setCategories(catData.categories);

                // 2. Product Data
                const prodRes = await fetch(`/api/products/admin/${params.id}`);
                if (!prodRes.ok) throw new Error('Produk tidak ditemukan');
                const prodData = await prodRes.json();
                const p = prodData.product;

                setName(p.name);
                setSlug(p.slug);
                setDescription(p.description);
                setShortDesc(p.shortDesc || '');
                setCategoryId(p.categoryId);
                setType(p.type);

                // Images
                if (p.images && p.images.length > 0) {
                    setExistingImages(p.images.map((img: ProductImage) => img.url));
                }

                // Variants
                if (p.variants && p.variants.length > 0) {
                    // Check if it's effectively single variant or multi
                    // Logic: If 1 variant named "Default", treat as Single.
                    const isSingle = p.variants.length === 1 && p.variants[0].name === 'Default';

                    if (isSingle) {
                        setHasVariants(false);
                        setSinglePrice(p.variants[0].price);
                        setSingleStock(p.variants[0].stock);
                        setVariants([{ ...p.variants[0], name: 'Default' }]);
                    } else {
                        setHasVariants(true);
                        setVariants(p.variants.map((v: any) => ({
                            name: v.name,
                            price: Number(v.price),
                            stock: Number(v.stock)
                        })));
                    }
                }
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Error', description: 'Gagal memuat data produk' });
                router.push('/admin/products');
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [params.id, router, toast]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...files]);
            const newUrls = files.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prev => [...prev, ...newUrls]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
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

            // 1. Upload NEW Images
            let finalImageUrls = [...existingImages];

            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach(image => formData.append('images', image));

                const uploadRes = await fetch('/api/upload/multiple', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadRes.ok) throw new Error('Gagal upload gambar');
                const uploadData = await uploadRes.json();
                if (uploadData.files) {
                    finalImageUrls = [...finalImageUrls, ...uploadData.files.map((f: any) => f.url)];
                }
            }

            // 2. Prepare Data
            const productData = {
                name,
                slug,
                description,
                shortDesc,
                categoryId,
                type,
                images: finalImageUrls, // REPLACES existing images in backend logic
                variants: hasVariants ? variants.map((v, idx) => ({
                    ...v,
                    price: Number(v.price),
                    stock: Number(v.stock),
                    sortOrder: idx
                })) : [
                    {
                        name: 'Default',
                        price: Number(singlePrice),
                        stock: Number(singleStock),
                        sortOrder: 0
                    }
                ]
            };

            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Gagal update produk');
            }

            toast({ title: 'Berhasil', description: 'Produk berhasil diupdate' });
            router.push('/admin/products');
            router.refresh(); // Refresh server components

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Edit Produk</h1>
                        <p className="text-gray-400">Edit detail produk {name}</p>
                    </div>
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
                                    value={shortDesc}
                                    onChange={(e) => setShortDesc(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi Lengkap</Label>
                                <Textarea
                                    id="description"
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
                                + Upload Baru
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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Existing Images */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
                                        <Image
                                            src={url}
                                            alt={`Existing ${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-1 left-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white">Terupload</div>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Images */}
                                {newImagePreviews.map((url, index) => (
                                    <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-cyan-500/50">
                                        <Image
                                            src={url}
                                            alt={`New ${index}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-1 left-1 bg-cyan-600/80 px-2 py-0.5 rounded text-[10px] text-white">Baru</div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
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
                                            value={singlePrice}
                                            onChange={(e) => setSinglePrice(e.target.value)}
                                            required={!hasVariants}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stok</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={singleStock}
                                            onChange={(e) => setSingleStock(e.target.value)}
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
                                Update Produk
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
