import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { authenticate, isAdmin, AuthRequest } from '../middleware/auth.middleware.js';

export const router = Router();

// Ensure upload directories exist
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const PRODUCT_UPLOAD_DIR = path.join(UPLOAD_DIR, 'products');
const CATEGORY_UPLOAD_DIR = path.join(UPLOAD_DIR, 'categories');

[UPLOAD_DIR, PRODUCT_UPLOAD_DIR, CATEGORY_UPLOAD_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PRODUCT_UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        // Generate unique filename: timestamp-random-originalname
        const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
        const ext = path.extname(file.originalname).toLowerCase();
        const safeName = file.originalname
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);
        cb(null, `${uniqueSuffix}-${safeName}${ext}`);
    },
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 10, // Max 10 files at once
    },
});

// Upload single image
router.post(
    '/single',
    authenticate,
    isAdmin,
    upload.single('image'),
    async (req: AuthRequest, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'File tidak ditemukan' });
            }

            const baseUrl = process.env.APP_URL || `http://localhost:${process.env.SERVER_PORT || 3001}`;
            const relativePath = `/uploads/products/${req.file.filename}`;
            const fullUrl = `${baseUrl}${relativePath}`;

            // Save to database
            const uploadRecord = await prisma.upload.create({
                data: {
                    filename: req.file.originalname,
                    path: relativePath,
                    url: fullUrl,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                },
            });

            res.json({
                message: 'Upload berhasil',
                file: {
                    id: uploadRecord.id,
                    url: fullUrl,
                    path: relativePath,
                    filename: req.file.filename,
                    size: req.file.size,
                },
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Gagal mengupload file' });
        }
    }
);

// Upload multiple images
router.post(
    '/multiple',
    authenticate,
    isAdmin,
    upload.array('images', 10),
    async (req: AuthRequest, res: Response) => {
        try {
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return res.status(400).json({ error: 'File tidak ditemukan' });
            }

            const baseUrl = process.env.APP_URL || `http://localhost:${process.env.SERVER_PORT || 3001}`;

            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const relativePath = `/uploads/products/${file.filename}`;
                    const fullUrl = `${baseUrl}${relativePath}`;

                    const uploadRecord = await prisma.upload.create({
                        data: {
                            filename: file.originalname,
                            path: relativePath,
                            url: fullUrl,
                            mimetype: file.mimetype,
                            size: file.size,
                        },
                    });

                    return {
                        id: uploadRecord.id,
                        url: fullUrl,
                        path: relativePath,
                        filename: file.filename,
                        size: file.size,
                    };
                })
            );

            res.json({
                message: `${uploadedFiles.length} file berhasil diupload`,
                files: uploadedFiles,
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Gagal mengupload file' });
        }
    }
);

// Delete uploaded file
router.delete('/:id', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const upload = await prisma.upload.findUnique({
            where: { id: req.params.id },
        });

        if (!upload) {
            return res.status(404).json({ error: 'File tidak ditemukan' });
        }

        // Delete physical file
        const filePath = path.join(process.cwd(), 'public', upload.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await prisma.upload.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'File berhasil dihapus' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Gagal menghapus file' });
    }
});

// List all uploads
router.get('/', authenticate, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { page = '1', limit = '20' } = req.query;

        const take = parseInt(limit as string);
        const skip = (parseInt(page as string) - 1) * take;

        const [uploads, total] = await Promise.all([
            prisma.upload.findMany({
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            prisma.upload.count(),
        ]);

        res.json({
            uploads,
            pagination: {
                page: parseInt(page as string),
                limit: take,
                total,
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('List uploads error:', error);
        res.status(500).json({ error: 'Gagal mengambil daftar file' });
    }
});
