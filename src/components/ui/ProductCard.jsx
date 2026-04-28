import { Link } from 'react-router-dom'
import { ArrowRight, ImageOff } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const ACCENT_COLORS = ['#13A150', '#1993D2', '#FDC010', '#a855f7', '#cd1b6e']

export default function ProductCard({ product, accentIndex = 0 }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { name, slug, short_description, base_price, thumbnail_url, categories } = product
  const accent = ACCENT_COLORS[accentIndex % ACCENT_COLORS.length]

  return (
    <Link
      to={`/products/${slug}`}
      className="group flex flex-col overflow-hidden h-full rounded-[20px] border transition-all duration-300 hover:-translate-y-2"
      style={{
        background: isDark ? '#112240' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)',
        boxShadow: isDark
          ? '0 8px 32px rgba(0,0,0,0.28)'
          : '0 4px 20px rgba(13,31,60,0.07)',
      }}
      aria-label={`View ${name}`}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent}40`
        e.currentTarget.style.boxShadow = isDark
          ? `0 20px 50px rgba(0,0,0,0.38), 0 0 0 1px ${accent}22`
          : `0 14px 44px rgba(13,31,60,0.12), 0 0 0 1px ${accent}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)'
        e.currentTarget.style.boxShadow = isDark
          ? '0 8px 32px rgba(0,0,0,0.28)'
          : '0 4px 20px rgba(13,31,60,0.07)'
      }}
    >
      {/* Colored top accent bar */}
      <div className="h-[3px] w-full shrink-0 rounded-t-[20px]" style={{ background: accent }} />

      {/* Thumbnail */}
      <div
        className="relative overflow-hidden shrink-0"
        style={{
          aspectRatio: '4/3',
          background: isDark ? '#1a2f52' : '#f0f6ff',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(13,31,60,0.05)',
        }}
      >
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff size={28} style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(13,31,60,0.18)' }} />
            <span
              className="text-xs font-medium tracking-wider"
              style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(13,31,60,0.20)' }}
            >
              No image
            </span>
          </div>
        )}

        {/* Category badge */}
        {categories && (
          <span
            className="absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wide uppercase"
            style={{
              background: isDark ? 'rgba(17,34,64,0.88)' : 'rgba(255,255,255,0.92)',
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            {categories.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-base font-semibold mb-2 leading-snug transition-colors duration-200"
          style={{
            fontFamily: "'Lora', serif",
            color: isDark ? '#f0f4ff' : '#0d1f3c',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = accent }}
          onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#f0f4ff' : '#0d1f3c' }}
        >
          {name}
        </h3>

        {short_description && (
          <p
            className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2"
            style={{ color: isDark ? 'rgba(168,190,217,0.65)' : '#5a7a9a' }}
          >
            {short_description}
          </p>
        )}

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between mt-auto pt-4 border-t"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)' }}
        >
          <div>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider block"
              style={{ color: isDark ? 'rgba(168,190,217,0.40)' : '#8aabcc' }}
            >
              From
            </span>
            <span
              className="text-lg font-bold leading-tight"
              style={{ fontFamily: "'Lora', serif", color: isDark ? '#f0f4ff' : '#0d1f3c' }}
            >
              ₱{Number(base_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <span
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:gap-2"
            style={{ color: accent }}
          >
            View
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
