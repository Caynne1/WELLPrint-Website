import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  CheckCircle,
  ImagePlus,
  Share2,
  Heart,
  FileText,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Clock3,
  ShieldCheck,
  Package,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProduct } from '../hooks/useProducts'

/* ── KEEP YOUR EXISTING PRODUCTS OBJECT EXACTLY AS-IS ABOVE THIS LINE ── */

/* ── Helpers ── */
function Stars({ rating, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? 'var(--wp-yellow)' : 'transparent'}
          style={{
            color: i <= Math.round(rating) ? 'var(--wp-yellow)' : 'rgba(148,163,184,0.28)',
          }}
        />
      ))}
    </div>
  )
}

function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}

function Gallery({ imageUrls = [], accent }) {
  const count = imageUrls.length || 1
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [imageUrls])

  const currentUrl = imageUrls[active] || null

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative rounded-[24px] overflow-hidden border bg-white shadow-[0_12px_36px_rgba(15,23,42,0.07)]"
        style={{
          aspectRatio: '1 / 1',
          borderColor: 'rgba(15,23,42,0.08)',
        }}
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={`Product image ${active + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <ImagePlus size={40} style={{ color: accent, opacity: 0.22 }} />
            <span className="font-body text-[10px] tracking-[0.22em] uppercase text-slate-300">
              Product Image
            </span>
          </div>
        )}

        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.12))' }}
        />

        <div
          className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 rounded-tl-md"
          style={{ borderColor: `${accent}50` }}
        />
        <div
          className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 rounded-br-md"
          style={{ borderColor: `${accent}50` }}
        />

        {count > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + count) % count)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(15,23,42,0.08)',
                color: '#475569',
                boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setActive((a) => (a + 1) % count)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.88)',
                border: '1px solid rgba(15,23,42,0.08)',
                color: '#475569',
                boxShadow: '0 8px 20px rgba(15,23,42,0.08)',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="overflow-hidden rounded-[16px] border transition-all"
              style={{
                aspectRatio: '1 / 1',
                background: '#fff',
                borderColor: active === i ? accent : 'rgba(15,23,42,0.08)',
                boxShadow: active === i ? `0 0 0 1px ${accent}` : 'none',
              }}
            >
              <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function OptionGroup({ label, choices, selected, onSelect, accent }) {
  const isQuantity = label === 'Quantity'
  const [customMode, setCustomMode] = useState(false)
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    if (!choices.includes(selected) && selected !== 'Custom') {
      return
    }
    if (choices.includes(selected)) {
      setCustomMode(false)
      setCustomInput('')
    }
  }, [selected, choices])

  const displaySelected = customMode
    ? customInput
      ? `${customInput} pcs`
      : 'Custom'
    : selected

  return (
    <div className="rounded-[18px] border bg-white p-4" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-slate-400">
          {label}
        </span>
        <span className="text-xs font-semibold text-slate-700">
          {displaySelected}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {choices.map((c) => {
          const isActive = !customMode && c === selected
          return (
            <button
              key={c}
              onClick={() => {
                onSelect(c)
                setCustomMode(false)
                setCustomInput('')
              }}
              className="px-3.5 py-2 text-xs rounded-[14px] border transition-all font-body"
              style={
                isActive
                  ? {
                      borderColor: accent,
                      color: accent,
                      background: `${accent}12`,
                      boxShadow: `0 0 0 1px ${accent}20`,
                    }
                  : {
                      borderColor: 'rgba(15,23,42,0.08)',
                      color: '#64748b',
                      background: '#ffffff',
                    }
              }
            >
              {c}
            </button>
          )
        })}

        {isQuantity && (
          <button
            onClick={() => {
              setCustomMode(true)
              setCustomInput('')
              onSelect('Custom')
            }}
            className="px-3.5 py-2 text-xs rounded-[14px] border transition-all font-body"
            style={
              customMode
                ? {
                    borderColor: accent,
                    color: accent,
                    background: `${accent}12`,
                    boxShadow: `0 0 0 1px ${accent}20`,
                  }
                : {
                    borderColor: 'rgba(15,23,42,0.08)',
                    color: '#64748b',
                    background: '#ffffff',
                  }
            }
          >
            Custom
          </button>
        )}
      </div>

      {isQuantity && customMode && (
        <div className="mt-3 flex items-center gap-2">
          <input
            autoFocus
            type="number"
            min="1"
            placeholder="e.g. 350"
            value={customInput}
            onChange={(e) => {
              const raw = e.target.value
              setCustomInput(raw)
              const v = parseInt(raw)
              if (!isNaN(v) && v > 0) {
                onSelect(`${v} pcs`)
              } else {
                onSelect('Custom')
              }
            }}
            className="w-36 h-10 px-3 text-sm font-body border rounded-[12px] focus:outline-none transition-all"
            style={{
              background: '#ffffff',
              borderColor: customInput ? accent : 'rgba(15,23,42,0.10)',
              color: '#0f172a',
              boxShadow: customInput ? `0 0 0 1px ${accent}20` : 'none',
            }}
          />
          <span className="text-slate-400 text-xs font-body">pcs</span>
        </div>
      )}
    </div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-100 last:border-none">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4 group"
      >
        <span className="text-slate-700 text-sm group-hover:text-emerald-700 transition-colors">
          {q}
        </span>
        <ChevronRight
          size={14}
          className="shrink-0 text-slate-300 transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && <p className="pb-4 text-slate-500 text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

function RelatedCard({ slug, product }) {
  return (
    <Link
      to={`/products/${slug}`}
      className="rounded-[18px] border bg-white flex gap-3 p-3 items-center group hover:no-underline shadow-sm hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)] transition-all duration-300"
      style={{ borderColor: 'rgba(15,23,42,0.08)' }}
    >
      <div className="w-14 h-14 shrink-0 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center">
        <ImagePlus size={16} style={{ color: product.accent, opacity: 0.22 }} />
      </div>
      <div className="min-w-0">
        <p
          className="text-slate-900 text-xs font-semibold leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {product.name}
        </p>
        <p className="text-slate-400 text-[10px] font-body mt-0.5">
          {product.price > 0 ? `₱${product.price.toLocaleString()}` : 'Get Quote'}{' '}
          <span className="text-slate-300">{product.priceNote}</span>
        </p>
      </div>
    </Link>
  )
}

/* ── Page ── */
export default function ProductDetailPage() {
  const { slug } = useParams()

  const { product: dbProduct, loading: dbLoading } = useProduct(slug)

  const product = PRODUCTS[slug] || PRODUCTS['business-cards-standard']
  const {
    name,
    cat,
    catSlug,
    price,
    priceNote,
    minQty,
    tag,
    accent,
    rating,
    reviews,
    sold,
    desc,
    specs,
    options,
    turnaround,
    faqs,
  } = product

  const galleryImages = dbProduct
    ? [
        ...(dbProduct.thumbnail_url ? [dbProduct.thumbnail_url] : []),
        ...(Array.isArray(dbProduct.images) ? dbProduct.images : []),
      ]
    : []

  const displayName = dbProduct?.name ?? name
  const displayBasePrice = dbProduct?.base_price ?? price
  const displayDesc = dbProduct?.short_description ?? desc
  const displayTurnaround = dbProduct?.turnaround_days
    ? `${dbProduct.turnaround_days} business days`
    : turnaround

  const [selections, setSelections] = useState(() =>
    Object.fromEntries(Object.entries(options).map(([k, v]) => [k, v[0]]))
  )
  const [hearted, setHearted] = useState(false)
  const [inquired, setInquired] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()

  function getQty() {
    const raw = selections['Quantity'] || ''
    const n = parseInt(raw.replace(/,/g, ''))
    return !isNaN(n) && n > 0 ? n : 1
  }

  useEffect(() => {
    setSelections(Object.fromEntries(Object.entries(options).map(([k, v]) => [k, v[0]])))
    setInquired(false)
    setAddedToCart(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  function handleInquire() {
    setInquired(true)
    setTimeout(() => setInquired(false), 2500)
  }

  function handleAddToCart() {
    const qty = getQty()
    const unitPrice = displayBasePrice > 0 && minQty > 1 ? displayBasePrice / minQty : displayBasePrice

    addToCart({
      slug,
      name: displayName,
      unitPrice,
      priceNote: '/ pc',
      selections: { ...selections },
      qty,
      accent,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const related = Object.entries(PRODUCTS)
    .filter(([s, p]) => s !== slug && p.catSlug === catSlug)
    .slice(0, 3)

  const specsRef = useScrollReveal()
  const faqRef = useScrollReveal()
  const relRef = useScrollReveal()

  const displayPrice = displayBasePrice > 0 ? `₱${Number(displayBasePrice).toLocaleString()}` : 'Get Quote'
  const pricePerPc = displayBasePrice > 0 && minQty > 1 ? displayBasePrice / minQty : null

  if (dbLoading && !dbProduct) {
    return (
      <div className="min-h-screen bg-[#f4f6f4] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 rounded-[24px] bg-white border animate-pulse" style={{ aspectRatio: '1/1', borderColor: 'rgba(15,23,42,0.08)' }} />
            <div className="lg:col-span-4 space-y-4">
              <div className="h-4 rounded-full bg-slate-200 w-1/3" />
              <div className="h-10 rounded-full bg-slate-200 w-3/4" />
              <div className="h-5 rounded-full bg-slate-200 w-1/2" />
              <div className="h-28 rounded-[24px] bg-slate-200" />
            </div>
            <div className="lg:col-span-3 h-72 rounded-[24px] bg-slate-200" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f6f4] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-body tracking-[0.18em] text-slate-400 mb-8 flex-wrap uppercase">
          <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/products" className="hover:text-slate-600 transition-colors">Products</Link>
          <ChevronRight size={10} />
          <span>{cat}</span>
          <ChevronRight size={10} />
          <span className="text-slate-600">{displayName}</span>
        </nav>

        {/* Top intro row */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to catalog
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          {/* Gallery */}
          <div className="lg:col-span-5">
            <Gallery imageUrls={galleryImages} accent={accent} />
          </div>

          {/* Info */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div>
              {tag && (
                <div
                  className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full text-[10px] font-body font-bold tracking-[0.18em] uppercase"
                  style={{
                    background: `${accent}15`,
                    color: accent,
                    border: `1px solid ${accent}25`,
                  }}
                >
                  <Sparkles size={11} />
                  {tag}
                </div>
              )}

              <h1
                className="text-slate-900 leading-tight mb-3"
                style={{ fontFamily: "'Lora', serif", fontWeight: 900, fontSize: 'clamp(1.7rem, 3vw, 2.2rem)' }}
              >
                {displayName}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <Stars rating={rating} />
                <span className="text-[13px] font-bold text-amber-500">{rating}</span>
                <span className="text-xs text-slate-400">{reviews} Ratings</span>
                <div className="h-3 w-px bg-slate-200" />
                <span className="text-xs text-slate-400">{sold} Sold</span>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-[24px] border bg-white px-6 py-5 shadow-[0_10px_32px_rgba(15,23,42,0.06)]" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              {pricePerPc ? (
                <>
                  <div className="text-slate-400 text-[10px] font-body tracking-[0.18em] uppercase mb-1">
                    Price per piece
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-slate-900 font-black"
                      style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
                    >
                      ₱{pricePerPc % 1 === 0 ? pricePerPc.toLocaleString() : pricePerPc.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-xs font-body">/ pc</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-slate-400 text-[10px] font-body">
                      {displayPrice} {priceNote}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-slate-400 text-[10px] font-body tracking-[0.18em] uppercase mb-1">
                    {displayBasePrice > 0 ? 'Price' : 'Pricing'}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-slate-900 font-black"
                      style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}
                    >
                      {displayPrice}
                    </span>
                    <span className="text-slate-400 text-xs font-body">{priceNote}</span>
                  </div>
                </>
              )}

              <p className="text-slate-400 text-[10px] font-body mt-2">
                Final price confirmed via inquiry · Bulk discounts available
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {Object.entries(options).map(([label, choices]) => (
                <OptionGroup
                  key={label}
                  label={label}
                  choices={choices}
                  selected={selections[label]}
                  onSelect={(v) => setSelections((s) => ({ ...s, [label]: v }))}
                  accent={accent}
                />
              ))}
            </div>

            {/* Turnaround */}
            <div className="flex items-center gap-2.5 text-sm rounded-[18px] border bg-white px-4 py-3" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              <Clock3 size={15} style={{ color: 'var(--wp-green)', flexShrink: 0 }} />
              <span className="text-slate-500">
                Ready in <span className="text-slate-900 font-semibold">{displayTurnaround}</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={displayBasePrice === 0}
                className="w-full flex items-center justify-center gap-2.5 text-sm py-3.5 rounded-[16px] font-bold uppercase tracking-[0.16em] transition-all"
                style={
                  addedToCart
                    ? {
                        background: 'var(--wp-green)',
                        color: '#ffffff',
                        boxShadow: '0 12px 28px rgba(22,163,74,0.20)',
                      }
                    : displayBasePrice === 0
                    ? {
                        background: '#f8fafc',
                        color: '#94a3b8',
                        cursor: 'not-allowed',
                        border: '1px solid rgba(15,23,42,0.08)',
                      }
                    : {
                        background: 'linear-gradient(135deg, var(--wp-green) 0%, var(--wp-green-dk) 100%)',
                        color: '#ffffff',
                        boxShadow: '0 12px 28px rgba(22,163,74,0.20)',
                      }
                }
              >
                {addedToCart ? (
                  <>
                    <CheckCircle size={16} /> Added to Cart!
                  </>
                ) : displayBasePrice === 0 ? (
                  <>
                    <ShoppingCart size={16} /> Quote Required
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} /> Add to Cart
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleInquire}
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-3 rounded-[16px] border font-bold uppercase tracking-[0.12em] transition-all"
                  style={{
                    color: accent,
                    borderColor: `${accent}55`,
                    background: inquired ? `${accent}15` : '#ffffff',
                  }}
                >
                  {inquired ? (
                    <>
                      <CheckCircle size={15} /> Noted!
                    </>
                  ) : (
                    <>
                      <MessageSquare size={15} /> Inquire
                    </>
                  )}
                </button>

                <Link
                  to="/contact"
                  className="flex-1 inline-flex items-center justify-center gap-2 text-sm py-3 rounded-[16px] font-bold uppercase tracking-[0.12em] text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--wp-green) 0%, var(--wp-green-dk) 100%)',
                  }}
                >
                  Request Quote <ArrowRight size={14} />
                </Link>

                <button
                  onClick={() => setHearted((v) => !v)}
                  className="w-12 h-12 border rounded-[16px] bg-white flex items-center justify-center transition-all"
                  style={{
                    borderColor: hearted ? 'var(--wp-magenta)' : 'rgba(15,23,42,0.08)',
                    color: hearted ? 'var(--wp-magenta)' : '#94a3b8',
                  }}
                >
                  <Heart size={16} fill={hearted ? 'var(--wp-magenta)' : 'transparent'} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Share2 size={12} className="text-slate-300" />
              <span className="text-slate-400 text-[10px] font-body tracking-[0.16em] uppercase">
                Share this product
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={14} style={{ color: accent }} />
                <span className="font-body text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: accent }}>
                  File Requirements
                </span>
              </div>

              <ul className="space-y-2">
                {[
                  'PDF, AI, or EPS format',
                  '300 DPI resolution',
                  '3mm bleed on all sides',
                  'Fonts outlined / embedded',
                  'CMYK color mode',
                ].map((r) => (
                  <li key={r} className="flex items-start gap-2 text-xs text-slate-500">
                    <CheckCircle size={11} className="shrink-0 mt-0.5" style={{ color: 'var(--wp-green)' }} />
                    {r}
                  </li>
                ))}
              </ul>

              <Link
                to="/file-specs"
                className="flex items-center gap-1.5 mt-4 text-[10px] font-body tracking-[0.18em] uppercase text-slate-400 hover:text-emerald-700 transition-colors"
              >
                Full File Spec Guide <ChevronRight size={10} />
              </Link>
            </div>

            <div className="rounded-[22px] border bg-white p-5 shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="font-body text-[10px] tracking-[0.18em] uppercase text-slate-500 font-semibold">
                  Our Promise
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { text: 'Color accuracy guaranteed', color: 'var(--wp-green)' },
                  { text: 'Reprint if we make an error', color: 'var(--wp-green)' },
                  { text: 'Backed by Espiel-Bereso Group', color: 'var(--wp-cyan)' },
                ].map(({ text, color }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
                    <CheckCircle size={13} style={{ color, flexShrink: 0 }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div ref={relRef} className="animate-on-scroll">
                <div className="font-body text-[10px] tracking-[0.18em] uppercase text-slate-400 mb-3">
                  Also in {cat}
                </div>
                <div className="space-y-2">
                  {related.map(([s, p]) => (
                    <RelatedCard key={s} slug={s} product={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specs */}
        <div ref={specsRef} className="animate-on-scroll mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: accent }} />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: accent }}>
              Product Specifications
            </span>
          </div>

          <div className="rounded-[24px] overflow-hidden border bg-white shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`grid grid-cols-3 sm:grid-cols-4 gap-4 px-6 py-4 ${i % 2 !== 0 ? 'bg-slate-50/70' : ''}`}
              >
                <div className="font-body text-[10px] tracking-[0.18em] uppercase text-slate-400 col-span-1">
                  {s.label}
                </div>
                <div className="text-slate-700 text-sm col-span-2 sm:col-span-3">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Description + FAQ */}
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: accent }} />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: accent }}>
                  Product Overview
                </span>
              </div>

              <div className="rounded-[24px] border bg-white p-7 shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
                <p className="text-slate-600 leading-relaxed text-[0.96rem]">{displayDesc}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div ref={faqRef} className="animate-on-scroll">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: accent }} />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase font-semibold" style={{ color: accent }}>
                  FAQs
                </span>
              </div>

              <div className="rounded-[24px] border bg-white px-6 shadow-sm" style={{ borderColor: 'rgba(15,23,42,0.08)' }}>
                {faqs.map((f) => (
                  <FAQ key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}