import { Router, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export const router = Router();

// Validation schemas
const variantSchema = z.object({
    name: z.string().min(1, 'Nama varian wajib diisi'),
    price: z.number().positive('Harga harus lebih dari 0'),
    comparePrice: z.number().optional(),
    costPrice: z.number().optional(),
    stock: z.number().int().min(0).default(0),
    sku: z.string().optional(),
    serverConfig: z.any().optional(),
    apiConfig: z.any().optional(),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

const createProductSchema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    slug: z.string().min(1, 'Slug wajib diisi'),
    description: z.string().min(1, 'Deskripsi wajib diisi'),
    shortDesc: z.string().optional(),
    thumbnail: z.string().optional(),
    images: z.array(z.string()).default([]),
    categoryId: z.string().uuid('Category ID tidak valid'),
    type: z.enum(['AUTOMATED', 'MANUAL']).default('MANUAL'),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDesc: z.string().optional(),
    variants: z.array(variantSchema).min(1, 'Minimal 1 varian diperlukan'),
});

const updateProductSchema = createProductSchema.partial();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all products (public - with variants)
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            category,
            featured,
            search,
            limit = '12',
            page = '1',
            sort = 'newest'
        } = req.query;

        const take = Math.min(parseInt(limit as string) || 12, 50);
        const skip = (parseInt(page as string) - 1) * take;

        const where: Prisma.ProductWhereInput = { isActive: true };

        if (category) {
            where.category = { slug: category as string };
        }

        if (featured === 'true') {
            where.isFeatured = true;
        }

        if (search) {
            where.OR = [
                { name: { contains: search as string } },
                { description: { contains: search as string } },
            ];
        }

        // Sort options
        let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
        if (sort === 'oldest') orderBy = { createdAt: 'asc' };
        if (sort === 'name-asc') orderBy = { name: 'asc' };
        if (sort === 'name-desc') orderBy = { name: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    variants: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            comparePrice: true,
                            stock: true,
                        },
                    },
                },
                orderBy,
                take,
                skip,
            }),
            prisma.product.count({ where }),
        ]);

        // Add computed fields
        const productsWithPrice = products.map(product => ({
            ...product,
            // Get lowest and highest price from variants
            priceRange: {
                min: product.variants.length > 0
                    ? Math.min(...product.variants.map(v => Number(v.price)))
                    : 0,
                max: product.variants.length > 0
                    ? Math.max(...product.variants.map(v => Number(v.price)))
                    : 0,
            },
            // Check if any variant has stock
            inStock: product.variants.some(v => v.stock > 0),
        }));

        res.json({
            products: productsWithPrice,
            pagination: {
                page: parseInt(page as string),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Gagal mengambil produk' });
    }
});

// Get single product by slug (public)
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: { slug: req.params.slug },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
                variants: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        comparePrice: true,
                        stock: true,
                        sku: true,
                        serverConfig: true,
                    },
                },
            },
        });

        if (!product || !product.isActive) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        // Get related products
        const relatedProducts = await prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: product.id },
                isActive: true,
            },
            include: {
                variants: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                    select: { price: true },
                },
            },
            take: 4,
        });

        res.json({
            product,
            related: relatedProducts,
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Gagal mengambil produk' });
    }
});

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all products for admin (includes inactive)
router.get('/admin/all', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { page = '1', limit = '20', search, category, status } = req.query;

        const take = parseInt(limit as string);
        const skip = (parseInt(page as string) - 1) * take;

        const where: Prisma.ProductWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search as string } },
                { slug: { contains: search as string } },
            ];
        }

        if (category) {
            where.categoryId = category as string;
        }

        if (status === 'active') where.isActive = true;
        if (status === 'inactive') where.isActive = false;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true } },
                    variants: {
                        orderBy: { sortOrder: 'asc' },
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            stock: true,
                            isActive: true,
                        },
                    },
                    _count: { select: { orderItems: true } },
                },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            prisma.product.count({ where }),
        ]);

        res.json({
            products,
            pagination: {
                page: parseInt(page as string),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Admin get products error:', error);
        res.status(500).json({ error: 'Gagal mengambil produk' });
    }
});

// Get single product for admin (by ID)
router.get('/admin/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: {
                category: true,
                variants: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });

        if (!product) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Gagal mengambil produk' });
    }
});

// Create product with variants
router.post('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const data = createProductSchema.parse(req.body);
        const { variants, images, ...productData } = data;

        // Check slug uniqueness
        const existingSlug = await prisma.product.findUnique({
            where: { slug: data.slug },
        });
        if (existingSlug) {
            return res.status(400).json({ error: 'Slug sudah digunakan' });
        }

        // Create product with variants in transaction
        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
                data: {
                    ...productData,
                    images: {
                        create: images.map(url => ({ url }))
                    },
                    variants: {
                        create: variants.map((v, index) => ({
                            ...v,
                            price: v.price,
                            comparePrice: v.comparePrice ?? null,
                            costPrice: v.costPrice ?? null,
                            sortOrder: v.sortOrder ?? index,
                            serverConfig: v.serverConfig ? JSON.stringify(v.serverConfig) : undefined,
                            apiConfig: v.apiConfig ? JSON.stringify(v.apiConfig) : undefined,
                        })),
                    },
                },
                include: {
                    variants: true,
                    images: true,
                    category: { select: { id: true, name: true } },
                },
            });

            return newProduct;
        });

        res.status(201).json({
            message: 'Produk berhasil dibuat',
            product,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validasi gagal',
                details: error.errors,
            });
        }
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Gagal membuat produk' });
    }
});

// Update product
router.put('/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const data = updateProductSchema.parse(req.body);
        const { variants, images, ...productData } = data;

        const existingProduct = await prisma.product.findUnique({
            where: { id: req.params.id },
        });

        if (!existingProduct) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        // Check slug uniqueness if changed
        if (data.slug && data.slug !== existingProduct.slug) {
            const slugExists = await prisma.product.findUnique({
                where: { slug: data.slug },
            });
            if (slugExists) {
                return res.status(400).json({ error: 'Slug sudah digunakan' });
            }
        }

        // Update in transaction
        const product = await prisma.$transaction(async (tx) => {
            // Update product
            await tx.product.update({
                where: { id: req.params.id },
                data: productData,
            });

            // Handle images
            if (images) {
                await tx.productImage.deleteMany({
                    where: { productId: req.params.id }
                });

                // Create image records one by one or createMany if supported (SQLite supports createMany in recent Prisma)
                // But ProductImage is a model.
                // Safest to map create.
                for (const url of images) {
                    await tx.productImage.create({
                        data: { url, productId: req.params.id }
                    })
                }
            }

            // Handle variants if provided
            if (variants && variants.length > 0) {
                // Delete old variants and create new ones
                await tx.productVariant.deleteMany({
                    where: { productId: req.params.id },
                });

                await tx.productVariant.createMany({
                    data: variants.map((v, index) => ({
                        ...v,
                        productId: req.params.id,
                        price: v.price,
                        comparePrice: v.comparePrice ?? null,
                        costPrice: v.costPrice ?? null,
                        sortOrder: v.sortOrder ?? index,
                        serverConfig: v.serverConfig ? JSON.stringify(v.serverConfig) : undefined,
                        apiConfig: v.apiConfig ? JSON.stringify(v.apiConfig) : undefined,
                    })),
                });
            }

            return tx.product.findUnique({
                where: { id: req.params.id },
                include: {
                    variants: { orderBy: { sortOrder: 'asc' } },
                    images: true,
                    category: { select: { id: true, name: true } },
                },
            });
        });

        res.json({
            message: 'Produk berhasil diupdate',
            product,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validasi gagal',
                details: error.errors,
            });
        }
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Gagal mengupdate produk' });
    }
});

// Update variant stock only
router.patch('/variant/:variantId/stock', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { stock } = req.body;

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: 'Stok harus berupa angka positif' });
        }

        const variant = await prisma.productVariant.update({
            where: { id: req.params.variantId },
            data: { stock },
        });

        res.json({
            message: 'Stok berhasil diupdate',
            variant,
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ error: 'Gagal mengupdate stok' });
    }
});

// Delete product
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        // Check if product has orders
        const orderCount = await prisma.orderItem.count({
            where: { productId: req.params.id },
        });

        if (orderCount > 0) {
            // Soft delete - just deactivate
            await prisma.product.update({
                where: { id: req.params.id },
                data: { isActive: false },
            });
            return res.json({
                message: 'Produk dinonaktifkan (ada order terkait)',
            });
        }

        // Hard delete if no orders
        await prisma.product.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Produk berhasil dihapus' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Gagal menghapus produk' });
    }
});

// Toggle product status
router.patch('/:id/toggle', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
        });

        if (!product) {
            return res.status(404).json({ error: 'Produk tidak ditemukan' });
        }

        const updated = await prisma.product.update({
            where: { id: req.params.id },
            data: { isActive: !product.isActive },
        });

        res.json({
            message: `Produk ${updated.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
            product: updated,
        });
    } catch (error) {
        console.error('Toggle product error:', error);
        res.status(500).json({ error: 'Gagal mengubah status produk' });
    }
});
