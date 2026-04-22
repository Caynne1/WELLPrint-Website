<<<<<<< HEAD
import { useEffect, useRef } from 'react'
=======
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ChevronLeft, ChevronRight, ImageOff, Clock } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'

// Fallback products shown when DB has no data
const HERO_FALLBACK = [
  {
    id: 'h1', name: 'Business Cards', slug: 'business-cards',
    short_description: 'Premium 350gsm cards with matte, gloss, spot UV or foil finishes.',
    base_price: 350, thumbnail_url: null,
    categories: { name: 'Cards' }, turnaround_days: 2,
  },
  {
    id: 'h2', name: 'Pull-Up Banners', slug: 'pull-up-banners',
    short_description: 'Vibrant large-format banners for events. Includes carry case.',
    base_price: 1200, thumbnail_url: null,
    categories: { name: 'Large Format' }, turnaround_days: 3,
  },
  {
    id: 'h3', name: 'Flyers & Leaflets', slug: 'flyers',
    short_description: 'Full-colour single or double-sided flyers for promotions.',
    base_price: 450, thumbnail_url: null,
    categories: { name: 'Marketing' }, turnaround_days: 1,
  },
  {
    id: 'h4', name: 'Custom Packaging', slug: 'packaging',
    short_description: 'Branded boxes and mailers that elevate your unboxing experience.',
    base_price: 2500, thumbnail_url: null,
    categories: { name: 'Packaging' }, turnaround_days: 5,
  },
  {
    id: 'h5', name: 'Tarpaulin Printing', slug: 'tarpaulin',
    short_description: 'Weatherproof, high-res tarpaulins for outdoor advertising.',
    base_price: 250, thumbnail_url: null,
    categories: { name: 'Outdoor' }, turnaround_days: 1,
  },
]

// CMYK-inspired color placeholder per index
const PLACEHOLDER_COLORS = [
  ['#13A150', '#1993D2'],
  ['#CD1B6E', '#FDC010'],
  ['#1993D2', '#13A150'],
  ['#FDC010', '#CD1B6E'],
  ['#13A150', '#FDC010'],
]

function ProductCarousel({ products }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const count = products.length

  const goTo = (idx) => {
    if (animating) return
    setAnimating(true)
    setCurrent((idx + count) % count)
    setTimeout(() => setAnimating(false), 350)
  }

  // Auto-advance every 3.5s
  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 3500)
    return () => clearInterval(timerRef.current)
  }, [current])

  const product = products[current]
  const { name, slug, short_description, base_price, thumbnail_url, categories, turnaround_days } = product
  const [c1, c2] = PLACEHOLDER_COLORS[current % PLACEHOLDER_COLORS.length]

  return (
    <div className="w-full flex flex-col gap-3" style={{ animation: 'slideLeft 0.9s ease 0.3s both' }}>

      {/* ── Main carousel card ── */}
      <Link
        to={`/products/${slug}`}
        className="block w-full bg-ink-800 border border-ivory-200/10 overflow-hidden group
                   hover:border-wp-green/40 transition-all duration-300"
      >
        {/* Image area */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-ink-700">
          {thumbnail_url ? (
            <img
              src={thumbnail_url}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease, transform 0.7s ease' }}
            />
          ) : (
            /* Styled CMYK placeholder */
            <div
              className="w-full h-full flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${c1}22 0%, ${c2}15 100%)`,
                opacity: animating ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              {/* CMYK grid decoration */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="grid grid-cols-2 gap-1.5">
                  {[c1, c2, '#FDC010', '#1993D2'].map((c, i) => (
                    <div key={i} className="w-12 h-12" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="relative z-10 text-center">
                <ImageOff size={22} className="text-ivory-300/20 mx-auto mb-2" />
                <span className="text-[10px] font-body tracking-[0.2em] text-ivory-300/25 uppercase">
                  No preview
                </span>
              </div>
            </div>
          )}

          {/* Category badge */}
          {categories?.name && (
            <span className="absolute top-3 left-3 bg-wp-green text-ink-950 text-[9px] font-bold
                             tracking-[0.15em] uppercase px-2.5 py-1">
              {categories.name}
            </span>
          )}

          {/* Turnaround */}
          {turnaround_days && (
            <span className="absolute top-3 right-3 bg-ink-950/80 border border-ivory-200/20
                             text-ivory-300/70 text-[9px] tracking-wider uppercase px-2 py-1
                             flex items-center gap-1 font-body">
              <Clock size={8} />
              {turnaround_days}d ready
            </span>
          )}

          {/* Slide counter */}
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); goTo(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-wp-green w-4' : 'bg-ivory-200/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card body */}
        <div
          className="p-5"
          style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className="text-ivory-100 font-bold text-base leading-snug mb-1.5
                           group-hover:text-wp-green transition-colors duration-200 truncate"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {name}
              </h3>
              {short_description && (
                <p className="text-xs text-ivory-300/50 leading-relaxed line-clamp-2"
                   style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {short_description}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-[9px] font-body text-ivory-300/35 uppercase tracking-wider block mb-0.5">
                From
              </span>
              <span
                className="text-xl font-black text-ivory-50 leading-none"
                style={{ fontFamily: "'Lora', serif" }}
              >
                ₱{Number(base_price).toLocaleString('en-PH')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-ivory-200/[0.07] flex items-center justify-between">
            <span className="text-[10px] font-body text-ivory-300/35 tracking-wider uppercase">
              {current + 1} of {count} products
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-wp-green
                             group-hover:gap-2.5 transition-all duration-200">
              View details <ArrowRight size={10} />
            </span>
          </div>
        </div>
      </Link>

      {/* ── Nav controls + quick info strip ── */}
      <div className="flex items-center gap-3">
        {/* Prev */}
        <button
          onClick={() => goTo(current - 1)}
          className="w-9 h-9 bg-ink-800 border border-ivory-200/10 flex items-center justify-center
                     text-ivory-300/60 hover:text-wp-green hover:border-wp-green/40 transition-all duration-200
                     flex-shrink-0"
          aria-label="Previous product"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Middle info */}
        <div className="flex-1 bg-wp-green/10 border border-wp-green/20 px-4 py-2.5 flex items-center gap-3">
          <div className="w-7 h-7 bg-wp-green flex items-center justify-center flex-shrink-0">
            <span className="text-ink-950 font-black text-xs font-body">%</span>
          </div>
          <div>
            <p className="text-ivory-200 text-xs font-semibold leading-tight"
               style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              10% off bulk orders
            </p>
            <p className="text-[10px] text-ivory-300/45 font-body">6+ items per order</p>
          </div>
        </div>

        {/* Next */}
        <button
          onClick={() => goTo(current + 1)}
          className="w-9 h-9 bg-ink-800 border border-ivory-200/10 flex items-center justify-center
                     text-ivory-300/60 hover:text-wp-green hover:border-wp-green/40 transition-all duration-200
                     flex-shrink-0"
          aria-label="Next product"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── File formats strip ── */}
      <div className="bg-ink-800 border border-ivory-200/10 px-5 py-3 flex items-center justify-between gap-4">
        <span className="text-[9px] font-body tracking-[0.15em] text-ivory-300/35 uppercase flex-shrink-0">
          Accepted formats
        </span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {['PDF', 'AI', 'PSD', 'EPS', 'TIFF', 'SVG'].map(fmt => (
            <span key={fmt} className="badge badge-ivory text-[8px]">{fmt}</span>
          ))}
        </div>
      </div>

      {/* ── Browse More button ── */}
      <Link
        to="/products"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6
                   border border-ivory-200/15 bg-ink-800/60 hover:bg-wp-green hover:border-wp-green
                   text-ivory-300/70 hover:text-ink-950 font-bold text-xs uppercase tracking-widest
                   transition-all duration-200 group"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Browse All Products
        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d

export default function HeroSection() {
  const heroRef = useRef(null)
  const { products, loading } = useProducts({ sortBy: 'sort_order' })

  const carouselProducts = !loading && products.length > 0
    ? products.slice(0, 6)
    : HERO_FALLBACK

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.08}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-[88vh] overflow-hidden flex flex-col bg-white">
      <div
        ref={heroRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
<<<<<<< HEAD
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfa_42%,#edf8f3_68%,#e9f4fb_100%)]" />

        <div className="absolute top-[-10%] left-[-8%] w-[38rem] h-[38rem] rounded-full bg-wp-green/[0.08] blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-8%] w-[34rem] h-[34rem] rounded-full bg-wp-cyan/[0.10] blur-[100px]" />

=======
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-wp-green/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vh] rounded-full bg-press-amber/[0.03] blur-[80px]" />
>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(15,23,42,0.06) 0px, transparent 1px, transparent 84px), repeating-linear-gradient(90deg, rgba(15,23,42,0.06) 0px, transparent 1px, transparent 84px)',
            backgroundSize: '84px 84px',
          }}
        />
<<<<<<< HEAD

        <div className="absolute right-[-2%] top-[6%] opacity-[0.035] select-none overflow-hidden">
          <span
            className="text-[34vw] leading-none text-ink-900"
            style={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
          >
            W
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-16 md:pt-20 pb-24">
        <div className="max-w-4xl text-center">
          <h1
            className="text-ink-900 leading-[0.92] mb-8"
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 800,
              fontSize: 'clamp(3.2rem, 8vw, 7rem)',
              animation: 'fadeUp 0.7s ease 0.15s both',
            }}
          >
            Print.{' '}
            <span style={{ fontStyle: 'italic' }}>
              Precisely.
            </span>
            <br />
            <span className="relative inline-block text-wp-green">
              Beautifully.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 400 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 5 C80 2, 200 7, 398 4"
                  stroke="var(--wp-green)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 600,
                    strokeDashoffset: 600,
                    animation: 'lineDraw 1.4s ease 0.7s forwards',
                  }}
                />
              </svg>
            </span>
          </h1>

          <p
            className="mx-auto max-w-3xl text-base md:text-xl leading-relaxed text-slate-700 font-body"
            style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}
          >
            From business cards to large-format banners, WELLPrint delivers polished
            print results with a smoother ordering experience for businesses,
            events, and everyday brand needs.
          </p>
=======
        <div className="absolute right-[-2%] top-[10%] opacity-[0.025] select-none pointer-events-none overflow-hidden">
          <span className="text-[38vw] font-black text-ivory-200 leading-none" style={{ fontFamily: "'Lora', serif" }}>
            W
          </span>
        </div>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left — Main copy */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-8" style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}>
              <span className="badge badge-green">Premium Printing Studio</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="text-wp-green fill-wp-green" />
                ))}
                <span className="text-xs text-ivory-300/50 ml-1 font-body">4.9 / 5</span>
              </div>
            </div>

            <h1
              className="text-ivory-50 leading-[0.92] mb-8"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
                animation: 'fadeUp 0.7s ease 0.2s both',
              }}
            >
              Print.{' '}
              <span className="italic text-ivory-50" style={{ fontFamily: "'Lora', serif" }}>
                Precisely.
              </span>
              <br />
              <span className="relative inline-block" style={{ color: 'var(--wp-green)' }}>
                Beautifully.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 400 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 5 C80 2, 200 7, 398 4"
                    stroke="var(--wp-green)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 600,
                      strokeDashoffset: 600,
                      animation: 'lineDraw 1.4s ease 0.8s forwards',
                    }}
                  />
                </svg>
              </span>
            </h1>

            <p
              className="text-ivory-300/65 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
              style={{ animation: 'fadeUp 0.7s ease 0.35s both', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              From business cards to large-format banners — WELLPrint delivers
              studio-quality results with offset precision, digital speed, and
              a team that cares about your brand.
            </p>

            <div className="flex flex-wrap items-center gap-4" style={{ animation: 'fadeUp 0.7s ease 0.45s both' }}>
              <Link to="/products" className="btn-press group">
                Browse Products
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn-press-ghost">
                Get a Custom Quote
              </Link>
            </div>

            <div
              className="flex flex-wrap items-center gap-6 mt-12 pt-12 border-t border-ivory-200/10"
              style={{ animation: 'fadeUp 0.7s ease 0.55s both' }}
            >
              {[
                { value: '15+', label: 'Years in business' },
                { value: '50K+', label: 'Happy clients' },
                { value: '48hr', label: 'Turnaround' },
                { value: '500MB', label: 'File uploads' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-black text-ivory-100 leading-none mb-0.5" style={{ fontFamily: "'Lora', serif" }}>
                    {value}
                  </span>
                  <span className="text-xs text-ivory-300/45 font-body tracking-wide uppercase">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product Carousel */}
          <div className="lg:col-span-5 hidden lg:block">
            {loading ? (
              /* Skeleton while loading */
              <div className="w-full bg-ink-800 border border-ivory-200/10 overflow-hidden animate-pulse">
                <div className="aspect-[16/10] bg-ink-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-ink-700 w-3/4" />
                  <div className="h-3 bg-ink-700 w-full" />
                  <div className="h-3 bg-ink-700 w-1/2" />
                </div>
              </div>
            ) : (
              <ProductCarousel products={carouselProducts} />
            )}
          </div>

>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d
        </div>
      </div>

      <div
        className="relative z-10 flex justify-center pb-10"
        style={{ animation: 'fadeIn 1s ease 1s both' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.22em] uppercase text-slate-500 font-body">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-wp-green to-transparent" />
        </div>
      </div>
    </section>
  )
}