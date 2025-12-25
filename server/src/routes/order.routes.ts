import { Router, Response } from 'express';
import { prisma } from '../config/database.js';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth.middleware.js';
import { Decimal } from '@prisma/client/runtime/library';

export const router = Router();

// Generate order number
function generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${dateStr}-${random}`;
}

// Get user orders
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user?.userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: { name: true, slug: true, thumbnail: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ orders });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Gagal mengambil pesanan' });
    }
});

// Get single order
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: req.params.id,
                userId: req.user?.role === 'ADMIN' ? undefined : req.user?.userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                        credentials: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
        }

        res.json({ order });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Gagal mengambil pesanan' });
    }
});

// Create order (checkout)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { items, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Keranjang kosong' });
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        // Get products with variants
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
            include: { variants: true },
        });

        if (products.length !== items.length) {
            return res.status(400).json({ error: 'Beberapa produk tidak tersedia' });
        }

        let subtotal = new Decimal(0);
        const orderItems: any[] = [];

        for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) continue;

            // Determine variant (use request variantId or default to first active variant)
            let variant = item.variantId
                ? product.variants.find(v => v.id === item.variantId)
                : product.variants.find(v => v.isActive);

            if (!variant && product.variants.length > 0) {
                variant = product.variants[0];
            }

            if (!variant) {
                return res.status(400).json({ error: `Varian produk ${product.name} tidak tersedia` });
            }

            // Check stock
            if (variant.stock < item.quantity) {
                return res.status(400).json({
                    error: `Stok ${product.name} (${variant.name}) tidak mencukupi`
                });
            }

            const price = variant.price;
            const itemTotal = price.mul(item.quantity);
            subtotal = subtotal.add(itemTotal);

            orderItems.push({
                productId: product.id,
                productName: product.name,
                variantId: variant.id,
                variantName: variant.name,
                quantity: item.quantity,
                unitPrice: price,
                totalPrice: itemTotal,
            });
        }

        // Apply coupon if provided
        let discount = new Decimal(0);
        let couponId: string | undefined;

        if (couponCode) {
            const coupon = await prisma.coupon.findUnique({
                where: { code: couponCode },
            });

            if (coupon && coupon.isActive) {
                const now = new Date();
                const isValid =
                    coupon.validFrom <= now &&
                    (!coupon.validUntil || coupon.validUntil >= now) &&
                    (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) &&
                    (!coupon.minPurchase || subtotal.gte(coupon.minPurchase));

                if (isValid) {
                    if (coupon.type === 'PERCENTAGE') {
                        discount = subtotal.mul(coupon.value).div(100);
                        if (coupon.maxDiscount && discount.gt(coupon.maxDiscount)) {
                            discount = coupon.maxDiscount;
                        }
                    } else {
                        discount = coupon.value;
                    }
                    couponId = coupon.id;
                }
            }
        }

        const totalAmount = subtotal.sub(discount);

        // Create order
        const order = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                userId: user.id,
                customerName: user.name,
                customerEmail: user.email,
                subtotal,
                discount,
                totalAmount,
                couponId,
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: true,
            },
        });

        // Update coupon usage and stock
        if (couponId) {
            await prisma.coupon.update({
                where: { id: couponId },
                data: { usageCount: { increment: 1 } },
            });
        }

        // Update stock for each item
        for (const item of orderItems) {
            await prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
            });
        }

        res.status(201).json({
            message: 'Pesanan berhasil dibuat',
            order,
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Gagal membuat pesanan' });
    }
});

// Get all orders (admin only)
router.get('/admin/all', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;

        const take = parseInt(limit as string);
        const skip = (parseInt(page as string) - 1) * take;

        const where: any = {};
        if (status) where.status = status;

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            prisma.order.count({ where }),
        ]);

        res.json({
            orders,
            pagination: {
                page: parseInt(page as string),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ error: 'Gagal mengambil pesanan' });
    }
});

// Update order status (admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                status,
                ...(status === 'PAID' && { paidAt: new Date() }),
                ...(status === 'PROCESSING' && { processedAt: new Date() }),
                ...(status === 'COMPLETED' && { completedAt: new Date() }),
            },
        });

        res.json({ message: 'Status pesanan diupdate', order });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Gagal mengupdate status pesanan' });
    }
});
