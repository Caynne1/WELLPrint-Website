import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import PageHero from '../components/ui/PageHero'
import {
  Trash2, Plus, Minus, ShoppingCart, ArrowRight,
  ImagePlus, Tag, FileText, ArrowLeft, CheckCircle, X
} from 'lucide-react'

function formatPHP(amount) {
  return '\u20B1' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/* ── Cart item row ── */
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const [removing, setRemoving] = useState(false)

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => removeItem(item.key), 300)
  }

  const subtotal = item.unitPrice * item.qty

  return (
    <div
      className="card-press flex gap-0 overflow-hidden transition-all duration-300"
      style={{ opacity: removing ? 0 : 1, transform: removing ? 'translateX(20px)' : 'translateX(0)' }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 w-28 sm:w-36 flex items-center justify-center border-r border-white/[0.06]"
        style={{ background: '#1A1A1A', aspectRatio: '1/1' }}
      >
        <ImagePlus size={22} style={{ color: item.accent || 'var(--wp-green)', opacity: 0.2 }} />
      </div>

      {/* Info */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${item.slug}`}
              className="text-white font-semibold text-sm leading-snug hover:text-wp-green transition-colors"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {item.name}
            </Link>
            {/* Selections */}
            {item.selections && Object.keys(item.selections).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(item.selections).map(([k, v]) => (
                  <span key={k} className="text-[9px] font-mono px-2 py-0.5 rounded-sm border border-white/[0.08] text-ivory-300/40">
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-sm text-ivory-300/25 hover:text-wp-magenta hover:bg-wp-magenta/10 transition-all"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Unit price */}
          <div className="text-ivory-300/35 text-xs font-mono">
            {formatPHP(item.unitPrice)} / {item.unit}
          </div>

          {/* Qty stepper */}
          <div className="flex items-center">
            <button
              onClick={() => updateQty(item.key, item.qty - 1)}
              className="w-8 h-8 border border-white/[0.10] rounded-l-sm bg-ink-800 flex items-center justify-center
                text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all"
            >
              <Minus size={11} />
            </button>
            <div className="w-12 h-8 border-t border-b border-white/[0.10] bg-ink-700 flex items-center justify-center
              text-white text-xs font-mono font-bold">
              {item.qty}
            </div>
            <button
              onClick={() => updateQty(item.key, item.qty + 1)}
              className="w-8 h-8 border border-white/[0.10] rounded-r-sm bg-ink-800 flex items-center justify-center
                text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Subtotal */}
          <div className="font-bold text-white text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
            {formatPHP(subtotal)}
          </div>
        </div>

        {/* Turnaround */}
        {item.turnaround && (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />
            <span className="text-[10px] font-mono text-ivory-300/30">Ready in {item.turnaround}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Empty state ── */
function EmptyCart() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 rounded-sm bg-ink-800 border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
        <ShoppingCart size={32} className="text-ivory-300/15" />
      </div>
      <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
        Your cart is empty
      </h2>
      <p className="text-ivory-300/40 text-sm mb-8 max-w-xs mx-auto">
        Browse our products and add something to get started.
      </p>
      <Link to="/products" className="btn-press inline-flex items-center gap-2 text-sm">
        Browse Products <ArrowRight size={14} />
      </Link>
    </div>
  )
}

/* ── Page ── */
export default function CartPage() {
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const isEmpty = cart.length === 0

  return (
    <>
      <PageHero
        label="Your Order"
        title="Shopping"
        titleAccent="Cart"
        subtitle={isEmpty ? 'Nothing here yet.' : `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart.`}
      />

      <section className="py-16 bg-ink-900 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">

          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">

              {/* ── Left: items ── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30">
                    {totalItems} Item{totalItems !== 1 ? 's' : ''}
                  </span>
                  {!showClearConfirm ? (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[10px] font-mono text-ivory-300/25 hover:text-wp-magenta transition-colors flex items-center gap-1"
                    >
                      <X size={10} /> Clear cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 text-[10px] font-mono">
                      <span className="text-ivory-300/40">Remove all items?</span>
                      <button onClick={() => { clearCart(); setShowClearConfirm(false) }}
                        className="text-wp-magenta hover:underline">Yes, clear</button>
                      <button onClick={() => setShowClearConfirm(false)}
                        className="text-ivory-300/40 hover:text-white">Cancel</button>
                    </div>
                  )}
                </div>

                {/* Items */}
                {cart.map(item => <CartItem key={item.key} item={item} />)}

                {/* File upload reminder */}
                <div className="mt-6 bg-ink-800 border border-white/[0.07] rounded-sm p-5 flex gap-4 items-start">
                  <FileText size={18} style={{ color: 'var(--wp-green)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-wp-green mb-1">
                      Don't forget your artwork
                    </div>
                    <p className="text-ivory-300/45 text-xs leading-relaxed">
                      After placing your inquiry, our team will request your print-ready files.
                      Make sure they are PDF/AI/EPS at 300dpi with 3mm bleed and CMYK color mode.
                    </p>
                    <Link to="/file-specs"
                      className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono text-ivory-300/30 hover:text-wp-green transition-colors">
                      View full file spec guide <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/products" className="btn-press-ghost inline-flex items-center gap-2 text-sm">
                    <ArrowLeft size={14} /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* ── Right: summary ── */}
              <div className="lg:col-span-1 space-y-4">

                {/* Order summary */}
                <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06]"
                    style={{ background: 'rgba(45,176,75,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <Tag size={13} style={{ color: 'var(--wp-green)' }} />
                      <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">
                        Order Summary
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Line items */}
                    {cart.map(item => (
                      <div key={item.key} className="flex items-start justify-between gap-3 text-xs">
                        <div className="text-ivory-300/50 leading-snug flex-1 min-w-0">
                          <span className="truncate block">{item.name}</span>
                          <span className="text-ivory-300/25 font-mono">
                            {item.qty} {item.unit} × {formatPHP(item.unitPrice)}
                          </span>
                        </div>
                        <span className="text-ivory-300/70 font-mono shrink-0">
                          {formatPHP(item.unitPrice * item.qty)}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-white/[0.08] pt-3 mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-ivory-300/40 text-xs font-mono">Subtotal</span>
                        <span className="text-ivory-300/70 text-xs font-mono">{formatPHP(totalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-ivory-300/40 text-xs font-mono">Taxes & Fees</span>
                        <span className="text-ivory-300/30 text-xs font-mono">Confirmed on inquiry</span>
                      </div>

                      {/* Total */}
                      <div className="flex items-baseline justify-between pt-3 border-t border-white/[0.08]">
                        <span className="text-white font-semibold text-sm">Estimated Total</span>
                        <span className="text-white font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {formatPHP(totalPrice)}
                        </span>
                      </div>
                      <p className="text-ivory-300/20 text-[9px] font-mono mt-1.5 leading-relaxed">
                        Estimate only. Final price confirmed after inquiry review.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  to="/contact"
                  className="btn-press w-full flex items-center justify-center gap-2 text-sm py-4"
                >
                  Send Inquiry / Checkout <ArrowRight size={15} />
                </Link>

                <p className="text-center text-[10px] font-mono text-ivory-300/20 leading-relaxed px-2">
                  Online checkout coming soon. For now, submitting this cart sends an inquiry to our team.
                </p>

                {/* Guarantees */}
                <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-4 space-y-2.5">
                  {[
                    { text: 'Color accuracy guaranteed',   color: 'var(--wp-green)' },
                    { text: 'Reprint if we make an error', color: 'var(--wp-green)' },
                    { text: 'Backed by Bereso Group',      color: 'var(--wp-cyan)'  },
                  ].map(({ text, color }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs text-ivory-300/45">
                      <CheckCircle size={12} style={{ color, flexShrink: 0 }} />
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}