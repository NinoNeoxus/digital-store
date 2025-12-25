'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Check } from 'lucide-react';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Register feature coming soon!');
        }, 1000);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12">
            <div className="w-full max-w-md">
                <div className="glass-card p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
                        <p className="text-muted-foreground mt-2">
                            Daftar untuk mulai belanja di Schnuffelll Shop
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama Lengkap</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nomor WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="tel"
                                    placeholder="08123456789"
                                    className="w-full pl-10 pr-4 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Minimal 8 karakter"
                                    className="w-full pl-10 pr-12 py-3 bg-card border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-4 h-4 mt-1 rounded border-white/10 bg-card focus:ring-primary"
                                required
                            />
                            <label htmlFor="terms" className="text-sm text-muted-foreground">
                                Saya setuju dengan{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Syarat & Ketentuan
                                </Link>{' '}
                                dan{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Kebijakan Privasi
                                </Link>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Benefits */}
                    <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-medium text-sm mb-3">Keuntungan Mendaftar:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" />
                                Proses checkout lebih cepat
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" />
                                Riwayat pesanan lengkap
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-accent" />
                                Promo & diskon eksklusif
                            </li>
                        </ul>
                    </div>

                    {/* Login link */}
                    <p className="text-center mt-6 text-muted-foreground">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
