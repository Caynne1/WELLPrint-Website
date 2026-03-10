import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import {
  ArrowRight, Search, Filter, Grid, List, Star,
  ImagePlus, ChevronRight, Printer, Package, FileText,
  Tag, BookOpen, Monitor, CreditCard, CheckCircle, X
} from 'lucide-react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',            label: 'All Products',      icon: Grid },
  { id: 'business-cards', label: 'Business Cards',    icon: CreditCard },
  { id: 'digital',        label: 'Flyers & Digital',  icon: FileText },
  { id: 'large-format',   label: 'Large Format',      icon: Tag },
  { id: 'packaging',      label: 'Packaging',         icon: Package },
  { id: 'booklets',       label: 'Booklets',          icon: BookOpen },
  { id: 'signage',        label: 'Signage',           icon: Monitor },
]

const PRODUCTS = [
  {
    slug: 'business-cards-standard',
    name: 'Standard Business Cards',
    cat: 'business-cards',
    price: '₱350',
    priceNote: 'per 100 pcs',
    tag: 'Most Popular',
    tagColor: 'var(--wp-green)',
    accent: 'var(--wp-green)',
    rating: 4.9,
    reviews: 128,
    specs: ['3.5" × 2"', '350gsm', 'Matte or Gloss'],
    badge: 'badge-green',
    desc: 'Crisp, professional cards on premium 350gsm stock. Available in matte or gloss laminate.',
    turnaround: '3–5 days',
    inStock: true,
  },
  {
    slug: 'business-cards-spot-uv',
    name: 'Spot UV Business Cards',
    cat: 'business-cards',
    price: '₱650',
    priceNote: 'per 100 pcs',
    tag: 'Premium',
    tagColor: 'var(--wp-yellow)',
    accent: 'var(--wp-yellow)',
    rating: 4.8,
    reviews: 64,
    specs: ['3.5" × 2"', '400gsm', 'Spot UV Coating'],
    badge: 'badge-yellow',
    desc: 'Stand out with tactile spot UV highlights over matte laminate. Luxury feel, lasting impression.',
    turnaround: '5–7 days',
    inStock: true,
  },
  {
    slug: 'flyers-a5',
    name: 'A5 Flyers',
    cat: 'digital',
    price: '₱180',
    priceNote: 'per 50 pcs',
    tag: '48hr Ready',
    tagColor: 'var(--wp-cyan)',
    accent: 'var(--wp-cyan)',
    rating: 4.7,
    reviews: 95,
    specs: ['A5 (148×210mm)', '130gsm', 'Full Color CMYK'],
    badge: 'badge-cyan',
    desc: 'Fast-turnaround flyers for events, promos, and campaigns. Vivid CMYK color on every sheet.',
    turnaround: '1–2 days',
    inStock: true,
  },
  {
    slug: 'flyers-a4',
    name: 'A4 Flyers',
    cat: 'digital',
    price: '₱280',
    priceNote: 'per 50 pcs',
    tag: null,
    tagColor: null,
    accent: 'var(--wp-cyan)',
    rating: 4.6,
    reviews: 72,
    specs: ['A4 (210×297mm)', '130gsm', 'Single or Double-sided'],
    badge: 'badge-cyan',
    desc: 'Full-size promotional flyers with sharp print quality and fast delivery.',
    turnaround: '2–3 days',
    inStock: true,
  },
  {
    slug: 'tarpaulin-banner',
    name: 'Tarpaulin Banner',
    cat: 'large-format',
    price: '₱45',
    priceNote: 'per sq ft',
    tag: 'Outdoor',
    tagColor: 'var(--wp-yellow)',
    accent: 'var(--wp-yellow)',
    rating: 4.8,
    reviews: 210,
    specs: ['Custom Size', '440gsm Vinyl', 'UV & Water Resistant'],
    badge: 'badge-yellow',
    desc: 'Durable outdoor tarpaulin for events, storefronts, and campaigns. Weather-resistant and long-lasting.',
    turnaround: '2–4 days',
    inStock: true,
  },
  {
    slug: 'pull-up-banner',
    name: 'Pull-Up / Roll-Up Banner',
    cat: 'large-format',
    price: '₱1,200',
    priceNote: 'incl. stand',
    tag: 'Best Seller',
    tagColor: 'var(--wp-green)',
    accent: 'var(--wp-green)',
    rating: 4.9,
    reviews: 143,
    specs: ['85×200cm', 'Retractable Stand', 'Carry Bag Included'],
    badge: 'badge-green',
    desc: 'Professional retractable banners for trade shows, events, and retail. Stand included.',
    turnaround: '3–5 days',
    inStock: true,
  },
  {
    slug: 'product-box-custom',
    name: 'Custom Product Box',
    cat: 'packaging',
    price: 'Get Quote',
    priceNote: 'min. order applies',
    tag: 'Custom',
    tagColor: 'var(--wp-magenta)',
    accent: 'var(--wp-magenta)',
    rating: 4.7,
    reviews: 38,
    specs: ['Custom Dimensions', 'E-flute or B-flute', 'Full Color Print'],
    badge: 'badge-magenta',
    desc: 'Fully customized product packaging with your branding. Minimum order quantities apply.',
    turnaround: '7–14 days',
    inStock: false,
  },
  {
    slug: 'mailer-box',
    name: 'Mailer Box',
    cat: 'packaging',
    price: '₱85',
    priceNote: 'per piece (min 50)',
    tag: 'E-Commerce Ready',
    tagColor: 'var(--wp-magenta)',
    accent: 'var(--wp-magenta)',
    rating: 4.6,
    reviews: 55,
    specs: ['Multiple Sizes', '2mm Solid Board', 'Inside Print Option'],
    badge: 'badge-magenta',
    desc: 'Self-locking mailer boxes perfect for e-commerce, subscription kits, and gift packaging.',
    turnaround: '5–7 days',
    inStock: true,
  },
  {
    slug: 'saddle-stitch-booklet',
    name: 'Saddle-Stitched Booklet',
    cat: 'booklets',
    price: '₱420',
    priceNote: 'per 10 pcs',
    tag: null,
    tagColor: null,
    accent: 'var(--wp-cyan)',
    rating: 4.5,
    reviews: 29,
    specs: ['A4 or A5', '8–48 pages', '170gsm Cover'],
    badge: 'badge-cyan',
    desc: 'Staple-bound booklets for catalogs, programs, and lookbooks. Clean finish, quick turnaround.',
    turnaround: '5–7 days',
    inStock: true,
  },
  {
    slug: 'perfect-bound-catalog',
    name: 'Perfect-Bound Catalog',
    cat: 'booklets',
    price: '₱980',
    priceNote: 'per 5 pcs',
    tag: 'Premium',
    tagColor: 'var(--wp-yellow)',
    accent: 'var(--wp-yellow)',
    rating: 4.8,
    reviews: 21,
    specs: ['A4 or Custom', '48–200 pages', 'Glued Spine'],
    badge: 'badge-yellow',
    desc: 'High-end glued-spine catalogs and annual reports. Professional square-spine finish.',
    turnaround: '7–10 days',
    inStock: true,
  },
  {
    slug: 'foam-board',
    name: 'Foam Board Print',
    cat: 'signage',
    price: '₱320',
    priceNote: 'per piece',
    tag: 'Indoor',
    tagColor: 'var(--wp-green)',
    accent: 'var(--wp-green)',
    rating: 4.6,
    reviews: 47,
    specs: ['A1 or Custom', '5mm Foam Core', 'Lightweight & Rigid'],
    badge: 'badge-green',
    desc: 'Lightweight rigid foam boards for indoor displays, presentations, and POS signage.',
    turnaround: '2–3 days',
    inStock: true,
  },
  {
    slug: 'acrylic-signage',
    name: 'Acrylic Signage',
    cat: 'signage',
    price: 'Get Quote',
    priceNote: 'custom sizing',
    tag: 'Premium',
    tagColor: 'var(--wp-yellow)',
    accent: 'var(--wp-yellow)',
    rating: 4.9,
    reviews: 33,
    specs: ['Custom Size', '3mm or 5mm Acrylic', 'Standoff or Flush'],
    badge: 'badge-yellow',
    desc: 'Sleek laser-cut acrylic panels for lobby signage, nameplates, and branded installations.',
    turnaround: '7–10 days',
    inStock: false,
  },
]

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ─────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10}
          fill={i <= Math.round(rating) ? 'var(--wp-yellow)' : 'transparent'}
          style={{ color: i <= Math.round(rating) ? 'var(--wp-yellow)' : 'rgba(216,216,216,0.2)' }} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ product, view }) {
  const ref = useScrollReveal()
  const { name, price, priceNote, tag, tagColor, accent, rating, reviews, specs, desc, turnaround, inStock, slug } = product

  if (view === 'list') {
    return (
      <div ref={ref} className="animate-on-scroll card-press flex gap-0 overflow-hidden group">
        {/* Thumbnail */}
        <div className="shrink-0 w-36 bg-ink-700 border-r border-white/[0.06] relative flex items-center justify-center">
          <ImagePlus size={24} style={{ color: accent, opacity: 0.18 }} />
          {tag && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase rounded-sm"
              style={{ background: `${tagColor}20`, color: tagColor, border: `1px solid ${tagColor}35` }}>
              {tag}
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 p-5 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-wp-green transition-colors"
              style={{ fontFamily: "'DM Serif Display', serif" }}>{name}</h3>
            <p className="text-ivory-300/45 text-xs leading-relaxed mb-2 line-clamp-1">{desc}</p>
            <div className="flex items-center gap-3">
              <Stars rating={rating} />
              <span className="text-ivory-300/30 text-[10px] font-mono">({reviews})</span>
              <span className="text-[10px] font-mono text-ivory-300/30">· {turnaround}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0 hidden lg:flex">
            {specs.map(s => (
              <span key={s} className="px-2 py-0.5 bg-ink-700 border border-white/[0.07] text-ivory-300/40
                text-[9px] font-mono rounded-sm">{s}</span>
            ))}
          </div>
          <div className="shrink-0 text-right">
            <div className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>{price}</div>
            <div className="text-ivory-300/30 text-[10px] font-mono mb-3">{priceNote}</div>
            <Link to={`/products/${slug}`} className="btn-press text-xs py-2 px-4 whitespace-nowrap">
              Order Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} className="animate-on-scroll card-press flex flex-col overflow-hidden group">
      {/* Image placeholder */}
      <div className="relative bg-ink-700 border-b border-white/[0.06]" style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <ImagePlus size={26} style={{ color: accent, opacity: 0.18 }} />
          <span className="font-mono text-[8px] tracking-widest uppercase text-ivory-300/10">Product Photo</span>
        </div>
        {/* Decorative corner */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: `${accent}35` }} />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: `${accent}35` }} />
        {/* Tag */}
        {tag && (
          <div className="absolute top-3 right-3 px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase rounded-sm"
            style={{ background: `${tagColor}20`, color: tagColor, border: `1px solid ${tagColor}35` }}>
            {tag}
          </div>
        )}
        {/* Stock indicator */}
        {!inStock && (
          <div className="absolute inset-0 bg-ink-950/60 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/50 bg-ink-900/80 px-3 py-1.5 rounded-sm border border-white/10">
              By Request
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white text-sm font-semibold mb-1 leading-snug group-hover:text-wp-green transition-colors"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
          {name}
        </h3>
        <p className="text-ivory-300/40 text-xs leading-relaxed mb-3 line-clamp-2">{desc}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <Stars rating={rating} />
          <span className="text-ivory-300/30 text-[10px] font-mono">{rating} ({reviews})</span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {specs.map(s => (
            <span key={s} className="px-1.5 py-0.5 bg-ink-700 border border-white/[0.07] text-ivory-300/35
              text-[8px] font-mono rounded-sm tracking-wide">{s}</span>
          ))}
        </div>

        {/* Turnaround */}
        <div className="flex items-center gap-1.5 mb-4">
          <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />
          <span className="text-[10px] font-mono text-ivory-300/35">Ready in {turnaround}</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <div className="text-white font-bold text-lg leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
              {price}
            </div>
            <div className="text-ivory-300/30 text-[9px] font-mono mt-0.5">{priceNote}</div>
          </div>
          <Link to={`/products/${slug}`} className="btn-press text-[10px] py-2 px-3 shrink-0">
            Order <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   UI PREVIEW MOCKUP
───────────────────────────────────────────── */
function UIMockup() {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className="animate-on-scroll relative">
      {/* Glow */}
      <div className="absolute -inset-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,176,75,0.06) 0%, transparent 70%)' }} />

      {/* Browser chrome */}
      <div className="relative rounded-sm overflow-hidden border border-white/[0.10] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
        {/* Title bar */}
        <div className="bg-ink-700 border-b border-white/[0.08] px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-wp-magenta/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-wp-yellow/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-wp-green/60" />
          </div>
          <div className="flex-1 bg-ink-900 rounded-sm px-3 py-1 text-[10px] font-mono text-ivory-300/25 text-center">
            wellprint.com.ph/products
          </div>
        </div>

        {/* App UI inside */}
        <div className="bg-ink-900 p-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-ink-800 border border-white/[0.08] rounded-sm px-3 py-2 flex items-center gap-2">
              <Search size={11} className="text-ivory-300/20" />
              <span className="text-[10px] font-mono text-ivory-300/15">Search products…</span>
            </div>
            <div className="flex gap-1.5">
              {['All', 'Cards', 'Flyers', 'Banners'].map((l, i) => (
                <div key={l} className="px-2.5 py-1.5 rounded-sm text-[9px] font-mono"
                  style={i === 0
                    ? { background: 'var(--wp-green)', color: '#fff' }
                    : { background: '#1A1A1A', color: 'rgba(216,216,216,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Mini grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { tag: 'Most Popular', color: 'var(--wp-green)', h: 'h-16' },
              { tag: '48hr Ready',   color: 'var(--wp-cyan)',    h: 'h-16' },
              { tag: 'Premium',      color: 'var(--wp-yellow)',  h: 'h-16' },
            ].map(({ tag, color, h }, i) => (
              <div key={i} className="bg-ink-800 border border-white/[0.06] rounded-sm overflow-hidden">
                <div className={`${h} bg-ink-700 relative flex items-center justify-center`}>
                  <Printer size={14} style={{ color, opacity: 0.2 }} />
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[7px] font-mono rounded-sm"
                    style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>{tag}</div>
                </div>
                <div className="p-2 space-y-1">
                  <div className="h-2 bg-ink-600 rounded-sm w-4/5" />
                  <div className="h-1.5 bg-ink-600 rounded-sm w-1/2 opacity-50" />
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-2 bg-ink-600 rounded-sm w-1/4" />
                    <div className="h-4 w-10 rounded-sm" style={{ background: 'var(--wp-green)', opacity: 0.5 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] font-mono text-ivory-300/20">Showing 12 of 48 products</span>
            <div className="flex gap-1">
              {[1,2,3].map(n => (
                <div key={n} className="w-5 h-5 rounded-sm flex items-center justify-center text-[8px] font-mono"
                  style={n === 1
                    ? { background: 'var(--wp-green)', color: '#fff' }
                    : { background: '#1A1A1A', color: 'rgba(216,216,216,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute -right-4 top-16 flex items-center gap-2">
        <div className="h-px w-8 bg-wp-green/40" />
        <span className="text-[9px] font-mono tracking-widest uppercase text-wp-green/50">Coming Soon</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function ProductsPage() {
  const [activeCat, setActiveCat]   = useState('all')
  const [view, setView]             = useState('grid')
  const [search, setSearch]         = useState('')
  const [showBanner, setShowBanner] = useState(true)
  const previewRef = useScrollReveal()

  const filtered = PRODUCTS.filter(p => {
    const catMatch = activeCat === 'all' || p.cat === activeCat
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  return (
    <>
      <PageHero
        label="Product Catalog"
        title="Print Products"
        titleAccent="Built to Impress"
        subtitle="Browse our full range. Sample specs and pricing shown — final quotes confirmed on inquiry."
      />

      {/* ── Dev banner ── */}
      {showBanner && (
        <div className="bg-ink-800 border-y border-wp-yellow/20">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-wp-yellow animate-pulse shrink-0" />
            <p className="text-ivory-300/50 text-xs font-mono tracking-wide flex-1">
              <span className="text-wp-yellow font-semibold">Mockup Mode —</span>{' '}
              Prices and specs are samples. Online ordering coming soon.{' '}
              <Link to="/contact" className="text-wp-green hover:underline">Contact us</Link> to place an order now.
            </p>
            <button onClick={() => setShowBanner(false)} className="text-ivory-300/30 hover:text-ivory-300 transition-colors shrink-0">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Catalog UI preview (mockup screenshot) ── */}
      <section className="py-20 bg-ink-950 border-b border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div ref={previewRef} className="animate-on-scroll">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-wp-green" />
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-wp-green">What's Coming</span>
              </div>
              <h2 className="text-white mb-5 leading-snug"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                A Full Self-Service<br />
                <span className="italic" style={{ color: 'var(--wp-green)' }}>Ordering Platform</span>
              </h2>
              <p className="text-ivory-300/50 text-sm leading-relaxed mb-6">
                Soon you'll be able to browse, configure, upload artwork, and check out — all without
                picking up the phone. Filter by product type, set your quantities, choose your finish,
                and get instant pricing.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Browse 40+ print products',
                  'Instant pricing calculator',
                  'Artwork upload & proofing',
                  'Order tracking dashboard',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-ivory-300/55 text-sm">
                    <CheckCircle size={14} style={{ color: 'var(--wp-green)', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-press inline-flex items-center gap-2 text-sm">
                Order Now via Inquiry <ArrowRight size={14} />
              </Link>
            </div>
            <UIMockup />
          </div>
        </div>
      </section>

      {/* ── Filter bar ── */}
      <section className="sticky top-[60px] z-30 bg-ink-900/95 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
          {/* Search */}
          <div className="flex items-center gap-2 bg-ink-800 border border-white/[0.08] rounded-sm px-3 py-2 shrink-0 w-44">
            <Search size={12} className="text-ivory-300/30 shrink-0" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="bg-transparent text-xs text-ivory-200 placeholder-ivory-300/25 outline-none w-full font-mono"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
                className="shrink-0 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wide border transition-all duration-200"
                style={activeCat === cat.id
                  ? { background: 'var(--wp-green)', color: '#fff', border: '1px solid var(--wp-green-dk)' }
                  : { background: 'transparent', color: 'rgba(216,216,216,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <button onClick={() => setView('grid')}
              className="p-2 rounded-sm border transition-all"
              style={view === 'grid'
                ? { background: 'var(--ink-700,#242424)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--wp-green)' }
                : { border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(216,216,216,0.3)' }}>
              <Grid size={13} />
            </button>
            <button onClick={() => setView('list')}
              className="p-2 rounded-sm border transition-all"
              style={view === 'list'
                ? { background: 'var(--ink-700,#242424)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--wp-green)' }
                : { border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(216,216,216,0.3)' }}>
              <List size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="py-14 bg-ink-900 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Result count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-ivory-300/30 text-xs font-mono">
              {filtered.length === 0 ? 'No products found' : (
                <>Showing <span className="text-ivory-300/60">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}</>
              )}
            </p>
            {search && (
              <button onClick={() => setSearch('')}
                className="text-xs font-mono text-ivory-300/30 hover:text-wp-green flex items-center gap-1 transition-colors">
                <X size={11} /> Clear search
              </button>
            )}
          </div>

          {/* Grid / List */}
          {filtered.length > 0 ? (
            view === 'grid'
              ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.map(p => <ProductCard key={p.slug} product={p} view="grid" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(p => <ProductCard key={p.slug} product={p} view="list" />)}
                </div>
              )
          ) : (
            <div className="text-center py-20">
              <p className="text-ivory-300/30 text-sm font-mono mb-4">No products match your search.</p>
              <button onClick={() => { setSearch(''); setActiveCat('all') }}
                className="btn-press-ghost text-xs">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Custom quote CTA ── */}
      <section className="py-16 bg-ink-950 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-ivory-300/35 text-sm mb-2">Need something not listed here?</p>
          <h3 className="text-white text-xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            We do custom work too.
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="btn-press inline-flex items-center gap-2 text-sm">
              Request a Custom Quote <ArrowRight size={14} />
            </Link>
            <Link to="/services" className="btn-press-ghost inline-flex items-center gap-2 text-sm">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}