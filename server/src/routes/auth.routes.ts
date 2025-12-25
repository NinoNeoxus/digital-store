import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';

export const router = Router();

// Validation schemas
const registerSchema = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password wajib diisi'),
});

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            message: 'Registrasi berhasil',
            user,
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Register error:', error);
        res.status(500).json({ error: 'Gagal mendaftar' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        if (!user.isActive) {
            return res.status(401).json({ error: 'Akun dinonaktifkan' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email atau password salah' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            message: 'Login berhasil',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                balance: user.balance,
            },
            token,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Gagal login' });
    }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                balance: true,
                avatar: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Gagal mengambil data user' });
    }
});
