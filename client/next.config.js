/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', // For Docker deployment
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    async rewrites() {
        // Proxy API requests to backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://server:3001/api';
        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;
