import { PrismaClient, ProductType, Role, CouponType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ==========================================
    // Create Admin User
    // ==========================================
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@schnuffelll.shop' },
        update: {},
        create: {
            name: 'Administrator',
            email: 'admin@schnuffelll.shop',
            password: hashedPassword,
            role: Role.ADMIN,
            balance: 0,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // ==========================================
    // Create Categories
    // ==========================================
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'vps-server' },
            update: {},
            create: {
                name: 'VPS & Server',
                slug: 'vps-server',
                description: 'Virtual Private Server dengan performa tinggi untuk website dan aplikasi Anda.',
                image: '/uploads/categories/vps.png',
                sortOrder: 1,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'pterodactyl' },
            update: {},
            create: {
                name: 'Pterodactyl Hosting',
                slug: 'pterodactyl',
                description: 'Game server hosting dengan panel Pterodactyl yang mudah digunakan.',
                image: '/uploads/categories/pterodactyl.png',
                sortOrder: 2,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'game-topup' },
            update: {},
            create: {
                name: 'Game Top Up',
                slug: 'game-topup',
                description: 'Top up diamond, UC, dan mata uang game lainnya dengan harga terbaik.',
                image: '/uploads/categories/gaming.png',
                sortOrder: 3,
            },
        }),
        prisma.category.upsert({
            where: { slug: 'akun-premium' },
            update: {},
            create: {
                name: 'Akun Premium',
                slug: 'akun-premium',
                description: 'Akun premium Netflix, Spotify, dan layanan streaming lainnya.',
                image: '/uploads/categories/premium.png',
                sortOrder: 4,
            },
        }),
    ]);
    console.log('✅ Categories created:', categories.length);

    // ==========================================
    // Create Products with Variants
    // ==========================================

    // VPS Products
    const vpsProduct = await prisma.product.upsert({
        where: { slug: 'vps-high-performance' },
        update: {},
        create: {
            name: 'VPS High Performance',
            slug: 'vps-high-performance',
            description: `
        <h2>VPS High Performance Indonesia</h2>
        <p>Virtual Private Server dengan performa tinggi untuk kebutuhan bisnis Anda. Didukung oleh infrastruktur premium dengan uptime 99.9%.</p>
        <h3>Keunggulan:</h3>
        <ul>
          <li>✅ Full Root Access</li>
          <li>✅ SSD NVMe Storage</li>
          <li>✅ Dedicated Resources</li>
          <li>✅ DDoS Protection</li>
          <li>✅ 24/7 Support</li>
        </ul>
        <p>Cocok untuk: Website, API Server, Game Server, VPN, dan lainnya.</p>
      `,
            shortDesc: 'VPS Indonesia dengan SSD NVMe dan uptime 99.9%',
            categoryId: categories[0].id,
            type: ProductType.AUTOMATED,
            isActive: true,
            isFeatured: true,
        },
    });

    await prisma.productVariant.createMany({
        data: [
            {
                name: 'Starter - 1GB RAM',
                price: 50000,
                comparePrice: 75000,
                stock: 99,
                productId: vpsProduct.id,
                sortOrder: 0,
                serverConfig: JSON.stringify({ ram: 1024, cpu: 1, disk: 20, bandwidth: 1000 }),
            },
            {
                name: 'Basic - 2GB RAM',
                price: 100000,
                comparePrice: 150000,
                stock: 99,
                productId: vpsProduct.id,
                sortOrder: 1,
                serverConfig: JSON.stringify({ ram: 2048, cpu: 1, disk: 40, bandwidth: 2000 }),
            },
            {
                name: 'Standard - 4GB RAM',
                price: 200000,
                comparePrice: 300000,
                stock: 99,
                productId: vpsProduct.id,
                sortOrder: 2,
                serverConfig: JSON.stringify({ ram: 4096, cpu: 2, disk: 80, bandwidth: 3000 }),
            },
            {
                name: 'Pro - 8GB RAM',
                price: 400000,
                comparePrice: 500000,
                stock: 99,
                productId: vpsProduct.id,
                sortOrder: 3,
                serverConfig: JSON.stringify({ ram: 8192, cpu: 4, disk: 160, bandwidth: 5000 }),
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ VPS Product created with 4 variants');

    // Pterodactyl Products
    const mcProduct = await prisma.product.upsert({
        where: { slug: 'minecraft-server-hosting' },
        update: {},
        create: {
            name: 'Minecraft Server Hosting',
            slug: 'minecraft-server-hosting',
            description: `
        <h2>Minecraft Server Hosting</h2>
        <p>Hosting server Minecraft dengan panel Pterodactyl. Setup instan, plugin support, dan backup otomatis.</p>
        <h3>Fitur:</h3>
        <ul>
          <li>✅ Panel Pterodactyl</li>
          <li>✅ Unlimited Slots</li>
          <li>✅ Free Subdomain</li>
          <li>✅ Auto Backup Daily</li>
          <li>✅ Plugin & Mod Support</li>
          <li>✅ Instant Setup</li>
        </ul>
      `,
            shortDesc: 'Server Minecraft dengan panel mudah dan setup instan',
            categoryId: categories[1].id,
            type: ProductType.AUTOMATED,
            isActive: true,
            isFeatured: true,
        },
    });

    await prisma.productVariant.createMany({
        data: [
            {
                name: '2GB RAM (10-15 Players)',
                price: 35000,
                stock: 99,
                productId: mcProduct.id,
                sortOrder: 0,
                serverConfig: JSON.stringify({ ram: 2048, cpu: 100, disk: 10 }),
            },
            {
                name: '4GB RAM (20-30 Players)',
                price: 65000,
                stock: 99,
                productId: mcProduct.id,
                sortOrder: 1,
                serverConfig: JSON.stringify({ ram: 4096, cpu: 150, disk: 20 }),
            },
            {
                name: '8GB RAM (50+ Players)',
                price: 120000,
                stock: 99,
                productId: mcProduct.id,
                sortOrder: 2,
                serverConfig: JSON.stringify({ ram: 8192, cpu: 200, disk: 40 }),
            },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Minecraft Product created with 3 variants');

    // Game Topup - Mobile Legends
    const mlProduct = await prisma.product.upsert({
        where: { slug: 'mobile-legends-diamonds' },
        update: {},
        create: {
            name: 'Mobile Legends Diamonds',
            slug: 'mobile-legends-diamonds',
            description: `
        <h2>Top Up Diamond Mobile Legends</h2>
        <p>Top up diamond Mobile Legends Bang Bang dengan harga termurah! Proses instan 24 jam.</p>
        <h3>Cara Order:</h3>
        <ol>
          <li>Pilih jumlah diamond</li>
          <li>Masukkan User ID dan Zone ID</li>
          <li>Selesaikan pembayaran</li>
          <li>Diamond masuk otomatis!</li>
        </ol>
      `,
            shortDesc: 'Top up diamond ML murah dan instan',
            categoryId: categories[2].id,
            type: ProductType.AUTOMATED,
            isActive: true,
            isFeatured: true,
        },
    });

    await prisma.productVariant.createMany({
        data: [
            { name: '86 Diamonds', price: 19000, stock: 999, productId: mlProduct.id, sortOrder: 0 },
            { name: '172 Diamonds', price: 38000, stock: 999, productId: mlProduct.id, sortOrder: 1 },
            { name: '257 Diamonds', price: 57000, stock: 999, productId: mlProduct.id, sortOrder: 2 },
            { name: '344 Diamonds', price: 76000, stock: 999, productId: mlProduct.id, sortOrder: 3 },
            { name: '429 Diamonds', price: 95000, stock: 999, productId: mlProduct.id, sortOrder: 4 },
            { name: '514 Diamonds', price: 114000, stock: 999, productId: mlProduct.id, sortOrder: 5 },
            { name: '706 Diamonds', price: 152000, stock: 999, productId: mlProduct.id, sortOrder: 6 },
            { name: '2195 Diamonds', price: 456000, stock: 999, productId: mlProduct.id, sortOrder: 7 },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Mobile Legends Product created with 8 variants');

    // Premium Accounts
    const netflixProduct = await prisma.product.upsert({
        where: { slug: 'netflix-premium' },
        update: {},
        create: {
            name: 'Netflix Premium',
            slug: 'netflix-premium',
            description: `
        <h2>Akun Netflix Premium</h2>
        <p>Nikmati streaming film dan series favorit dengan kualitas UHD 4K!</p>
        <h3>Detail:</h3>
        <ul>
          <li>✅ Private Account (1 Profile)</li>
          <li>✅ Kualitas UHD 4K</li>
          <li>✅ Bisa ganti password</li>
          <li>✅ Garansi sesuai durasi</li>
        </ul>
        <p><strong>Note:</strong> Jangan share akun ke orang lain untuk menghindari banned.</p>
      `,
            shortDesc: 'Akun Netflix Private, UHD 4K, Full Garansi',
            categoryId: categories[3].id,
            type: ProductType.MANUAL,
            isActive: true,
            isFeatured: true,
        },
    });

    await prisma.productVariant.createMany({
        data: [
            { name: '1 Bulan', price: 45000, comparePrice: 65000, stock: 10, productId: netflixProduct.id, sortOrder: 0 },
            { name: '3 Bulan', price: 120000, comparePrice: 180000, stock: 10, productId: netflixProduct.id, sortOrder: 1 },
            { name: '6 Bulan', price: 220000, comparePrice: 350000, stock: 10, productId: netflixProduct.id, sortOrder: 2 },
            { name: '12 Bulan', price: 400000, comparePrice: 650000, stock: 5, productId: netflixProduct.id, sortOrder: 3 },
        ],
        skipDuplicates: true,
    });
    console.log('✅ Netflix Product created with 4 variants');

    // ==========================================
    // Create Coupons
    // ==========================================
    await prisma.coupon.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            description: 'Diskon 10% untuk pembelian pertama',
            type: CouponType.PERCENTAGE,
            value: 10,
            minPurchase: 50000,
            maxDiscount: 50000,
            usageLimit: 100,
        },
    });

    await prisma.coupon.upsert({
        where: { code: 'NEWYEAR25' },
        update: {},
        create: {
            code: 'NEWYEAR25',
            description: 'Diskon 25% Tahun Baru 2024',
            type: CouponType.PERCENTAGE,
            value: 25,
            minPurchase: 100000,
            maxDiscount: 100000,
            usageLimit: 50,
            validUntil: new Date('2024-01-31'),
        },
    });

    await prisma.coupon.upsert({
        where: { code: 'HEMAT50K' },
        update: {},
        create: {
            code: 'HEMAT50K',
            description: 'Potongan langsung Rp 50.000',
            type: CouponType.FIXED,
            value: 50000,
            minPurchase: 200000,
            usageLimit: 100,
        },
    });
    console.log('✅ Coupons created: 3');

    console.log('');
    console.log('🎉 Seeding completed!');
    console.log('');
    console.log('📌 Default Admin Login:');
    console.log('   Email: admin@schnuffelll.shop');
    console.log('   Password: admin123');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
