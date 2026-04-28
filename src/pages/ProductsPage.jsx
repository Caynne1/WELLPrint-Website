import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { useProducts, useCategories } from '../hooks/useProducts'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import {
  Search,
  Grid,
  List,
  Clock,
  ImagePlus,
  ChevronRight,
  Package,
  X,
  RefreshCw,
  Sparkles,
  CreditCard,
  FileText,
  BookOpen,
  Tag,
  Flag,
  Mail,
  Headphones,
  ShoppingCart,
  LayoutGrid,
  Layers,
  ZoomIn,
  Check,
  ArrowRight,
} from 'lucide-react'

const COLORS = {
  green: '#13A150',
  greenDk: '#0e8040',
  cyan: '#1993D2',
  yellow: '#FDC010',
}

const ACCENTS = [COLORS.green, COLORS.cyan, COLORS.yellow, '#a855f7', '#cd1b6e']

function formatPHP(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

function useScrollReveal(deps = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.animate-on-scroll:not(.visible)')
      if (!els.length) return
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
        { threshold: 0.05 }
      )
      els.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }, 50)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

const SORT_OPTIONS = [
  { value: 'name_asc',   label: 'Name: A → Z' },
  { value: 'name_desc',  label: 'Name: Z → A' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

function getCatIcon(slug = '', name = '') {
  const s = `${slug} ${name}`.toLowerCase()
  if (s.includes('business') || s.includes('card')) return CreditCard
  if (s.includes('flyer'))                           return FileText
  if (s.includes('brochure'))                        return BookOpen
  if (s.includes('sticker'))                         return Tag
  if (s.includes('banner') || s.includes('tarp'))    return Flag
  if (s.includes('poster'))                          return Layers
  if (s.includes('invitation'))                      return Mail
  if (s.includes('label'))                           return Tag
  if (s.includes('packag'))                          return Package
  if (s.includes('custom'))                          return Sparkles
  if (s.includes('document'))                        return FileText
  if (s.includes('id') || s.includes('lace'))        return CreditCard
  return Layers
}

/* ─── Product Card ─────────────────────────────────────────────────────────── */
function ProductCard({ product, view, isDark, accent, onPreview }) {
  const {
    slug, name, short_description, base_price,
    thumbnail_url, turnaround_days, categories, min_qty, unit,
  } = product

  const categoryName = categories?.name || 'Print Product'
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart({
      slug,
      name,
      thumbnail_url,
      unitPrice: Number(base_price),
      qty: min_qty || 1,
      selections: {},
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  /* LIST VIEW */
  if (view === 'list') {
    return (
      <div
        className="group rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
        style={{
          background: isDark ? '#112240' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)',
          boxShadow: isDark ? '0 6px 24px rgba(0,0,0,0.22)' : '0 4px 18px rgba(13,31,60,0.06)',
        }}
      >
        <div className="h-[3px] w-full" style={{ background: accent }} />
        <div className="p-5">
          <div className="flex gap-5">
            {/* Clickable thumbnail */}
            <button
              onClick={() => thumbnail_url && onPreview(product)}
              className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center transition-all duration-200 group/img"
              style={{
                background: isDark ? '#1a2f52' : '#f0f6ff',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(13,31,60,0.06)',
                cursor: thumbnail_url ? 'zoom-in' : 'default',
              }}
            >
              {thumbnail_url ? (
                <>
                  <img src={thumbnail_url} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <ZoomIn size={18} color="#fff" />
                  </div>
                </>
              ) : (
                <ImagePlus size={20} style={{ color: isDark ? 'rgba(255,255,255,0.22)' : '#94a3b8' }} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3
                  className="text-sm font-semibold leading-snug"
                  style={{ color: isDark ? '#f0f4ff' : '#0d1f3c' }}
                >
                  {name}
                </h3>
                <span
                  className="text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
                  style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}28` }}
                >
                  {categoryName}
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: isDark ? 'rgba(168,190,217,0.60)' : '#5a7a9a' }}>
                {short_description}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {turnaround_days && (
                  <span className="flex items-center gap-1 text-[10px]" style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#8aabcc' }}>
                    <Clock size={9} /> {turnaround_days}d turnaround
                  </span>
                )}
                {min_qty && (
                  <span className="text-[10px]" style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#8aabcc' }}>
                    Min. {min_qty} {unit ?? 'pcs'}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 text-right flex flex-col justify-between">
              <div>
                <div className="text-[9px] mb-0.5" style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#8aabcc' }}>
                  Starts at
                </div>
                <div className="font-bold text-base" style={{ color: COLORS.green }}>
                  {formatPHP(base_price)}
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <button
                  onClick={handleAddToCart}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    border: `1.5px solid ${added ? COLORS.green : accent}`,
                    color: added ? '#fff' : accent,
                    background: added ? COLORS.green : 'transparent',
                  }}
                >
                  {added ? <><Check size={11} /> Added</> : <><ShoppingCart size={11} /> Add to Cart</>}
                </button>
                <Link
                  to={`/products/${slug}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                    boxShadow: '0 6px 16px rgba(19,161,80,0.22)',
                  }}
                >
                  <ArrowRight size={11} /> Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* GRID VIEW */
  return (
    <div
      className="group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{
        background: isDark ? '#112240' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.22)' : '0 2px 12px rgba(13,31,60,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${accent}35`
        e.currentTarget.style.boxShadow = isDark
          ? `0 16px 40px rgba(0,0,0,0.32), 0 0 0 1px ${accent}18`
          : `0 10px 36px rgba(13,31,60,0.10), 0 0 0 1px ${accent}15`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)'
        e.currentTarget.style.boxShadow = isDark ? '0 4px 20px rgba(0,0,0,0.22)' : '0 2px 12px rgba(13,31,60,0.06)'
      }}
    >
      {/* Accent bar */}
      <div className="h-[3px] w-full" style={{ background: accent }} />

      {/* Clickable image */}
      <button
        onClick={() => thumbnail_url && onPreview(product)}
        className="relative overflow-hidden h-44 w-full group/img"
        style={{
          background: isDark ? '#1a2f52' : '#f0f6ff',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(13,31,60,0.05)',
          cursor: thumbnail_url ? 'zoom-in' : 'default',
          display: 'block',
        }}
      >
        {thumbnail_url ? (
          <>
            <img
              src={thumbnail_url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            {/* Zoom overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200"
              style={{ background: 'rgba(0,0,0,0.30)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.35)' }}
              >
                <ZoomIn size={18} color="#fff" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImagePlus size={24} style={{ color: isDark ? 'rgba(255,255,255,0.18)' : '#94a3b8' }} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.18)' : '#cbd5e1' }}>
              Product Image
            </span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{
              background: isDark ? 'rgba(17,34,64,0.90)' : 'rgba(255,255,255,0.92)',
              color: accent,
              border: `1px solid ${accent}28`,
            }}
          >
            {categoryName}
          </span>
        </div>
      </button>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 min-h-[2.5rem]"
          style={{ color: isDark ? '#f0f4ff' : '#0d1f3c' }}
        >
          {name}
        </h3>
        <p
          className="text-xs leading-relaxed line-clamp-2 mb-3 flex-1 min-h-[2.25rem]"
          style={{ color: isDark ? 'rgba(168,190,217,0.60)' : '#5a7a9a' }}
        >
          {short_description}
        </p>

        <div>
          <p className="text-[9px] mb-0.5" style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#8aabcc' }}>
            Starts at
          </p>
          <p className="font-bold text-sm mb-3" style={{ color: COLORS.green }}>
            {formatPHP(base_price)}
          </p>
          {/* Two-button row */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-1 flex-1 rounded-xl py-2.5 text-[11px] font-semibold transition-all duration-200 active:scale-[0.97]"
              style={{
                border: `1.5px solid ${added ? COLORS.green : accent}`,
                color: added ? '#fff' : accent,
                background: added ? COLORS.green : 'transparent',
              }}
            >
              {added ? <Check size={11} /> : <ShoppingCart size={11} />}
              {added ? 'Added' : 'Add to Cart'}
            </button>
            <Link
              to={`/products/${slug}`}
              className="flex items-center justify-center gap-1 flex-1 rounded-xl py-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                boxShadow: '0 4px 14px rgba(19,161,80,0.20)',
              }}
            >
              <ArrowRight size={11} />
              Order Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Skeleton ─────────────────────────────────────────────────────────────── */
function ProductSkeleton({ view, isDark }) {
  if (view === 'list') {
    return (
      <div
        className="rounded-2xl border overflow-hidden animate-pulse"
        style={{
          background: isDark ? '#112240' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)',
        }}
      >
        <div className="h-[3px] w-full" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
        <div className="p-5 flex gap-5">
          <div className="w-24 h-24 rounded-2xl shrink-0" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
          <div className="flex-1 space-y-3">
            <div className="h-4 rounded-full w-2/3" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
            <div className="h-3 rounded-full w-full" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
            <div className="h-3 rounded-full w-1/2" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
          </div>
          <div className="w-24 space-y-2">
            <div className="h-5 rounded-full" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
            <div className="h-9 rounded-xl"   style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl border overflow-hidden animate-pulse"
      style={{
        background: isDark ? '#112240' : '#ffffff',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)',
      }}
    >
      <div className="h-[3px] w-full" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
      <div className="h-44" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-full w-3/4"  style={{ background: isDark ? '#233d6a' : '#e8f0fb' }} />
        <div className="h-3 rounded-full w-full"  style={{ background: isDark ? '#1a2f52' : '#eef4ff' }} />
        <div className="h-3 rounded-full w-2/3"  style={{ background: isDark ? '#1a2f52' : '#eef4ff' }} />
        <div className="h-4 rounded-full w-1/3"  style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
        <div className="h-9 rounded-xl"          style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
      </div>
    </div>
  )
}

/* ─── Image Preview Modal ───────────────────────────────────────────────────── */
function ImagePreviewModal({ product, isDark, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!product) return null

  const { name, short_description, base_price, thumbnail_url, categories } = product
  const categoryName = categories?.name || 'Print Product'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: isDark ? '#112240' : '#ffffff',
          border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(13,31,60,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(0,0,0,0.45)', color: '#fff' }}
        >
          <X size={15} />
        </button>

        {/* Image */}
        <div className="relative bg-black flex items-center justify-center" style={{ maxHeight: '60vh' }}>
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={name}
              className="w-full object-contain"
              style={{ maxHeight: '60vh' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <ImagePlus size={36} style={{ color: isDark ? 'rgba(255,255,255,0.20)' : '#94a3b8' }} />
              <span className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.30)' : '#94a3b8' }}>No image available</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3
              className="font-bold text-base leading-snug"
              style={{ color: isDark ? '#f0f4ff' : '#0d1f3c' }}
            >
              {name}
            </h3>
            <span
              className="shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{
                background: isDark ? 'rgba(25,147,210,0.15)' : 'rgba(25,147,210,0.10)',
                color: COLORS.cyan,
                border: `1px solid ${COLORS.cyan}28`,
              }}
            >
              {categoryName}
            </span>
          </div>

          {short_description && (
            <p className="text-xs leading-relaxed mb-4" style={{ color: isDark ? 'rgba(168,190,217,0.65)' : '#5a7a9a' }}>
              {short_description}
            </p>
          )}

          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)' }}
          >
            <div>
              <p className="text-[9px] mb-0.5" style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#8aabcc' }}>Starts at</p>
              <p className="font-bold text-lg" style={{ color: COLORS.green }}>{formatPHP(base_price)}</p>
            </div>
            <Link
              to={`/products/${product.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                boxShadow: '0 4px 14px rgba(19,161,80,0.25)',
              }}
            >
              <ArrowRight size={13} /> View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function ProductsPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [search, setSearch]         = useState('')
  const [catSlug, setCatSlug]       = useState(null)
  const [sortBy, setSortBy]         = useState('name_asc')
  const [view, setView]             = useState('grid')
  const [previewProduct, setPreview] = useState(null)

  const handlePreview  = useCallback((p) => setPreview(p), [])
  const handleClosePreview = useCallback(() => setPreview(null), [])

  const { products, loading, error, refetch } = useProducts({ categorySlug: catSlug, search, sortBy })
  const { categories, loading: catsLoading }  = useCategories()

  useScrollReveal([products])

  const cardBg     = isDark ? '#112240' : '#ffffff'
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)'
  const cardShadow = isDark ? '0 4px 20px rgba(0,0,0,0.22)' : '0 2px 12px rgba(13,31,60,0.06)'
  const sepColor   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13,31,60,0.06)'

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: isDark ? '#0c1829' : '#f0f6ff' }}>
      <ImagePreviewModal product={previewProduct} isDark={isDark} onClose={handleClosePreview} />
      <PageHero
        label="Catalog"
        title="Our"
        titleAccent="Products"
        subtitle="Premium printing, delivered fast. Browse our full catalog — every product is crafted to make your brand look its best."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* ── LEFT SIDEBAR ───────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 w-52 xl:w-56 shrink-0">
            <div className="sticky top-20 flex flex-col gap-4">

              {/* Category list */}
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-2 px-4 py-3.5"
                  style={{ background: COLORS.green }}
                >
                  <LayoutGrid size={14} color="#fff" className="shrink-0" />
                  <h3 className="text-white font-semibold text-sm">Product Categories</h3>
                </div>

                {/* All Products */}
                <button
                  onClick={() => setCatSlug(null)}
                  className="w-full flex items-center gap-3 py-3 transition-all duration-150"
                  style={{
                    background: catSlug === null
                      ? (isDark ? 'rgba(19,161,80,0.12)' : 'rgba(19,161,80,0.07)')
                      : 'transparent',
                    color: catSlug === null ? COLORS.green : (isDark ? 'rgba(168,190,217,0.80)' : '#2d4a6e'),
                    borderLeft: `3px solid ${catSlug === null ? COLORS.green : 'transparent'}`,
                    paddingLeft: '13px',
                    paddingRight: '16px',
                    borderBottom: `1px solid ${sepColor}`,
                  }}
                >
                  <LayoutGrid size={13} className="shrink-0" />
                  <span className="flex-1 text-left text-xs font-medium">All Products</span>
                  <ChevronRight size={11} style={{ opacity: 0.45 }} className="shrink-0" />
                </button>

                {/* Category rows */}
                {!catsLoading && categories.map((c, idx) => {
                  const Icon = getCatIcon(c.slug, c.name)
                  const isActive = catSlug === c.slug
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCatSlug(isActive ? null : c.slug)}
                      className="w-full flex items-center gap-3 py-2.5 transition-all duration-150"
                      style={{
                        background: isActive
                          ? (isDark ? 'rgba(19,161,80,0.12)' : 'rgba(19,161,80,0.07)')
                          : 'transparent',
                        color: isActive ? COLORS.green : (isDark ? 'rgba(168,190,217,0.75)' : '#4a6a8a'),
                        borderLeft: `3px solid ${isActive ? COLORS.green : 'transparent'}`,
                        paddingLeft: '13px',
                        paddingRight: '16px',
                        borderBottom: idx < categories.length - 1 ? `1px solid ${sepColor}` : 'none',
                      }}
                    >
                      <Icon size={13} className="shrink-0" />
                      <span className="flex-1 text-left text-xs font-medium">{c.name}</span>
                      <ChevronRight size={11} style={{ opacity: 0.40 }} className="shrink-0" />
                    </button>
                  )
                })}

                {catsLoading && (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-8 rounded-lg animate-pulse" style={{ background: isDark ? '#1a2f52' : '#e8f0fb' }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Need Help */}
              <div
                className="rounded-2xl border p-5 text-center"
                style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${COLORS.green}18`, border: `1px solid ${COLORS.green}30` }}
                >
                  <Headphones size={18} style={{ color: COLORS.green }} />
                </div>
                <h4
                  className="font-semibold text-sm mb-1"
                  style={{ color: isDark ? '#f0f4ff' : '#0d1f3c' }}
                >
                  Need Help?
                </h4>
                <p
                  className="text-[11px] leading-relaxed mb-4"
                  style={{ color: isDark ? 'rgba(168,190,217,0.60)' : '#5a7a9a' }}
                >
                  Can&apos;t find what you need? We&apos;re here to help!
                </p>
                <Link
                  to="/contact"
                  className="flex items-center justify-center w-full rounded-xl py-2 text-xs font-semibold transition-all duration-200"
                  style={{ border: `1.5px solid ${COLORS.green}`, color: COLORS.green }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = COLORS.green
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = COLORS.green
                  }}
                >
                  Contact Us
                </Link>
              </div>

            </div>
          </aside>

          {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div
              className="flex items-center gap-3 flex-wrap mb-5 pb-4 border-b"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)' }}
            >
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(168,190,217,0.65)' : '#4a6a8a' }}>
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs rounded-xl px-3 py-2 outline-none border transition-all"
                  style={{
                    background: isDark ? '#112240' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.10)',
                    color: isDark ? '#a8bed9' : '#2d4a6e',
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1" />

              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: isDark ? 'rgba(168,190,217,0.50)' : '#8aabcc' }}
                />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-xl pl-9 pr-8 py-2 text-xs outline-none transition-all border w-[160px] sm:w-[200px]"
                  style={{
                    background: isDark ? '#112240' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.10)',
                    color: isDark ? '#f0f4ff' : '#0d1f3c',
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: isDark ? 'rgba(168,190,217,0.55)' : '#8aabcc' }}
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: isDark ? 'rgba(168,190,217,0.65)' : '#4a6a8a' }}>
                  View:
                </span>
                <div
                  className="flex items-center rounded-xl border overflow-hidden"
                  style={{
                    background: isDark ? '#112240' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.10)',
                  }}
                >
                  {[{ v: 'grid', Icon: Grid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="p-2 transition-all duration-200"
                      style={{
                        background: view === v ? COLORS.cyan : 'transparent',
                        color: view === v ? '#fff' : (isDark ? 'rgba(168,190,217,0.55)' : '#8aabcc'),
                      }}
                    >
                      <Icon size={13} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile category pills (hidden on lg+) */}
            <div
              className="flex lg:hidden items-center gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1"
              style={{ scrollbarWidth: 'none' }}
            >
              <button
                onClick={() => setCatSlug(null)}
                className="shrink-0 text-[10px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background: catSlug === null ? COLORS.green : (isDark ? '#1a2f52' : '#ffffff'),
                  color: catSlug === null ? '#fff' : (isDark ? '#a8bed9' : '#5a7a9a'),
                  borderColor: catSlug === null ? COLORS.green : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.10)'),
                }}
              >
                All
              </button>
              {!catsLoading && categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCatSlug(catSlug === c.slug ? null : c.slug)}
                  className="shrink-0 text-[10px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200"
                  style={{
                    background: catSlug === c.slug ? COLORS.green : (isDark ? '#1a2f52' : '#ffffff'),
                    color: catSlug === c.slug ? '#fff' : (isDark ? '#a8bed9' : '#5a7a9a'),
                    borderColor: catSlug === c.slug ? COLORS.green : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,31,60,0.10)'),
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Count + clear */}
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <p className="text-xs" style={{ color: isDark ? 'rgba(168,190,217,0.55)' : '#8aabcc' }}>
                {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
              {(catSlug || search) && (
                <button
                  onClick={() => { setCatSlug(null); setSearch('') }}
                  className="text-[10px] flex items-center gap-1 transition-colors"
                  style={{ color: isDark ? 'rgba(168,190,217,0.55)' : '#8aabcc' }}
                  onMouseEnter={e => { e.currentTarget.style.color = COLORS.cyan }}
                  onMouseLeave={e => { e.currentTarget.style.color = isDark ? 'rgba(168,190,217,0.55)' : '#8aabcc' }}
                >
                  <X size={10} /> Clear filters
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="text-center py-20">
                <p className="text-sm mb-4" style={{ color: isDark ? '#a8bed9' : '#5a7a9a' }}>
                  Could not load products. {error}
                </p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)` }}
                >
                  <RefreshCw size={12} /> Try Again
                </button>
              </div>
            )}

            {/* Skeleton */}
            {loading && !error && (
              <div className={view === 'grid'
                ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} view={view} isDark={isDark} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center py-24">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border"
                  style={{ background: cardBg, borderColor: cardBorder }}
                >
                  <Package size={26} style={{ color: isDark ? 'rgba(168,190,217,0.45)' : '#94a3b8' }} />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: isDark ? '#f0f4ff' : '#0d1f3c' }}
                >
                  No products found
                </h3>
                <p className="text-sm mb-6" style={{ color: isDark ? 'rgba(168,190,217,0.55)' : '#5a7a9a' }}>
                  {search || catSlug ? 'Try adjusting your search or filters.' : 'No active products yet.'}
                </p>
                {(search || catSlug) && (
                  <button
                    onClick={() => { setCatSlug(null); setSearch('') }}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold text-white"
                    style={{ background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)` }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && products.length > 0 && (
              <div className={view === 'grid'
                ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
                : 'flex flex-col gap-4'
              }>
                {products.map((p, i) => (
                  <div key={p.id} className="animate-on-scroll">
                    <ProductCard
                      product={p}
                      view={view}
                      isDark={isDark}
                      accent={ACCENTS[i % ACCENTS.length]}
                      onPreview={handlePreview}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>{/* end main */}
        </div>
      </div>

      {/* ── FOOTER CTA ─────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <section
          className="pb-20 pt-8 mt-8 border-t"
          style={{
            background: isDark ? '#0c1829' : '#f0f6ff',
            borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(13,31,60,0.06)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div
              className="relative overflow-hidden rounded-[28px] px-10 py-14 md:px-16"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, #0d2240 0%, #0a2d52 45%, #0e3a6e 100%)'
                  : `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 40%, #07562a 100%)`,
              }}
            >
              <div
                className="absolute -right-16 -top-16 w-72 h-72 rounded-full"
                style={{ background: `radial-gradient(circle, ${isDark ? COLORS.cyan : 'rgba(255,255,255,0.15)'} 0%, transparent 70%)`, opacity: 0.20 }}
              />
              <div
                className="absolute -left-8 -bottom-12 w-56 h-56 rounded-full"
                style={{ background: `radial-gradient(circle, ${isDark ? COLORS.green : 'rgba(255,255,255,0.20)'} 0%, transparent 70%)`, opacity: 0.16 }}
              />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.green}, ${COLORS.yellow})` }}
              />

              <div className="relative z-10 text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                  style={{ background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Custom Orders
                  </span>
                </div>

                <h2
                  className="text-white text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Can&apos;t find what you need?
                </h2>

                <p className="text-sm mb-7 max-w-sm mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  We handle custom print jobs too. Get in touch and we&apos;ll work out the details.
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: isDark ? COLORS.green : 'rgba(255,255,255,0.18)',
                    border: '1.5px solid rgba(255,255,255,0.30)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: isDark ? '0 8px 24px rgba(19,161,80,0.32)' : '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  Request a Custom Quote <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
