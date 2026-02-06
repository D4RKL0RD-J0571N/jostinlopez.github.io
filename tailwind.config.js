/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    base: 'var(--bg-base)',
                    surface: 'var(--bg-surface)',
                    elevated: 'var(--bg-elevated)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    hover: 'var(--accent-hover)',
                    glow: 'var(--accent-glow)',
                },
                text: {
                    primary: 'var(--text-primary)',
                    secondary: 'var(--text-secondary)',
                }
            },
            fontFamily: {
                sans: ['var(--font-base)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn var(--duration-normal) var(--easing-default) forwards',
                'slide-up': 'slideUp var(--duration-normal) var(--easing-default) forwards',
            },
            transitionDuration: {
                'fast': 'var(--duration-fast)',
                'normal': 'var(--duration-normal)',
                'slow': 'var(--duration-slow)',
            },
            transitionTimingFunction: {
                'default': 'var(--easing-default)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
