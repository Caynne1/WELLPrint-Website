import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'
import PageHero from '../components/ui/PageHero'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ImagePlus,
  Tag,
  FileText,
  ArrowLeft,
  CheckCircle,
  X,
  Send,
  AlertCircle,
  Phone,
  Mail,
  ClipboardList,
  Paintbrush,
  Printer,
  PackageCheck,
  MessageSquare,
  User,
  Building2,
  Upload,
} from 'lucide-react'

function formatPHP(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// ─── CartItem ──────────────────────────────────────────────────
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [removing, setRemoving] = useState(false)

  const cardBg      = isDark ? 'var(--surface-card)' : '#ffffff'
  const cardBorder  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'
  const imgBg       = isDark ? '#1a1a1a' : '#f1f5f9'
  const imgBorder   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)'
  const nameColor   = isDark ? '#ffffff' : '#0f172a'
  const tagBg       = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)'
  const tagBorder   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'
  const tagText     = isDark ? 'rgba(203,213,225,0.40)' : '#94a3b8'
  const unitText    = isDark ? 'rgba(203,213,225,0.35)' : '#94a3b8'
  const qtyBg       = isDark ? 'var(--surface-raised)' : '#f8fafc'
  const qtyBorder   = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.10)'
  const qtyText     = isDark ? 'rgba(203,213,225,0.50)' : '#64748b'
  const qtyHoverBg  = isDark ? '#1e2d45' : '#e2e8f0'
  const priceColor  = isDark ? '#ffffff' : '#0f172a'
  const delivText   = isDark ? 'rgba(203,213,225,0.25)' : '#94a3b8'
  const readyText   = isDark ? 'rgba(203,213,225,0.30)' : '#94a3b8'
  const shadowVal   = isDark ? '0 8px 30px rgba(2,8,23,0.14)' : '0 4px 20px rgba(15,23,42,0.08)'

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => removeItem(item.key), 300)
  }

  const subtotal   = (item.unitPrice || 0) * (item.qty || 0)
  const deliveryFee = item.deliveryFee ?? 0

  return (
    <div
      className="flex gap-0 overflow-hidden rounded-[18px] border transition-all duration-300"
      style={{
        background: cardBg,
        borderColor: cardBorder,
        boxShadow: shadowVal,
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(20px)' : 'translateX(0)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 w-28 sm:w-36 flex items-center justify-center overflow-hidden"
        style={{
          background: imgBg,
          borderRight: `1px solid ${imgBorder}`,
          aspectRatio: '1/1',
        }}
      >
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlus size={22} style={{ color: item.accent || 'var(--wp-green)', opacity: 0.25 }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${item.slug}`}
              className="font-semibold text-sm leading-snug hover:text-wp-green transition-colors"
              style={{ fontFamily: "'Lora', serif", color: nameColor }}
            >
              {item.name}
            </Link>

            {item.selections && Object.keys(item.selections).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(item.selections).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-[9px] font-body px-2 py-0.5 rounded-sm border"
                    style={{ background: tagBg, borderColor: tagBorder, color: tagText }}
                  >
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}

            {(item.designOption || item.deliveryMethod) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.designOption && (
                  <span
                    className="text-[9px] font-body px-2 py-0.5 rounded-sm border"
                    style={{ background: tagBg, borderColor: tagBorder, color: tagText }}
                  >
                    Design:{' '}
                    {item.designOption === 'upload'
                      ? item.designFileName || 'Uploaded file'
                      : item.designOption === 'email'
                      ? 'Will email design'
                      : 'Needs layout assistance'}
                  </span>
                )}
                {item.deliveryMethod && (
                  <span
                    className="text-[9px] font-body px-2 py-0.5 rounded-sm border"
                    style={{ background: tagBg, borderColor: tagBorder, color: tagText }}
                  >
                    {item.deliveryMethod === 'deliver'
                      ? `Delivery (+${formatPHP(item.deliveryFee || 0)})`
                      : 'Pickup'}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-sm hover:text-wp-magenta hover:bg-wp-magenta/10 transition-all"
            style={{ color: unitText }}
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs font-body" style={{ color: unitText }}>
            {formatPHP(item.unitPrice || 0)} / {item.unit || 'pcs'}
          </div>

          {/* Qty controls */}
          <div className="flex items-center">
            <button
              onClick={() => updateQty(item.key, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-l-sm border transition-all"
              style={{
                background: qtyBg,
                borderColor: qtyBorder,
                color: qtyText,
              }}
              onMouseEnter={e => e.currentTarget.style.background = qtyHoverBg}
              onMouseLeave={e => e.currentTarget.style.background = qtyBg}
            >
              <Minus size={11} />
            </button>
            <div
              className="w-12 h-8 border-t border-b flex items-center justify-center text-xs font-body font-bold"
              style={{ background: qtyBg, borderColor: qtyBorder, color: priceColor }}
            >
              {item.qty}
            </div>
            <button
              onClick={() => updateQty(item.key, item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-r-sm border transition-all"
              style={{
                background: qtyBg,
                borderColor: qtyBorder,
                color: qtyText,
              }}
              onMouseEnter={e => e.currentTarget.style.background = qtyHoverBg}
              onMouseLeave={e => e.currentTarget.style.background = qtyBg}
            >
              <Plus size={11} />
            </button>
          </div>

          <div className="text-right">
            <div className="font-bold text-base" style={{ fontFamily: "'Lora', serif", color: priceColor }}>
              {formatPHP(subtotal + deliveryFee)}
            </div>
            {deliveryFee > 0 && (
              <div className="text-[10px] font-body" style={{ color: delivText }}>
                includes {formatPHP(deliveryFee)} delivery
              </div>
            )}
          </div>
        </div>

        {item.turnaround && (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />
            <span className="text-[10px] font-body" style={{ color: readyText }}>
              Ready in {item.turnaround}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── EmptyCart ─────────────────────────────────────────────────
function EmptyCart() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const iconBg     = isDark ? '#0d1a2e' : '#f1f5f9'
  const iconBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'
  const iconColor  = isDark ? 'rgba(203,213,225,0.15)' : '#cbd5e1'
  const headColor  = isDark ? '#ffffff' : '#0f172a'
  const subColor   = isDark ? 'rgba(203,213,225,0.40)' : '#64748b'

  return (
    <div className="text-center py-24">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 border"
        style={{ background: iconBg, borderColor: iconBorder }}
      >
        <ShoppingCart size={32} style={{ color: iconColor }} />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Lora', serif", color: headColor }}>
        Your cart is empty
      </h2>
      <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: subColor }}>
        Browse our products and add something to get started.
      </p>
      <Link to="/products" className="btn-press inline-flex items-center gap-2 text-sm">
        Browse Products <ArrowRight size={14} />
      </Link>
    </div>
  )
}

// ─── Field (checkout modal — stays dark) ───────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label
        className="block font-body text-[10px] tracking-widest uppercase mb-2"
        style={{ color: error ? 'var(--wp-magenta)' : 'rgba(216,216,216,0.5)' }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: 'var(--wp-green)' }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: 'var(--wp-magenta)' }}>
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

// ─── Checkout modal — intentionally stays dark ─────────────────
const inputClass = `w-full bg-ink-900 border border-white/[0.10] rounded-sm px-4 py-3 text-sm text-ivory-200
  placeholder-ivory-300/25 outline-none transition-all duration-200
  focus:border-wp-green/60 focus:bg-ink-800 focus:ring-1 focus:ring-wp-green/20`

const ORDER_TYPES = [
  'New Print Order',
  'Request a Quote',
  'Bulk / Corporate Order',
  'Rush Order',
  'Follow Up on an Order',
  'General Question',
]

const ORDER_STEPS = [
  { icon: ClipboardList, title: 'Review Cart',          desc: 'Check your selected products, options, quantity, design submission method, and pickup or delivery choice.',          color: 'var(--wp-green)' },
  { icon: MessageSquare, title: 'Complete Order Details', desc: 'Fill out your name, email, phone number, and any order notes so we can process your request properly.',            color: 'var(--wp-cyan)' },
  { icon: Paintbrush,    title: 'Artwork & Confirmation', desc: 'If needed, we review your uploaded file, emailed design, or layout request before final production.',             color: 'var(--wp-yellow)' },
  { icon: Printer,       title: 'Production',             desc: 'Once confirmed, your order moves into processing and printing based on the chosen product and timeline.',          color: 'var(--wp-magenta)' },
  { icon: PackageCheck,  title: 'Pickup or Delivery',     desc: 'Your order is quality-checked, packed, and prepared for pickup or delivery to your location.',                    color: 'var(--wp-green)' },
]

async function uploadDesignFile(file) {
  if (!file) return { url: null, fileName: null }
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = `orders/${safeName}`
  const { error: uploadError } = await supabase.storage.from('customer-designs').upload(filePath, file, { cacheControl: '3600', upsert: false })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('customer-designs').getPublicUrl(filePath)
  return { url: data?.publicUrl || null, fileName: file.name }
}

function CheckoutModal({ open, onClose, cart, totalPrice, onSuccess }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', orderType: '', notes: '', file: null })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState(null)
  const [placedOrderId, setPlacedOrderId] = useState(null)

  if (!open) return null

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.orderType) e.orderType = 'Please select an order type'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setSubmitError(null)
    setStatus('submitting')
    try {
      const itemsPayload = cart.map((item) => ({
        product_name: item.name, qty: item.qty, unit: item.unit ?? 'pcs', unit_price: item.unitPrice,
        selections: item.selections ?? {}, design_option: item.designOption ?? null,
        design_file_name: item.designFileName ?? null, layout_request: !!item.layoutRequest,
        delivery_method: item.deliveryMethod ?? 'pickup', delivery_fee: item.deliveryFee ?? 0,
      }))
      let uploadSourceFile = form.file || cart.find((i) => i.designFile instanceof File)?.designFile || null
      let uploadedFileUrl = null, uploadedFileName = null
      if (uploadSourceFile) {
        const uploaded = await uploadDesignFile(uploadSourceFile)
        uploadedFileUrl = uploaded.url; uploadedFileName = uploaded.fileName
      } else {
        uploadedFileName = cart.find((i) => i.designFileName)?.designFileName || null
      }
      const payload = {
        p_customer_name: form.name.trim(), p_customer_email: form.email.trim().toLowerCase(),
        p_customer_phone: form.phone.trim(), p_customer_company: form.company.trim() || '',
        p_order_type: form.orderType, p_notes: form.notes.trim() || '',
        p_estimated_total: totalPrice, p_status: 'pending',
        p_items: JSON.parse(JSON.stringify(itemsPayload)),
        p_design_file_url: uploadedFileUrl, p_design_file_name: uploadedFileName,
      }
      const { data, error } = await supabase.rpc('submit_order', payload)
      if (error) throw error
      setPlacedOrderId(data)
      setStatus('success')
      if (onSuccess) onSuccess(data)
    } catch (err) {
      const message = err?.message || err?.error_description || err?.details || err?.hint || JSON.stringify(err)
      setSubmitError(message || 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.78)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-[22px] bg-ink-900 border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-px w-6 bg-wp-green" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Checkout</span>
            </div>
            <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Lora', serif" }}>Place Your Order</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-sm border border-white/[0.08] bg-ink-800 text-ivory-300/35 hover:text-white hover:border-white/[0.14] transition-all flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-74px)] overflow-y-auto p-6 sm:p-8">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center text-center py-16 px-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)' }}>
                <CheckCircle size={32} style={{ color: 'var(--wp-green)' }} />
              </div>
              <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Lora', serif" }}>Order Placed!</h3>
              <p className="text-ivory-300/55 text-sm max-w-sm leading-relaxed mb-3">
                Thanks, <span className="text-white font-semibold">{form.name}</span>! Your order has been submitted successfully.
              </p>
              {placedOrderId && (
                <div className="px-4 py-3 rounded-sm border mb-6" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-ivory-300/30 mb-1">Order Reference</div>
                  <div className="text-white font-semibold break-all">{placedOrderId}</div>
                </div>
              )}
              <p className="text-ivory-300/35 text-xs max-w-xs leading-relaxed mb-8">Please save this reference for now. We will use this later for order tracking.</p>
              <button onClick={onClose} className="btn-press text-sm">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <p className="text-ivory-300/40 text-xs leading-relaxed">Fill out your details below to complete your order. We already received your selected cart items automatically.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" required error={errors.name}>
                  <div className="relative">
                    <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                    <input type="text" placeholder="Juan dela Cruz" value={form.name} onChange={set('name')} className={inputClass + ' pl-9'} style={errors.name ? { borderColor: 'var(--wp-magenta)' } : {}} />
                  </div>
                </Field>
                <Field label="Company / Organization">
                  <div className="relative">
                    <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                    <input type="text" placeholder="Your Company Inc." value={form.company} onChange={set('company')} className={inputClass + ' pl-9'} />
                  </div>
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email Address" required error={errors.email}>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                    <input type="email" placeholder="juan@company.com" value={form.email} onChange={set('email')} className={inputClass + ' pl-9'} style={errors.email ? { borderColor: 'var(--wp-magenta)' } : {}} />
                  </div>
                </Field>
                <Field label="Phone / Viber / WhatsApp" required error={errors.phone}>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                    <input type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={set('phone')} className={inputClass + ' pl-9'} style={errors.phone ? { borderColor: 'var(--wp-magenta)' } : {}} />
                  </div>
                </Field>
              </div>
              <Field label="Order Type" required error={errors.orderType}>
                <select value={form.orderType} onChange={set('orderType')} className={inputClass + ' cursor-pointer'} style={errors.orderType ? { borderColor: 'var(--wp-magenta)' } : {}}>
                  <option value="" disabled>Select order type…</option>
                  {ORDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Additional Notes (optional)">
                <textarea rows={4} placeholder="Deadline, special instructions, preferred delivery method, etc." value={form.notes} onChange={set('notes')} className={inputClass + ' resize-none'} />
              </Field>
              <Field label="Attach Reference File (optional)">
                <label className={`${inputClass} flex items-center gap-3 cursor-pointer`} style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}>
                  <span className="text-ivory-300/30 shrink-0 text-xs font-body truncate max-w-[180px]">{form.file ? form.file.name : 'No file chosen'}</span>
                  <span className="ml-auto shrink-0 btn-press-outline" style={{ fontSize: '10px', padding: '4px 10px' }}>
                    <Upload size={12} className="inline mr-1" /> Browse
                  </span>
                  <input type="file" className="hidden" accept=".pdf,.ai,.eps,.jpg,.jpeg,.png,.tiff,.zip" onChange={(e) => setForm((f) => ({ ...f, file: e.target.files[0] || null }))} />
                </label>
                <p className="text-[10px] text-ivory-300/25 font-body mt-1.5">Accepted: PDF, AI, EPS, JPG, PNG, TIFF, ZIP · Max 20MB</p>
              </Field>
              <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
                <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-3">Cart snapshot</div>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.key} className="flex items-center justify-between text-xs gap-4">
                      <span className="text-ivory-300/55 truncate max-w-[220px]">{item.name}</span>
                      <span className="text-ivory-300/40 font-body shrink-0">{item.qty} {item.unit || 'pcs'} — {formatPHP((item.unitPrice || 0) * (item.qty || 0) + (item.deliveryFee || 0))}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between items-center">
                  <span className="text-ivory-300/40 text-xs font-body">Estimated Total</span>
                  <span className="text-white font-bold text-sm" style={{ fontFamily: "'Lora', serif" }}>{formatPHP(totalPrice)}</span>
                </div>
                <p className="text-[10px] font-body text-ivory-300/20 mt-1">Final price may still be confirmed after review.</p>
              </div>
              <div className="flex items-center justify-between pt-1 flex-col gap-3">
                {submitError && (
                  <div className="w-full flex items-start gap-2 px-4 py-3 rounded-sm border text-xs" style={{ background: 'rgba(236,0,140,0.08)', borderColor: 'rgba(236,0,140,0.25)', color: '#CD1B6E' }}>
                    <AlertCircle size={13} className="shrink-0 mt-0.5" /><span>{submitError}</span>
                  </div>
                )}
                <div className="flex items-center justify-between w-full gap-4 flex-wrap">
                  <p className="text-[10px] font-body text-ivory-300/25"><span style={{ color: 'var(--wp-green)' }}>*</span> Required fields</p>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={onClose} className="btn-press-ghost text-sm">Cancel</button>
                    <button type="submit" disabled={status === 'submitting'} className="btn-press flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                      {status === 'submitting' ? (<><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order…</>) : (<>Place Order <Send size={14} /></>)}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── CartPage ──────────────────────────────────────────────────
export default function CartPage() {
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  const isEmpty = cart.length === 0

  // Color tokens
  const pageBg       = isDark ? '#060c14' : '#f1f5f9'
  const cardBg       = isDark ? '#0d1a2e' : '#ffffff'
  const cardBorder   = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.08)'
  const cardShadow   = isDark ? 'none' : '0 4px 20px rgba(15,23,42,0.07)'
  const headColor    = isDark ? '#ffffff' : '#0f172a'
  const subText      = isDark ? 'rgba(203,213,225,0.45)' : '#64748b'
  const mutedText    = isDark ? 'rgba(203,213,225,0.35)' : '#94a3b8'
  const faintText    = isDark ? 'rgba(203,213,225,0.25)' : '#cbd5e1'
  const veryFaint    = isDark ? 'rgba(203,213,225,0.20)' : '#e2e8f0'
  const divider      = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.07)'
  const summaryHeader= isDark ? 'rgba(19,161,80,0.06)'   : 'rgba(22,163,74,0.05)'
  const stepStepColor= isDark ? 'rgba(203,213,225,0.30)' : '#94a3b8'
  const tinyNote     = isDark ? 'rgba(203,213,225,0.20)' : '#cbd5e1'

  function handleOrderSuccess() {
    clearCart()
  }

  return (
    <>
      <PageHero
        label="Your Order"
        title="Shopping"
        titleAccent="Cart"
        subtitle={isEmpty ? 'Nothing here yet.' : `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart.`}
      />

      <section className="py-16 min-h-[50vh]" style={{ background: pageBg }}>
        <div className="max-w-7xl mx-auto px-6">
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="space-y-14">
              <div className="grid lg:grid-cols-3 gap-10">

                {/* ── Left: cart items ── */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: mutedText }}>
                      {totalItems} Item{totalItems !== 1 ? 's' : ''}
                    </span>
                    {!showClearConfirm ? (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] font-body hover:text-wp-magenta transition-colors flex items-center gap-1"
                        style={{ color: faintText }}
                      >
                        <X size={10} /> Clear cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-[10px] font-body">
                        <span style={{ color: mutedText }}>Remove all items?</span>
                        <button onClick={() => { clearCart(); setShowClearConfirm(false) }} className="text-wp-magenta hover:underline">Yes, clear</button>
                        <button onClick={() => setShowClearConfirm(false)} style={{ color: mutedText }}>Cancel</button>
                      </div>
                    )}
                  </div>

                  {cart.map((item) => <CartItem key={item.key} item={item} />)}

                  {/* File reminders */}
                  <div
                    className="mt-6 rounded-[18px] border p-5 flex gap-4 items-start"
                    style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
                  >
                    <FileText size={18} style={{ color: 'var(--wp-green)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="font-body text-[10px] tracking-widest uppercase text-wp-green mb-1">
                        Order file reminders
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: subText }}>
                        If you selected design upload, email submission, or layout assistance, our team will review that together with your order details after checkout.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/products" className="btn-press-ghost inline-flex items-center gap-2 text-sm">
                      <ArrowLeft size={14} /> Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* ── Right: summary sidebar ── */}
                <div className="lg:col-span-1 space-y-4">

                  {/* Order summary */}
                  <div className="rounded-[18px] border overflow-hidden" style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}>
                    <div className="px-5 py-4 border-b" style={{ background: summaryHeader, borderColor: divider }}>
                      <div className="flex items-center gap-2">
                        <Tag size={13} style={{ color: 'var(--wp-green)' }} />
                        <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">Order Summary</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {cart.map((item) => {
                        const rowTotal = (item.unitPrice || 0) * (item.qty || 0) + (item.deliveryFee || 0)
                        return (
                          <div key={item.key} className="flex items-start justify-between gap-3 text-xs">
                            <div className="leading-snug flex-1 min-w-0" style={{ color: subText }}>
                              <span className="truncate block">{item.name}</span>
                              <span className="font-body" style={{ color: faintText }}>
                                {item.qty} {item.unit || 'pcs'} × {formatPHP(item.unitPrice || 0)}
                              </span>
                              {item.deliveryFee > 0 && (
                                <span className="block font-body mt-1" style={{ color: veryFaint }}>
                                  + Delivery {formatPHP(item.deliveryFee)}
                                </span>
                              )}
                            </div>
                            <span className="font-body shrink-0" style={{ color: subText }}>{formatPHP(rowTotal)}</span>
                          </div>
                        )
                      })}
                      <div className="pt-3 mt-3 border-t" style={{ borderColor: divider }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-body" style={{ color: mutedText }}>Estimated Total</span>
                          <span className="text-xs font-body" style={{ color: subText }}>{formatPHP(totalPrice)}</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-3 mt-3 border-t" style={{ borderColor: divider }}>
                          <span className="font-semibold text-sm" style={{ color: headColor }}>Total</span>
                          <span className="font-black text-xl" style={{ fontFamily: "'Lora', serif", color: headColor }}>{formatPHP(totalPrice)}</span>
                        </div>
                        <p className="text-[9px] font-body mt-1.5 leading-relaxed" style={{ color: tinyNote }}>Final amount may still be confirmed after review.</p>
                      </div>
                    </div>
                  </div>

                  {/* Guarantees */}
                  <div className="rounded-[18px] border p-4 space-y-2.5" style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}>
                    {[
                      { text: 'Color accuracy guaranteed',    color: 'var(--wp-green)' },
                      { text: 'Reprint if we make an error',  color: 'var(--wp-green)' },
                      { text: 'Backed by Espiel-Bereso Group',color: 'var(--wp-cyan)' },
                    ].map(({ text, color }) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs" style={{ color: subText }}>
                        <CheckCircle size={12} style={{ color, flexShrink: 0 }} /> {text}
                      </div>
                    ))}
                  </div>

                  {/* Contact */}
                  <div className="rounded-[18px] border p-4 space-y-3" style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}>
                    <div className="font-body text-[10px] tracking-widest uppercase mb-1" style={{ color: mutedText }}>Need help? Contact us</div>
                    <a href="tel:+6328XXXXXXXX" className="flex items-center gap-3 text-xs hover:text-wp-green transition-colors" style={{ color: subText }}>
                      <Phone size={13} style={{ color: 'var(--wp-green)' }} /> +63 (2) 8XXX-XXXX
                    </a>
                    <a href="mailto:hello@wellprint.com.ph" className="flex items-center gap-3 text-xs hover:text-wp-cyan transition-colors" style={{ color: subText }}>
                      <Mail size={13} style={{ color: 'var(--wp-cyan)' }} /> hello@wellprint.com.ph
                    </a>
                    <p className="text-[10px] font-body" style={{ color: faintText }}>Mon–Fri 8AM–6PM · Sat 9AM–1PM</p>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="btn-press w-full flex items-center justify-center gap-2 text-sm py-4"
                  >
                    Proceed to Checkout <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* ── How It Works ── */}
              <div className="border-t pt-14" style={{ borderColor: divider }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-8 bg-wp-green" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">How It Works</span>
                </div>
                <h2 className="text-2xl font-bold mb-10" style={{ fontFamily: "'Lora', serif", color: headColor }}>
                  Your Order <span style={{ color: 'var(--wp-green)' }}>Process</span>
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {ORDER_STEPS.map((step, i) => (
                    <div key={step.title} className="relative">
                      {i < ORDER_STEPS.length - 1 && (
                        <div
                          className="hidden lg:block absolute top-5 left-[calc(100%_-_8px)] w-full h-px z-0"
                          style={{ background: 'linear-gradient(90deg, rgba(19,161,80,0.3), transparent)' }}
                        />
                      )}
                      <div
                        className="rounded-[18px] border p-5 h-full relative z-10"
                        style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
                      >
                        <div className="font-body text-[9px] tracking-widest mb-3" style={{ color: stepStepColor }}>
                          STEP {String(i + 1).padStart(2, '0')}
                        </div>
                        <div
                          className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-4"
                          style={{ background: `${step.color}14`, border: `1px solid ${step.color}30` }}
                        >
                          <step.icon size={17} style={{ color: step.color }} />
                        </div>
                        <div className="font-semibold text-sm mb-2 leading-snug" style={{ fontFamily: "'Lora', serif", color: headColor }}>
                          {step.title}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: mutedText }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        cart={cart}
        totalPrice={totalPrice}
        onSuccess={handleOrderSuccess}
      />
    </>
  )
}
