import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                // Cyber Marine Theme
                background: 'hsl(222, 47%, 5%)',      // Slate-950
                foreground: 'hsl(210, 20%, 90%)',     // Slate-200

                card: {
                    DEFAULT: 'hsl(222, 47%, 8%)',        // Slate-900
                    foreground: 'hsl(210, 20%, 90%)',
                },

                popover: {
                    DEFAULT: 'hsl(222, 47%, 8%)',
                    foreground: 'hsl(210, 20%, 90%)',
                },

                primary: {
                    DEFAULT: 'hsl(188, 94%, 43%)',       // Cyan-500
                    foreground: 'hsl(222, 47%, 5%)',
                    50: 'hsl(183, 100%, 96%)',
                    100: 'hsl(185, 96%, 90%)',
                    200: 'hsl(186, 94%, 82%)',
                    300: 'hsl(187, 92%, 69%)',
                    400: 'hsl(188, 86%, 53%)',
                    500: 'hsl(188, 94%, 43%)',
                    600: 'hsl(191, 91%, 37%)',
                    700: 'hsl(193, 82%, 31%)',
                    800: 'hsl(194, 70%, 27%)',
                    900: 'hsl(196, 64%, 24%)',
                },

                secondary: {
                    DEFAULT: 'hsl(215, 28%, 17%)',       // Slate-800
                    foreground: 'hsl(210, 20%, 90%)',
                },

                accent: {
                    DEFAULT: 'hsl(160, 84%, 39%)',       // Emerald-500
                    foreground: 'hsl(222, 47%, 5%)',
                },

                muted: {
                    DEFAULT: 'hsl(215, 28%, 17%)',
                    foreground: 'hsl(215, 16%, 47%)',
                },

                destructive: {
                    DEFAULT: 'hsl(0, 84%, 60%)',
                    foreground: 'hsl(210, 20%, 98%)',
                },

                border: 'hsl(215, 28%, 17%)',
                input: 'hsl(215, 28%, 17%)',
                ring: 'hsl(188, 94%, 43%)',

                // Status colors
                success: 'hsl(160, 84%, 39%)',         // Emerald
                warning: 'hsl(45, 93%, 47%)',          // Amber
                info: 'hsl(188, 94%, 43%)',            // Cyan
                error: 'hsl(0, 84%, 60%)',             // Red
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                    },
                    '50%': {
                        boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)'
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                shimmer: 'shimmer 2s infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                float: 'float 3s ease-in-out infinite',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-gradient': 'linear-gradient(135deg, hsl(222, 47%, 5%) 0%, hsl(215, 28%, 12%) 50%, hsl(222, 47%, 5%) 100%)',
                'card-gradient': 'linear-gradient(180deg, hsl(222, 47%, 10%) 0%, hsl(222, 47%, 6%) 100%)',
                'glow-gradient': 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};

export default config;
