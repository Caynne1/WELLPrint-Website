import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { useProducts, useCategories } from '../hooks/useProducts'
import {
  ArrowRight,
  Search,
  Grid,
  List,
  Clock,
  ImagePlus,
  ChevronRight,
  Package,
  X,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  ChevronLeft,
} from 'lucide-react'

const COLORS = {
  green: '#16a34a',
  greenDk: '#15803d',
  navy: '#002C5F',
  cyan: '#1993D2',
  amber: '#d97706',
}

function formatPHP(n) {
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
}

function useScrollReveal(deps = []) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.animate-on-scroll:not(.visible)')
      if (!els.length) return
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('visible')
          }),
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
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'name_desc', label: 'Name: Z → A' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

function ProductPreviewModal({ product, onClose }) {
  const images = useMemo(() => {
    if (!product) return []
    return [
      ...(product?.thumbnail_url ? [product.thumbnail_url] : []),
      ...(Array.isArray(product?.images) ? product.images : []),
    ]
  }, [product])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setActiveIndex(0)
  }, [product])

  useEffect(() => {
    if (!product) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (images.length > 1 && e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % images.length)
      }
      if (images.length > 1 && e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [product, images.length, onClose])

  if (!product) return null

  const activeImage = images[activeIndex]

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      style={{
        background: 'rgba(2, 6, 23, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-[28px] overflow-hidden border bg-white shadow-[0_28px_90px_rgba(15,23,42,0.28)]"
        style={{ borderColor: 'rgba(15,23,42,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-slate-400 mb-1">
              Product Preview
            </p>
            <h3
              className="text-lg font-semibold truncate text-slate-900"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {product.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-[14px] flex items-center justify-center transition-all bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          <div className="p-5">
            <div
              className="relative rounded-[22px] overflow-hidden border"
              style={{
                aspectRatio: '1 / 1',
                background: '#f8fafc',
                borderColor: 'rgba(15,23,42,0.08)',
              }}
            >
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <ImagePlus size={28} className="text-slate-400" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-semibold">
                    No Image
                  </span>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(15,23,42,0.08)',
                      color: '#475569',
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={() =>
                      setActiveIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      border: '1px solid rgba(15,23,42,0.08)',
                      color: '#475569',
                    }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                {images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className="rounded-[16px] overflow-hidden border transition-all"
                    style={{
                      aspectRatio: '1 / 1',
                      borderColor:
                        activeIndex === index ? COLORS.green : 'rgba(15,23,42,0.08)',
                      boxShadow:
                        activeIndex === index ? '0 0 0 1px rgba(22,163,74,0.18)' : 'none',
                      background: '#f8fafc',
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-l border-slate-100 p-6 flex flex-col justify-between">
            <div>
              <span
                className="inline-flex text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase mb-3"
                style={{
                  background: 'rgba(25,147,210,0.10)',
                  color: COLORS.cyan,
                  border: '1px solid rgba(25,147,210,0.20)',
                }}
              >
                {product.categories?.name || 'Print Product'}
              </span>

              <h3
                className="text-[1.35rem] font-semibold leading-tight text-slate-900 mb-2"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {product.name}
              </h3>

              <p className="text-sm leading-relaxed text-slate-500 mb-5">
                {product.short_description || 'Premium quality printing service.'}
              </p>

              <div
                className="rounded-[20px] border p-4 mb-5"
                style={{
                  background: '#f8fafc',
                  borderColor: 'rgba(15,23,42,0.08)',
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-1">
                  Starting Price
                </div>
                <div
                  className="text-[1.6rem] font-bold text-slate-900"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {formatPHP(product.base_price)}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-500">
                {product.turnaround_days && (
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    {product.turnaround_days} day turnaround
                  </div>
                )}

                {product.min_qty && (
                  <div>
                    Minimum order: {product.min_qty} {product.unit ?? 'pcs'}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.01]"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                  boxShadow: '0 12px 24px rgba(22,163,74,0.16)',
                }}
              >
                Order Now <ArrowRight size={14} />
              </Link>

              <button
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-[16px] px-5 py-3 text-sm font-semibold transition-all duration-200 bg-white border text-slate-600 hover:text-slate-800"
                style={{ borderColor: 'rgba(15,23,42,0.08)' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, view, onPreview }) {
  const {
    slug,
    name,
    short_description,
    base_price,
    thumbnail_url,
    turnaround_days,
    categories,
    min_qty,
    unit,
  } = product

  const categoryName = categories?.name || 'Print Product'

  if (view === 'list') {
    return (
      <div
        className="group rounded-[24px] border bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(15,23,42,0.10)]"
        style={{ borderColor: 'rgba(15,23,42,0.08)' }}
      >
        <div className="flex gap-5">
          <button
            type="button"
            onClick={() => onPreview(product)}
            className="relative w-24 h-24 rounded-[18px] overflow-hidden shrink-0 flex items-center justify-center"
            style={{
              background: '#f8fafc',
              border: '1px solid rgba(15,23,42,0.06)',
            }}
          >
            {thumbnail_url ? (
              <img src={thumbnail_url} alt={name} className="w-full h-full object-cover" />
            ) : (
              <ImagePlus size={20} style={{ color: '#94a3b8' }} />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3
                className="text-sm font-semibold leading-snug transition-colors duration-200 group-hover:text-emerald-700"
                style={{ fontFamily: "'Lora', serif", color: '#0f172a' }}
              >
                {name}
              </h3>

              <span
                className="text-[8px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
                style={{
                  background: 'rgba(25,147,210,0.10)',
                  color: COLORS.cyan,
                  border: '1px solid rgba(25,147,210,0.20)',
                }}
              >
                {categoryName}
              </span>
            </div>

            <p className="text-xs leading-relaxed mb-2 line-clamp-2 text-slate-500">
              {short_description}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {turnaround_days && (
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock size={9} /> {turnaround_days}d turnaround
                </span>
              )}

              {min_qty && (
                <span className="text-[10px] text-slate-400">
                  Min. {min_qty} {unit ?? 'pcs'}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 text-right flex flex-col justify-between">
            <div>
              <div
                className="font-bold text-lg"
                style={{ fontFamily: "'Lora', serif", color: '#0f172a' }}
              >
                {formatPHP(base_price)}
              </div>
              <div className="text-[9px] mt-0.5 text-slate-400">starting price</div>
            </div>

            <div className="flex items-center gap-2 justify-end mt-3">
              <button
                type="button"
                onClick={() => onPreview(product)}
                className="inline-flex items-center justify-center gap-1.5 rounded-[14px] px-4 py-2.5 text-[11px] font-semibold text-slate-700 bg-white border transition-all duration-200 hover:bg-slate-50"
                style={{ borderColor: 'rgba(15,23,42,0.08)' }}
              >
                Preview
              </button>

              <Link
                to={`/products/${slug}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-[14px] px-4 py-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                  boxShadow: '0 10px 24px rgba(22,163,74,0.18)',
                }}
              >
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group rounded-[24px] border bg-white overflow-hidden shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_56px_rgba(15,23,42,0.10)]"
      style={{ borderColor: 'rgba(15,23,42,0.08)' }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: '4/3',
          background: '#f8fafc',
          borderBottom: '1px solid rgba(15,23,42,0.06)',
        }}
      >
        <button
          type="button"
          onClick={() => onPreview(product)}
          className="absolute inset-0 z-10"
          aria-label={`Preview ${name}`}
        />

        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImagePlus size={26} style={{ color: '#94a3b8' }} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-semibold">
              Product Image
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 z-20">
          <span
            className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.88)',
              color: COLORS.cyan,
              border: '1px solid rgba(25,147,210,0.16)',
            }}
          >
            {categoryName}
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {turnaround_days && (
            <div
              className="px-2.5 py-1 text-[8px] tracking-wide rounded-full flex items-center gap-1"
              style={{
                background: 'rgba(255,255,255,0.88)',
                color: '#64748b',
                border: '1px solid rgba(15,23,42,0.08)',
              }}
            >
              <Clock size={8} /> {turnaround_days}d
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[11]" />

        <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            type="button"
            onClick={() => onPreview(product)}
            className="flex-1 py-2 rounded-[14px] text-[10px] font-bold transition-all"
            style={{
              background: 'rgba(255,255,255,0.94)',
              color: '#0f172a',
            }}
          >
            Preview
          </button>

          <Link
            to={`/products/${slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-[14px] text-[10px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
            }}
          >
            Order <ArrowRight size={10} />
          </Link>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <h3
            className="text-[1rem] font-semibold leading-snug transition-colors duration-200 group-hover:text-emerald-700"
            style={{ fontFamily: "'Lora', serif", color: '#0f172a' }}
          >
            {name}
          </h3>
        </div>

        <p className="text-sm leading-relaxed line-clamp-2 min-h-[2.75rem] text-slate-500">
          {short_description}
        </p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {turnaround_days && (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock size={9} /> {turnaround_days}d turnaround
            </span>
          )}
          {min_qty && (
            <span className="text-[10px] text-slate-400">
              Min. {min_qty} {unit ?? 'pcs'}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 pt-5 mt-4 border-t border-slate-100">
          <div>
            <div
              className="font-bold text-[1.1rem]"
              style={{ fontFamily: "'Lora', serif", color: '#0f172a' }}
            >
              {formatPHP(base_price)}
            </div>
            <div className="text-[9px] mt-0.5 text-slate-400">starting price</div>
          </div>

          <Link
            to={`/products/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-[14px] px-4 py-2.5 text-[11px] font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
              boxShadow: '0 10px 24px rgba(22,163,74,0.18)',
            }}
          >
            Order
            <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProductSkeleton({ view }) {
  if (view === 'list') {
    return (
      <div className="rounded-[24px] border bg-white p-5 animate-pulse" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
        <div className="flex gap-5">
          <div className="w-24 h-24 rounded-[18px] shrink-0 bg-slate-100" />
          <div className="flex-1 space-y-3">
            <div className="h-4 rounded-full w-2/3 bg-slate-100" />
            <div className="h-3 rounded-full w-full bg-slate-100" />
            <div className="h-3 rounded-full w-1/2 bg-slate-100" />
          </div>
          <div className="w-24 space-y-2">
            <div className="h-5 rounded-full bg-slate-100" />
            <div className="h-9 rounded-[14px] bg-slate-100" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[24px] border bg-white overflow-hidden animate-pulse" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      <div style={{ aspectRatio: '4/3', background: '#f1f5f9' }} />
      <div className="p-5 space-y-3">
        <div className="h-4 rounded-full w-3/4 bg-slate-100" />
        <div className="h-3 rounded-full w-full bg-slate-100" />
        <div className="h-3 rounded-full w-2/3 bg-slate-100" />
        <div className="flex justify-between items-end pt-3">
          <div className="w-20 h-6 rounded-full bg-slate-100" />
          <div className="w-16 h-9 rounded-[14px] bg-slate-100" />
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [catSlug, setCatSlug] = useState(null)
  const [sortBy, setSortBy] = useState('name_asc')
  const [view, setView] = useState('grid')
  const [previewProduct, setPreviewProduct] = useState(null)

  const { products, loading, error, refetch } = useProducts({
    categorySlug: catSlug,
    search,
    sortBy,
  })
  const { categories, loading: catsLoading } = useCategories()

  useScrollReveal([products])

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* HERO */}
      <PageHero
        eyebrow="WELLPrint Products"
        title="Premium Prints for Everyday Brands"
        subtitle="Explore a polished lineup of print solutions built for businesses, events, and personal projects — designed to look sharp and delivered with care."
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'Products' },
        ]}
      />

      {/* TOOLBAR */}
      <div className="sticky top-16 z-30 backdrop-blur-xl border-b bg-white/90" style={{ borderColor: 'rgba(15,23,42,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div
            className="rounded-[24px] border bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
            style={{ borderColor: 'rgba(15,23,42,0.08)' }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-[14px] pl-10 pr-9 py-2.5 text-sm outline-none transition-all bg-white border text-slate-800"
                  style={{ borderColor: 'rgba(15,23,42,0.08)' }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="flex-1" />

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-[11px] rounded-[14px] px-3.5 py-2.5 outline-none border bg-white text-slate-600"
                  style={{ borderColor: 'rgba(15,23,42,0.08)' }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div
                className="flex items-center rounded-[14px] border overflow-hidden bg-white"
                style={{ borderColor: 'rgba(15,23,42,0.08)' }}
              >
                {[{ v: 'grid', Icon: Grid }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="p-2.5 transition-all duration-200"
                    style={{
                      background: view === v ? COLORS.green : 'transparent',
                      color: view === v ? '#fff' : '#94a3b8',
                    }}
                  >
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 flex-wrap mt-4">
              <button
                onClick={() => setCatSlug(null)}
                className="text-[10px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background: catSlug === null ? COLORS.green : '#ffffff',
                  color: catSlug === null ? '#fff' : '#64748b',
                  borderColor: catSlug === null ? COLORS.green : 'rgba(15,23,42,0.08)',
                }}
              >
                All
              </button>

              {!catsLoading &&
                categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCatSlug(catSlug === c.slug ? null : c.slug)}
                    className="text-[10px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200"
                    style={{
                      background: catSlug === c.slug ? COLORS.green : '#ffffff',
                      color: catSlug === c.slug ? '#fff' : '#64748b',
                      borderColor: catSlug === c.slug ? COLORS.green : 'rgba(15,23,42,0.08)',
                    }}
                  >
                    {c.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-7 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-600" />
            <p className="text-xs text-slate-400">
              {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {(catSlug || search) && (
            <button
              onClick={() => {
                setCatSlug(null)
                setSearch('')
              }}
              className="text-[10px] flex items-center gap-1 transition-colors text-slate-400 hover:text-emerald-700"
            >
              <X size={10} /> Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="text-center py-20">
            <p className="text-sm mb-4 text-slate-500">
              Could not load products. {error}
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
              }}
            >
              <RefreshCw size={12} /> Try Again
            </button>
          </div>
        )}

        {loading && !error && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'flex flex-col gap-4'
            }
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} view={view} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-white border"
              style={{ borderColor: 'rgba(15,23,42,0.08)' }}
            >
              <Package size={26} className="text-slate-400" />
            </div>
            <h3
              className="text-base font-semibold mb-2 text-slate-900"
              style={{ fontFamily: "'Lora', serif" }}
            >
              No products found
            </h3>
            <p className="text-sm mb-6 text-slate-500">
              {search || catSlug ? 'Try adjusting your search or filters.' : 'No active products yet.'}
            </p>
            {(search || catSlug) && (
              <button
                onClick={() => {
                  setCatSlug(null)
                  setSearch('')
                }}
                className="inline-flex items-center gap-2 rounded-[14px] px-5 py-2.5 text-xs font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'flex flex-col gap-4'
            }
          >
            {products.map((p) => (
              <div key={p.id} className="animate-on-scroll">
                <ProductCard product={p} view={view} onPreview={setPreviewProduct} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER CTA */}
      {!loading && !error && (
        <section className="pb-20 pt-4 bg-[#f4f6f4] border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="relative overflow-hidden rounded-[28px] px-10 py-14 md:px-16"
              style={{
                background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 40%, #0b5a20 100%)`,
              }}
            >
              <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-20 bg-white/15" />
              <div className="absolute -left-8 -bottom-12 w-56 h-56 rounded-full opacity-10 bg-white/20" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="relative z-10 text-center">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    borderColor: 'rgba(255,255,255,0.20)',
                  }}
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

                <p className="text-sm mb-7 max-w-sm mx-auto text-white/75">
                  We handle custom print jobs too. Get in touch and we&apos;ll work out the details.
                </p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1.5px solid rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Request a Custom Quote <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {previewProduct && (
        <ProductPreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
        />
      )}
    </div>
  )
}