import { useTheme } from '../../context/ThemeContext'

export default function PageHero({ label, title, titleAccent, subtitle, children }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <section
      className="relative pt-36 pb-16 overflow-hidden"
      style={{ background: isDark ? '#08111f' : '#f1f5f9' }}
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-64 blur-[80px] pointer-events-none"
        style={{ background: isDark ? 'rgba(22,163,74,0.04)' : 'rgba(22,163,74,0.07)' }}
        aria-hidden="true"
      />
      {/* CMYK bar top */}
      <div className="absolute top-0 left-0 right-0 cmyk-bar" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-wp-green" />
          <span
            className="font-body text-[10px] tracking-[0.25em] uppercase"
            style={{ color: 'var(--wp-green)' }}
          >
            {label}
          </span>
        </div>

        <h1
          className="mb-4 leading-tight"
          style={{
            fontFamily: "'Lora', serif",
            fontWeight: 900,
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            color: isDark ? '#ffffff' : '#0f172a',
          }}
        >
          {title}
          {titleAccent && (
            <> <span className="italic" style={{ color: 'var(--wp-green)' }}>{titleAccent}</span></>
          )}
        </h1>

        {subtitle && (
          <p
            className="text-lg max-w-2xl leading-relaxed"
            style={{ color: isDark ? 'rgba(203,213,225,0.60)' : '#64748b' }}
          >
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  )
}
