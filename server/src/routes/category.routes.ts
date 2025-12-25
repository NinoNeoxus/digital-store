import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth.middleware.js';

export const router = Router();

// Get all categories (public)
router.get('/', async (_req: Request, res: Response) => {
    try {
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });

        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Gagal mengambil kategori' });
    }
});

// Get category by slug with products
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const category = await prisma.category.findUnique({
            where: { slug: req.params.slug },
            include: {
                products: {
                    where: { isActive: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!category) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        res.json({ category });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ error: 'Gagal mengambil kategori' });
    }
});

// Create category (admin only)
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, slug, description, image, sortOrder } = req.body;

        const category = await prisma.category.create({
            data: { name, slug, description, image, sortOrder },
        });

        res.status(201).json({ message: 'Kategori berhasil dibuat', category });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Gagal membuat kategori' });
    }
});

// Update category (admin only)
router.put('/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const category = await prisma.category.update({
            where: { id: req.params.id },
            data: req.body,
        });

        res.json({ message: 'Kategori berhasil diupdate', category });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Gagal mengupdate kategori' });
    }
});

// Delete category (admin only)
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.category.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Gagal menghapus kategori' });
    }
});
