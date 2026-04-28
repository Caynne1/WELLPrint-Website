/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: '#334155',
        },
        ivory: {
          50: 'var(--ivory-50)',
          100: 'var(--ivory-100)',
          200: 'var(--ivory-200)',
          300: 'var(--ivory-300)',
          400: '#94a3b8',
        },
        wp: {
          green: '#13A150',
          cyan: '#1993D2',
          magenta: '#cd1b6e',
          yellow: '#FDC010',
          black: '#0d1f3c',
          'green-dark': '#0e8040',
          'green-light': '#1dc76a',
          'cyan-dark': '#1270a8',
          'cyan-light': '#3db0f0',
          'yellow-dark': '#c99a00',
          'gray-bg': '#f7f9ff',
        },
        press: {
          red: '#cd1b6e',
          amber: '#fdc010',
          gold: '#fdc010',
          slate: '#475569',
        },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1.0' }],
        '9xl': ['7rem', { lineHeight: '0.95' }],
        '10xl': ['8rem', { lineHeight: '0.9' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      backgroundImage: {
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-left': 'slideLeft 0.8s ease forwards',
        marquee: 'marquee 35s linear infinite',
        'line-draw': 'lineDraw 1.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        lineDraw: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      boxShadow: {
        press: '0 10px 28px rgba(19, 161, 80, 0.24)',
        'press-lg': '0 18px 40px rgba(19, 161, 80, 0.30)',
        'press-cyan': '0 10px 28px rgba(25, 147, 210, 0.24)',
        'glow-green': '0 0 40px rgba(19, 161, 80, 0.28)',
        'glow-cyan': '0 0 40px rgba(25, 147, 210, 0.24)',
        'glow-yellow': '0 0 40px rgba(253, 192, 16, 0.20)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.32)',
        'card-light': '0 4px 20px rgba(13, 31, 60, 0.08)',
        'inset-ink': 'inset 0 2px 8px rgba(0,0,0,0.2)',
      },
      borderWidth: {
        3: '3px',
      },
    },
  },
  plugins: [],
}