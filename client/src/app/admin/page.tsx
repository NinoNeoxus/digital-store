import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-gray-400 mt-1">Overview statistik toko anda</p>
                </div>
                <div className="flex gap-4">
                    <Button asChild className="bg-cyan-600 hover:bg-cyan-700">
                        <Link href="/admin/products/new">
                            + Tambah Produk
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Pendapatan</CardTitle>
                        <DollarSign className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 45.2M</div>
                        <p className="text-xs text-green-500 font-medium">+20.1% dari bulan lalu</p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Pesanan</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-green-500 font-medium">+180.1% dari bulan lalu</p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Produk Aktif</CardTitle>
                        <Package className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-gray-500 font-medium">4 kategori utama</p>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-green-500 font-medium">+201 sejak minggu lalu</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
