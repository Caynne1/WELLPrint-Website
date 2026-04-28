import { useTheme } from '../../context/ThemeContext'

const BRAND = {
  green:  '#13A150',
  cyan:   '#1993D2',
  yellow: '#FDC010',
}

export default function PageHero({ label, title, titleAccent, subtitle, children }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section
      className="relative pt-16 sm:pt-20 pb-10 overflow-hidden"
      style={{ background: isDark ? '#0e1e33' : '#ffffff' }}
    >
      {/* CMYK bar top */}
      <div className="absolute top-0 left-0 right-0 cmyk-bar" aria-hidden="true" />

      {/* Floating orb decorations */}
      <div
        className="orb orb-cyan"
        style={{ width: '40vw', height: '40vw', top: '-15%', right: '-5%', opacity: isDark ? 0.35 : 0.15 }}
        aria-hidden="true"
      />
      <div
        className="orb orb-green"
        style={{ width: '28vw', height: '28vw', bottom: '-20%', left: '-5%', opacity: isDark ? 0.25 : 0.12 }}
        aria-hidden="true"
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)'
            : 'radial-gradient(rgba(13,31,60,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, transparent, #0c1829)'
            : 'linear-gradient(to bottom, transparent, #f0f6ff)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Label row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8" style={{ background: BRAND.cyan }} />
          <span
            className="text-[10px] tracking-[0.25em] uppercase font-semibold"
            style={{ color: BRAND.cyan, fontFamily: "'Poppins', system-ui, sans-serif" }}
          >
            {label}
          </span>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
        </div>

        {/* Heading — Lora preserved per design spec */}
        <h1
          className="mb-4 leading-tight"
          style={{
            fontFamily: "'Lora', serif",
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            color: isDark ? '#f0f4ff' : '#0d1f3c',
          }}
        >
          {title}
          {titleAccent && (
            <>
              {' '}
              <span className="italic" style={{ color: BRAND.green }}>
                {titleAccent}
              </span>
            </>
          )}
        </h1>

        {/* Brand accent underline */}
        <div
          className="h-[3px] w-20 rounded-full mb-5"
          style={{ background: `linear-gradient(90deg, ${BRAND.green}, ${BRAND.cyan})` }}
        />

        {subtitle && (
          <p
            className="text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ color: isDark ? 'rgba(168,190,217,0.65)' : '#5a7a9a' }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
