import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format currency to Indonesian Rupiah
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

// Format date to Indonesian format
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

// Format date with time
export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

// Generate slug from string
export function generateSlug(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Truncate text
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Calculate discount percentage
export function getDiscountPercent(original: number, sale: number): number {
    if (original <= 0) return 0;
    return Math.round(((original - sale) / original) * 100);
}

// API fetch wrapper
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetcher<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Something went wrong');
    }

    return res.json();
}

// Authenticated fetch
export async function authFetcher<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
): Promise<T> {
    return fetcher<T>(endpoint, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...options?.headers,
        },
    });
}

// Get upload URL
export function getUploadUrl(path: string | null | undefined): string {
    if (!path) return '/placeholder.jpg';
    if (path.startsWith('http')) return path;
    const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:3001';
    return `${uploadUrl}${path}`;
}
