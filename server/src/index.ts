import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import { router as authRoutes } from './routes/auth.routes.js';
import { router as productRoutes } from './routes/product.routes.js';
import { router as categoryRoutes } from './routes/category.routes.js';
import { router as orderRoutes } from './routes/order.routes.js';
import { router as uploadRoutes } from './routes/upload.routes.js';
import { prisma } from './config/database.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.SERVER_PORT || 3001;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to load
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: 'Terlalu banyak request, coba lagi nanti.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Health check
app.get('/api/health', async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: 'connected',
            app: 'Schnuffelll Shop API v1.0'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'disconnected'
        });
    }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err.message);

    // Multer errors
    if (err.name === 'MulterError') {
        if (err.message === 'File too large') {
            return res.status(400).json({ error: 'File terlalu besar (max 5MB)' });
        }
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan internal'
            : err.message
    });
});

// Start server
async function main() {
    try {
        await prisma.$connect();
        console.log('📦 Database connected');

        app.listen(PORT, () => {
            console.log(`🚀 Schnuffelll Shop API running on port ${PORT}`);
            console.log(`📍 Health: http://localhost:${PORT}/api/health`);
            console.log(`🖼️  Uploads: http://localhost:${PORT}/uploads`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

main();

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
