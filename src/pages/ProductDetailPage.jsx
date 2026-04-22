import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  MessageSquare,
  CheckCircle,
  ImagePlus,
  Share2,
  Heart,
  FileText,
  ArrowRight,
  ShoppingCart,
  Clock,
  Package,
  ShieldCheck,
  Upload,
  Mail,
  Truck,
  Store,
  AlertCircle,
  X,
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useProduct, useProducts } from '../hooks/useProducts'

const DELIVERY_FEE = 500
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
]

function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

function Stars({ rating = 5, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? 'var(--wp-yellow)' : 'transparent'}
          style={{
            color:
              i <= Math.round(rating)
                ? 'var(--wp-yellow)'
                : 'rgba(216,216,216,0.2)',
          }}
        />
      ))}
    </div>
  )
}

function Gallery({ imageUrls = [] }) {
  const [active, setActive] = useState(0)
<<<<<<< HEAD
  const count = imageUrls.length
=======
  const [lens, setLens] = useState(null) // { cursorX, cursorY, containerW, containerH }
  const imgContainerRef = useRef(null)
>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d

  useEffect(() => {
    setActive(0)
  }, [imageUrls])

  if (!count) {
    return (
      <div
        className="relative bg-ink-700 border border-white/[0.08] rounded-sm overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: '1 / 1' }}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <ImagePlus size={40} style={{ color: 'rgba(216,216,216,0.20)' }} />
          <span className="font-body text-[10px] tracking-widest uppercase text-ivory-300/15">
            No Product Image
          </span>
        </div>
      </div>
    )
  }

  const ZOOM = 2.5
  const LENS_SIZE = 130 // px diameter

  function handleMouseMove(e) {
    if (!currentUrl || !imgContainerRef.current) return
    const rect = imgContainerRef.current.getBoundingClientRect()
    setLens({
      cursorX: e.clientX - rect.left,   // px from left of container
      cursorY: e.clientY - rect.top,    // px from top of container
      containerW: rect.width,
      containerH: rect.height,
    })
  }

  function handleMouseLeave() {
    setLens(null)
  }

  // Lens top-left position (clamp so lens stays inside container)
  const half = LENS_SIZE / 2
  const lensLeft = lens ? Math.min(Math.max(lens.cursorX - half, 0), lens.containerW - LENS_SIZE) : 0
  const lensTop  = lens ? Math.min(Math.max(lens.cursorY - half, 0), lens.containerH - LENS_SIZE) : 0

  // The background-position for the zoomed image inside the lens.
  // We want the pixel under the cursor to be at the center of the lens.
  // bgX/bgY = how far to shift the zoomed image (negative = shift left/up)
  const bgX = lens ? -(lens.cursorX * ZOOM - half) : 0
  const bgY = lens ? -(lens.cursorY * ZOOM - half) : 0

  return (
    <div className="flex flex-col gap-3">
      <div
<<<<<<< HEAD
        className="relative bg-ink-700 border border-white/[0.08] rounded-sm overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          src={imageUrls[active]}
          alt={`Product image ${active + 1}`}
          className="w-full h-full object-cover"
        />

=======
        ref={imgContainerRef}
        className="relative bg-ink-700 border border-white/[0.08] rounded-sm overflow-hidden"
        style={{ aspectRatio: '1/1', cursor: lens ? 'crosshair' : 'default' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {currentUrl ? (
          <img src={currentUrl} alt={`Product image ${active + 1}`} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <ImagePlus size={40} style={{ color: accent, opacity: 0.15 }} />
            <span className="font-body text-[10px] tracking-widest uppercase text-ivory-300/15">
              Product Image
            </span>
          </div>
        )}

        {/* Magnifying lens */}
        {lens && currentUrl && (
          <div
            style={{
              position: 'absolute',
              left: lensLeft,
              top: lensTop,
              width: LENS_SIZE,
              height: LENS_SIZE,
              borderRadius: '50%',
              border: `2px solid ${accent}`,
              boxShadow: `0 0 0 1px ${accent}55, 0 8px 32px rgba(0,0,0,0.8)`,
              backgroundImage: `url(${currentUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${lens.containerW * ZOOM}px ${lens.containerH * ZOOM}px`,
              backgroundPosition: `${bgX}px ${bgY}px`,
              pointerEvents: 'none',
              zIndex: 20,
            }}
          />
        )}

        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: `${accent}40` }} />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: `${accent}40` }} />
>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d
        {count > 1 && (
          <>
            <button
              onClick={() => setActive((a) => (a - 1 + count) % count)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-ink-900/70 border border-white/10
                flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-900 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => setActive((a) => (a + 1) % count)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm bg-ink-900/70 border border-white/10
                flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-900 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-1 border rounded-sm transition-all overflow-hidden"
              style={{
                aspectRatio: '1 / 1',
                background: '#1A1A1A',
                borderColor:
                  active === i
                    ? 'var(--wp-green)'
                    : 'rgba(255,255,255,0.07)',
                boxShadow:
                  active === i ? '0 0 0 1px var(--wp-green)' : 'none',
              }}
            >
              <img
                src={url}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function OptionGroup({ label, choices, selected, onSelect }) {
  if (!Array.isArray(choices) || choices.length === 0) return null

  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => {
          const active = selected === choice
          return (
            <button
              key={choice}
              onClick={() => onSelect(choice)}
              className="px-3 py-2 rounded-sm border text-xs transition-all"
              style={{
                borderColor: active
                  ? 'var(--wp-green)'
                  : 'rgba(255,255,255,0.10)',
                background: active
                  ? 'rgba(22,163,74,0.12)'
                  : 'rgba(255,255,255,0.03)',
                color: active ? 'var(--wp-green)' : 'rgba(216,216,216,0.70)',
              }}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ChoiceCard({ active, onClick, icon: Icon, title, subtitle, color = 'var(--wp-cyan)' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-sm border p-4 transition-all"
      style={{
        borderColor: active ? color : 'rgba(255,255,255,0.08)',
        background: active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        boxShadow: active ? `0 0 0 1px ${color}` : 'none',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
          style={{
            background: active ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
            color,
          }}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-ivory-300/40 mt-1 leading-relaxed">
            {subtitle}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { product, loading } = useProduct(slug)
  const { products: allProducts } = useProducts()
  const { addToCart } = useCart()

  const [hearted, setHearted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [inquired, setInquired] = useState(false)
  const [qty, setQty] = useState(1)
  const [selections, setSelections] = useState({})

  const [designOption, setDesignOption] = useState('upload')
  const [designFile, setDesignFile] = useState(null)
  const [designError, setDesignError] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('pickup')

  const specsRef = useScrollReveal()
  const relatedRef = useScrollReveal()

  useEffect(() => {
    setHearted(false)
    setAddedToCart(false)
    setInquired(false)
    setQty(1)
    setSelections({})
    setDesignOption('upload')
    setDesignFile(null)
    setDesignError('')
    setDeliveryMethod('pickup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const galleryImages = useMemo(() => {
    if (!product) return []
    return [
      ...(product.thumbnail_url ? [product.thumbnail_url] : []),
      ...(Array.isArray(product.images) ? product.images : []),
    ]
  }, [product])

  const optionGroups = useMemo(() => {
    if (!product) return {}
    return product.options && typeof product.options === 'object'
      ? product.options
      : {}
  }, [product])

  useEffect(() => {
    const defaults = {}
    Object.entries(optionGroups).forEach(([label, choices]) => {
      defaults[label] = Array.isArray(choices) && choices.length ? choices[0] : ''
    })
    setSelections(defaults)
  }, [optionGroups])

  const relatedProducts = useMemo(() => {
    if (!product || !Array.isArray(allProducts)) return []
    return allProducts
      .filter((p) => p.slug !== product.slug)
      .filter((p) => p.category_id === product.category_id)
      .slice(0, 3)
  }, [product, allProducts])

  const displayPrice = Number(product?.base_price || 0)
  const deliveryFee = deliveryMethod === 'deliver' ? DELIVERY_FEE : 0
  const subtotal = displayPrice * qty
  const grandTotal = subtotal + deliveryFee

  function handleDesignFileChange(e) {
    const file = e.target.files?.[0]
    setDesignError('')

    if (!file) {
      setDesignFile(null)
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setDesignError('Unsupported file type. Please upload PNG, JPG, JPEG, or PDF.')
      setDesignFile(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setDesignError('File is too large. Please choose “I will email the design” instead.')
      setDesignFile(null)
      return
    }

    setDesignFile(file)
  }

  function clearDesignFile() {
    setDesignFile(null)
    setDesignError('')
  }

  function handleAddToCart() {
    if (!product) return

    if (designOption === 'upload' && !designFile) {
      setDesignError('Please upload your design file first, or choose another design option.')
      return
    }

    addToCart({
      slug: product.slug,
      id: product.id,
      name: product.name,
      unitPrice: displayPrice,
      priceNote: product.unit ? `/ ${product.unit}` : '',
      qty,
      selections,
      thumbnail_url: product.thumbnail_url || null,
      designOption,
      designFileName: designFile?.name || null,
      designFile,
      layoutRequest: designOption === 'no_design',
      deliveryMethod,
      deliveryFee,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2200)
  }

  function handleInquire() {
    setInquired(true)
    setTimeout(() => setInquired(false), 2200)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20 text-ivory-300/50">
            Loading product...
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ink-900 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-20">
            <h2
              className="text-white text-2xl font-bold mb-3"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Product not found
            </h2>
            <p className="text-ivory-300/45 mb-6">
              The product you’re looking for is unavailable or no longer exists.
            </p>
            <Link to="/products" className="btn-press inline-flex items-center gap-2 px-5 py-3">
              <ArrowLeft size={14} /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const displayTurnaround = product.turnaround_days
    ? `${product.turnaround_days} business day${product.turnaround_days > 1 ? 's' : ''}`
    : 'Based on project scope'

  const rating = 4.9
  const reviews = 120

  return (
    <div className="min-h-screen bg-ink-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-body tracking-wider text-ivory-300/30 mb-8 flex-wrap">
          <Link to="/" className="hover:text-ivory-300/60 transition-colors">
            Home
          </Link>
          <ChevronRight size={10} />
          <Link
            to="/products"
            className="hover:text-ivory-300/60 transition-colors"
          >
            Products
          </Link>
          <ChevronRight size={10} />
          <span className="text-ivory-300/55">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-5">
            <Gallery imageUrls={galleryImages} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div>
              {product.categories?.name && (
                <div
                  className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-sm text-[10px] font-body font-bold tracking-widest uppercase"
                  style={{
                    background: 'rgba(25,147,210,0.18)',
                    color: 'var(--wp-cyan)',
                    border: '1px solid rgba(25,147,210,0.35)',
                  }}
                >
                  {product.categories.name}
                </div>
              )}

              <h1
                className="text-white leading-tight mb-3"
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                {product.name}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                <Stars rating={rating} />
                <span className="text-wp-yellow text-sm font-bold font-body">
                  {rating}
                </span>
                <span className="text-ivory-300/30 text-xs font-body">
                  {reviews}+ reviews
                </span>
              </div>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm px-5 py-4">
              <div className="text-ivory-300/40 text-[10px] font-body tracking-widest uppercase mb-1">
                Starting Price
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-white font-black"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  }}
                >
                  ₱{displayPrice.toLocaleString()}
                </span>
                <span className="text-ivory-300/35 text-xs font-body">
                  {product.unit ? `/ ${product.unit}` : ''}
                </span>
              </div>
              <p className="text-ivory-300/30 text-[10px] font-body mt-1.5">
                Final price may vary based on quantity, selected options, and delivery method.
              </p>
            </div>

            {Object.keys(optionGroups).length > 0 && (
              <div className="space-y-5">
                {Object.entries(optionGroups).map(([label, choices]) => (
                  <OptionGroup
                    key={label}
                    label={label}
                    choices={Array.isArray(choices) ? choices : []}
                    selected={selections[label]}
                    onSelect={(value) =>
                      setSelections((prev) => ({ ...prev, [label]: value }))
                    }
                  />
                ))}
              </div>
            )}

            <div>
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
                Quantity
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-sm border border-white/10 bg-ink-800 text-ivory-300/70 hover:text-white transition-all flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>
                <div className="w-14 h-10 rounded-sm border border-white/10 bg-ink-800 text-white flex items-center justify-center text-sm font-semibold">
                  {qty}
                </div>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 rounded-sm border border-white/10 bg-ink-800 text-ivory-300/70 hover:text-white transition-all flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* DESIGN SUBMISSION */}
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-1">
                  Design Submission
                </div>
                <p className="text-xs text-ivory-300/40 leading-relaxed">
                  Choose how you want to provide your design file for printing.
                </p>
              </div>

              <div className="space-y-3">
                <ChoiceCard
                  active={designOption === 'upload'}
                  onClick={() => {
                    setDesignOption('upload')
                    setDesignError('')
                  }}
                  icon={Upload}
                  title="Upload design now"
                  subtitle="Upload PNG, JPG, JPEG, or PDF files up to 10MB."
                  color="var(--wp-green)"
                />

                <ChoiceCard
                  active={designOption === 'email'}
                  onClick={() => {
                    setDesignOption('email')
                    setDesignError('')
                  }}
                  icon={Mail}
                  title="I will email the design"
                  subtitle="Best for larger files that cannot be uploaded here."
                  color="var(--wp-cyan)"
                />

                <ChoiceCard
                  active={designOption === 'no_design'}
                  onClick={() => {
                    setDesignOption('no_design')
                    setDesignError('')
                  }}
                  icon={FileText}
                  title="I don’t have a design yet"
                  subtitle="You may request layout assistance for an additional fee."
                  color="var(--wp-yellow)"
                />
              </div>

              {designOption === 'upload' && (
                <div className="space-y-3">
                  <label
                    className="block rounded-sm border border-dashed p-4 cursor-pointer transition-all"
                    style={{
                      borderColor: designFile
                        ? 'var(--wp-green)'
                        : 'rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={handleDesignFileChange}
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-sm flex items-center justify-center"
                        style={{
                          background: 'rgba(22,163,74,0.10)',
                          color: 'var(--wp-green)',
                        }}
                      >
                        <Upload size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white">
                          {designFile ? 'Design file selected' : 'Click to upload design'}
                        </div>
                        <div className="text-xs text-ivory-300/35 mt-1">
                          Accepted: PNG, JPG, JPEG, PDF · Max 10MB
                        </div>
                      </div>
                    </div>
                  </label>

                  {designFile && (
                    <div
                      className="flex items-center justify-between gap-3 rounded-sm border p-3"
                      style={{
                        borderColor: 'rgba(22,163,74,0.22)',
                        background: 'rgba(22,163,74,0.06)',
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-sm text-white font-medium truncate">
                          {designFile.name}
                        </div>
                        <div className="text-[11px] text-ivory-300/40 mt-1">
                          {(designFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={clearDesignFile}
                        className="w-8 h-8 rounded-sm flex items-center justify-center text-ivory-300/45 hover:text-white transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  {designError && (
                    <div className="flex items-start gap-2 text-xs text-[#fca5a5]">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{designError}</span>
                    </div>
                  )}
                </div>
              )}

              {designOption === 'email' && (
                <div
                  className="rounded-sm border p-4 text-sm"
                  style={{
                    borderColor: 'rgba(25,147,210,0.22)',
                    background: 'rgba(25,147,210,0.06)',
                  }}
                >
                  <div className="text-white font-medium mb-1">
                    Send your design via email
                  </div>
                  <p className="text-ivory-300/50 leading-relaxed">
                    Please send your file to{' '}
                    <span className="text-white font-semibold">
                      wellprintormoc@gmail.com
                    </span>{' '}
                    and include your name plus the product you are ordering.
                  </p>
                </div>
              )}

              {designOption === 'no_design' && (
                <div
                  className="rounded-sm border p-4 text-sm"
                  style={{
                    borderColor: 'rgba(245,158,11,0.22)',
                    background: 'rgba(245,158,11,0.06)',
                  }}
                >
                  <div className="text-white font-medium mb-1">
                    Layout assistance available
                  </div>
                  <p className="text-ivory-300/50 leading-relaxed">
                    You may request layout assistance from our team. This service
                    has an additional fee, which will be confirmed during order processing.
                  </p>
                </div>
              )}
            </div>

            {/* FULFILLMENT */}
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 space-y-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-1">
                  Fulfillment Option
                </div>
                <p className="text-xs text-ivory-300/40 leading-relaxed">
                  Choose whether you will pick up your order or have it delivered.
                </p>
              </div>

              <div className="space-y-3">
                <ChoiceCard
                  active={deliveryMethod === 'pickup'}
                  onClick={() => setDeliveryMethod('pickup')}
                  icon={Store}
                  title="Pick up"
                  subtitle="Collect your order personally when it is ready."
                  color="var(--wp-green)"
                />

                <ChoiceCard
                  active={deliveryMethod === 'deliver'}
                  onClick={() => setDeliveryMethod('deliver')}
                  icon={Truck}
                  title="Deliver"
                  subtitle="A flat delivery fee of ₱500 will be added for now."
                  color="var(--wp-cyan)"
                />
              </div>

              <div
                className="rounded-sm border p-4"
                style={{
                  borderColor: 'rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ivory-300/45">Product subtotal</span>
                  <span className="text-white font-medium">
                    ₱{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-ivory-300/45">Delivery fee</span>
                  <span className="text-white font-medium">
                    ₱{deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-white/6 my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-ivory-300/55 text-sm font-semibold">Estimated total</span>
                  <span
                    className="text-white font-black"
                    style={{ fontFamily: "'Lora', serif", fontSize: '1.25rem' }}
                  >
                    ₱{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle
                size={15}
                style={{ color: 'var(--wp-green)', flexShrink: 0 }}
              />
              <span className="text-ivory-300/55">
                Ready in{' '}
                <span className="text-white font-semibold">
                  {displayTurnaround}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2.5 text-sm py-3.5 rounded-sm font-bold uppercase tracking-widest transition-all btn-press"
                style={
                  addedToCart
                    ? { background: 'var(--wp-green)', color: '#0a0a0a' }
                    : {}
                }
              >
                {addedToCart ? (
                  <>
                    <CheckCircle size={16} /> Added to Cart!
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
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-3 rounded-sm border-2 font-bold uppercase tracking-wide transition-all"
                  style={{
                    color: 'var(--wp-cyan)',
                    borderColor: 'var(--wp-cyan)',
                    background: inquired
                      ? 'rgba(25,147,210,0.14)'
                      : 'transparent',
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
                  className="flex-1 btn-press flex items-center justify-center gap-2 text-sm py-3"
                >
                  Request Quote <ArrowRight size={14} />
                </Link>

                <button
                  onClick={() => setHearted((v) => !v)}
                  className="w-12 h-12 border border-white/[0.10] rounded-sm bg-ink-800 flex items-center justify-center transition-all hover:border-wp-magenta/40"
                  style={{
                    color: hearted
                      ? 'var(--wp-magenta)'
                      : 'rgba(216,216,216,0.25)',
                  }}
                >
                  <Heart
                    size={16}
                    fill={hearted ? 'var(--wp-magenta)' : 'transparent'}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Share2 size={12} className="text-ivory-300/25" />
              <span className="text-ivory-300/25 text-[10px] font-body tracking-wider">
                Share this product
              </span>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-3">
                Product Overview
              </div>
              <p className="text-sm leading-relaxed text-ivory-300/60">
                {product.short_description || 'Premium quality print service.'}
              </p>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-3">
                Quick Details
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-ivory-300/35">Min. Qty</span>
                  <span className="text-white">
                    {product.min_qty || 1} {product.unit || 'pcs'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-ivory-300/35">Turnaround</span>
                  <span className="text-white text-right">{displayTurnaround}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-ivory-300/35">Category</span>
                  <span className="text-white text-right">
                    {product.categories?.name || 'General'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-ivory-300/35">Delivery</span>
                  <span className="text-white text-right">
                    {deliveryMethod === 'deliver' ? 'Deliver (+₱500)' : 'Pick up'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-3">
                Why choose this
              </div>
              <div className="space-y-3 text-sm text-ivory-300/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-wp-green" />
                  Quality checked before release
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-wp-cyan" />
                  Fast and reliable turnaround
                </div>
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-wp-yellow" />
                  Suitable for personal or business use
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={specsRef} className="animate-on-scroll mb-14">
          <div className="mb-5">
            <h2
              className="text-white text-2xl font-bold mb-2"
              style={{ fontFamily: "'Lora', serif" }}
            >
              Product Details
            </h2>
            <p className="text-ivory-300/45 text-sm">
              Essential information about this print product.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
                Price
              </div>
              <div className="text-white font-semibold">
                ₱{displayPrice.toLocaleString()}
              </div>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
                Minimum Quantity
              </div>
              <div className="text-white font-semibold">
                {product.min_qty || 1} {product.unit || 'pcs'}
              </div>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
                Turnaround
              </div>
              <div className="text-white font-semibold">{displayTurnaround}</div>
            </div>

            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="text-[10px] uppercase tracking-widest text-ivory-300/35 mb-2">
                Category
              </div>
              <div className="text-white font-semibold">
                {product.categories?.name || 'General'}
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div ref={relatedRef} className="animate-on-scroll">
            <div className="mb-5">
              <h2
                className="text-white text-2xl font-bold mb-2"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Related Products
              </h2>
              <p className="text-ivory-300/45 text-sm">
                You may also want to explore these similar items.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden group transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="relative"
                    style={{ aspectRatio: '4 / 3', background: '#1A1A1A' }}
                  >
                    {p.thumbnail_url ? (
                      <img
                        src={p.thumbnail_url}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImagePlus
                          size={22}
                          style={{ color: 'rgba(216,216,216,0.20)' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="text-white text-sm font-semibold mb-1 line-clamp-2"
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      {p.name}
                    </h3>
                    <p className="text-ivory-300/40 text-xs mb-3 line-clamp-2">
                      {p.short_description}
                    </p>
                    <div className="text-white font-bold">
                      ₱{Number(p.base_price || 0).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}