/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'var(--ink-950)',
          900: 'var(--ink-900)',
          800: 'var(--ink-800)',
          700: 'var(--ink-700)',
          600: '#2E2E2E',
        },
        ivory: {
          50:  'var(--ivory-50)',
          100: 'var(--ivory-100)',
          200: 'var(--ivory-200)',
          300: 'var(--ivory-300)',
          400: '#AAAAAA',
        },
        // WellPrint brand colors — extracted from logo
        wp: {
          green:   '#2DB04B',  // primary — the P letter
          cyan:    '#29ABE2',  // CMYK cyan layer
          magenta: '#EC008C',  // CMYK magenta layer
          yellow:  '#FBB03B',  // CMYK yellow layer
          black:   '#231F20',  // CMYK key/black layer
          'green-dark':  '#1E8A38',
          'green-light': '#3FCF5E',
          'cyan-dark':   '#1A8AB5',
          'gray-bg':     '#F5F5F5',
        },
        press: {
          red:    '#EC008C',
          amber:  '#FBB03B',
          gold:   '#FBB03B',
          slate:  '#4A5568',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '8xl':  ['6rem',   { lineHeight: '1.0' }],
        '9xl':  ['7.5rem', { lineHeight: '0.95' }],
        '10xl': ['9rem',   { lineHeight: '0.9' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up':       'fadeUp 0.7s ease forwards',
        'fade-in':       'fadeIn 0.5s ease forwards',
        'slide-left':    'slideLeft 0.8s ease forwards',
        'press-stamp':   'pressStamp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'marquee':       'marquee 30s linear infinite',
        'line-draw':     'lineDraw 1.2s ease forwards',
        'counter':       'counter 2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pressStamp: {
          '0%':   { opacity: '0', transform: 'scale(1.3)' },
          '60%':  { transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        lineDraw: {
          '0%':   { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      boxShadow: {
        'press':      '4px 4px 0px #231F20',
        'press-lg':   '6px 6px 0px #231F20',
        'glow-green': '0 0 30px rgba(45,176,75,0.25)',
        'glow-cyan':  '0 0 30px rgba(41,171,226,0.2)',
        'inset-ink':  'inset 0 2px 8px rgba(0,0,0,0.2)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}