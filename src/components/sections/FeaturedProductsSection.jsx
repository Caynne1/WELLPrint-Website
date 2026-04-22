import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ImageOff, Sparkles, Clock } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'

// Skeleton loader card
function SkeletonCard() {
  return (
    <div className="bg-ink-800 border border-ivory-200/10 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-ink-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-ink-700 rounded-sm w-3/4" />
        <div className="h-3 bg-ink-700 rounded-sm w-full" />
        <div className="h-3 bg-ink-700 rounded-sm w-2/3" />
        <div className="flex justify-between items-center pt-3 border-t border-ivory-200/10">
          <div className="h-5 bg-ink-700 rounded-sm w-16" />
          <div className="h-4 bg-ink-700 rounded-sm w-12" />
        </div>
      </div>
    </div>
  )
}

// Featured product card — richer than the standard ProductCard
function FeaturedCard({ product, index }) {
  const { name, slug, short_description, base_price, thumbnail_url, categories, turnaround_days } = product

  return (
    <Link
      to={`/products/${slug}`}
      className="group bg-ink-800 border border-ivory-200/[0.08] overflow-hidden flex flex-col relative
                 hover:border-wp-green/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-green"
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`View ${name}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-ink-700 overflow-hidden flex-shrink-0">
        {thumbnail_url ? (
          <img
            src={thumbnail_url}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-700 to-ink-800">
            {/* Print-style placeholder */}
            <div className="grid grid-cols-2 gap-1 opacity-20">
              {['#13A150','#1993D2','#CD1B6E','#FDC010'].map(c => (
                <div key={c} className="w-8 h-8" style={{ backgroundColor: c }} />
              ))}
            </div>
            <ImageOff size={20} className="text-ivory-300/20" />
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        {categories?.name && (
          <span className="absolute top-3 left-3 bg-wp-green/90 text-ink-950 text-[9px] font-bold
                           tracking-[0.15em] uppercase px-2 py-1">
            {categories.name}
          </span>
        )}

        {/* Turnaround badge */}
        {turnaround_days && (
          <span className="absolute top-3 right-3 bg-ink-950/80 border border-ivory-200/20
                           text-ivory-300/80 text-[9px] font-body tracking-wider uppercase px-2 py-1
                           flex items-center gap-1">
            <Clock size={8} />
            {turnaround_days}d ready
          </span>
        )}

        {/* View overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-wp-green text-ink-950 text-xs font-bold tracking-widest uppercase px-5 py-2.5 flex items-center gap-2">
            View Product <ArrowRight size={12} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="text-ivory-100 text-base font-semibold leading-snug mb-2
                     group-hover:text-wp-green transition-colors duration-200"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          {name}
        </h3>

        {short_description && (
          <p className="text-sm text-ivory-300/50 leading-relaxed mb-4 flex-1 line-clamp-2"
             style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {short_description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-ivory-200/[0.07]">
          <div>
            <span className="text-[9px] font-body text-ivory-300/35 uppercase tracking-[0.15em] block mb-0.5">
              Starting from
            </span>
            <span
              className="text-xl font-black text-ivory-50 leading-none"
              style={{ fontFamily: "'Lora', serif" }}
            >
              ₱{Number(base_price).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest
                           text-wp-green transition-all duration-200 group-hover:gap-2.5">
            Order now
            <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Static fallback products when Supabase is unavailable / no featured items
const FALLBACK_PRODUCTS = [
  {
    id: 'f1', name: 'Business Cards', slug: 'business-cards',
    short_description: 'Premium 350gsm cards with matte, gloss, spot UV or foil finishes. Make your first impression count.',
    base_price: 350, thumbnail_url: null,
    categories: { name: 'Cards' }, turnaround_days: 2,
  },
  {
    id: 'f2', name: 'Flyers & Leaflets', slug: 'flyers',
    short_description: 'Full-colour single or double-sided flyers. Perfect for promotions, events, and announcements.',
    base_price: 450, thumbnail_url: null,
    categories: { name: 'Marketing' }, turnaround_days: 1,
  },
  {
    id: 'f3', name: 'Pull-Up Banners', slug: 'pull-up-banners',
    short_description: 'Vibrant large-format banners for events and trade shows. Includes carry case.',
    base_price: 1200, thumbnail_url: null,
    categories: { name: 'Large Format' }, turnaround_days: 3,
  },
  {
    id: 'f4', name: 'Custom Packaging', slug: 'packaging',
    short_description: 'Branded boxes, bags, and mailers that elevate your unboxing experience.',
    base_price: 2500, thumbnail_url: null,
    categories: { name: 'Packaging' }, turnaround_days: 5,
  },
  {
    id: 'f5', name: 'Booklets & Catalogs', slug: 'booklets',
    short_description: 'Saddle-stitched or perfect-bound. Lookbooks, annual reports, and menus.',
    base_price: 800, thumbnail_url: null,
    categories: { name: 'Publications' }, turnaround_days: 4,
  },
  {
    id: 'f6', name: 'Tarpaulin Printing', slug: 'tarpaulin',
    short_description: 'Weatherproof, high-resolution tarpaulins for outdoor advertising up to 5m wide.',
    base_price: 250, thumbnail_url: null,
    categories: { name: 'Outdoor' }, turnaround_days: 1,
  },
]

export default function FeaturedProductsSection() {
  const sectionRef = useRef(null)
  const { products, loading, error } = useProducts({ sortBy: 'sort_order' })

  // Intersection observer for section reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('section-visible') },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Use real products (up to 6) or fallback
  const displayProducts = !loading && !error && products.length > 0
    ? products.slice(0, 6)
    : (!loading && (error || products.length === 0) ? FALLBACK_PRODUCTS : null)

  return (
    <section
      ref={sectionRef}
      className="bg-ink-900 py-24 relative overflow-hidden"
    >
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-ivory-200/15 to-transparent" />
      </div>

      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] rounded-full bg-wp-green/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vh] rounded-full bg-wp-cyan/[0.03] blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
          <div>
            {/* Pre-label */}
            <div className="flex items-center gap-2.5 mb-4">
              <Sparkles size={13} className="text-wp-green" />
              <span className="text-[10px] font-body tracking-[0.25em] text-wp-green uppercase">
                Our Products
              </span>
            </div>

            <h2
              className="text-ivory-50 leading-tight"
              style={{
                fontFamily: "'Lora', serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
              }}
            >
              Everything You Need to
              <br />
              <span style={{ color: 'var(--wp-green)' }}>Print with Impact</span>
            </h2>

            <p
              className="text-ivory-300/55 mt-4 max-w-lg text-base leading-relaxed"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              From quick single-day runs to complex offset jobs — browse our most popular
              print products, all with transparent pricing.
            </p>
          </div>

          {/* View all link */}
          <Link
            to="/products"
            className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold text-wp-green
                       border border-wp-green/30 hover:border-wp-green/70 hover:bg-wp-green/5
                       px-6 py-3 transition-all duration-200 group self-start sm:self-end"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            View All Products
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(displayProducts ?? FALLBACK_PRODUCTS).map((product, i) => (
              <FeaturedCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* Bottom CTA strip */}
        <div className="mt-16 border border-ivory-200/[0.07] bg-ink-800/50 p-8 flex flex-col sm:flex-row
                        items-center justify-between gap-6">
          <div>
            <p
              className="text-ivory-50 font-semibold text-lg leading-tight mb-1"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Don't see what you need?
            </p>
            <p
              className="text-ivory-300/50 text-sm"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              We handle custom print jobs of any size. Get a free quote from our team.
            </p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 bg-wp-green hover:bg-wp-green/90 text-ink-950 font-bold
                       text-sm uppercase tracking-wider px-8 py-3.5 transition-colors duration-200
                       flex items-center gap-2 group"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Request Custom Quote
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-ivory-200/15 to-transparent" />
      </div>
    </section>
  )
}
