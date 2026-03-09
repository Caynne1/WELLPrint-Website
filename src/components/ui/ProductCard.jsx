import { Link } from 'react-router-dom'
import { ArrowRight, ImageOff } from 'lucide-react'

export default function ProductCard({ product }) {
  const { name, slug, short_description, base_price, thumbnail_url, categories } = product

  return (
    <Link
      to={`/products/${slug}`}
      className="card-press group flex flex-col overflow-hidden h-full"
      aria-label={`View ${name}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-ink-700 overflow-hidden flex-shrink-0">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff size={28} className="text-ivory-300/20" />
            <span className="text-xs font-mono text-ivory-300/20 tracking-wider">No image</span>
          </div>
        )}

        {/* Category badge */}
        {categories && (
          <span
            className="absolute top-3 left-3 badge badge-green text-[9px]"
          >
            {categories.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-white text-base font-semibold mb-2 leading-snug group-hover:text-wp-green transition-colors duration-200"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          {name}
        </h3>

        {short_description && (
          <p className="text-sm text-ivory-300/55 leading-relaxed mb-4 flex-1 line-clamp-2">
            {short_description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.07]">
          <div>
            <span className="text-[10px] font-mono text-ivory-300/35 uppercase tracking-wider block">
              From
            </span>
            <span
              className="text-lg font-bold text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ${Number(base_price).toFixed(2)}
            </span>
          </div>

          <span
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:gap-2"
            style={{ color: 'var(--wp-green)' }}
          >
            View
            <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}
