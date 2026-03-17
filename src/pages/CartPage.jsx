import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import PageHero from '../components/ui/PageHero'
import {
  Trash2, Plus, Minus, ShoppingCart, ArrowRight,
  ImagePlus, Tag, FileText, ArrowLeft, CheckCircle, X,
  Send, AlertCircle, Phone, Mail,
  ClipboardList, Paintbrush, Printer, PackageCheck, MessageSquare,
  User, Building2
} from 'lucide-react'

function formatPHP(amount) {
  return '\u20B1' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const [removing, setRemoving] = useState(false)
  function handleRemove() { setRemoving(true); setTimeout(() => removeItem(item.key), 300) }
  const subtotal = item.unitPrice * item.qty
  return (
    <div className="card-press flex gap-0 overflow-hidden transition-all duration-300"
      style={{ opacity: removing ? 0 : 1, transform: removing ? 'translateX(20px)' : 'translateX(0)' }}>
      <div className="shrink-0 w-28 sm:w-36 flex items-center justify-center border-r border-white/[0.06]"
        style={{ background: '#1A1A1A', aspectRatio: '1/1' }}>
        <ImagePlus size={22} style={{ color: item.accent || 'var(--wp-green)', opacity: 0.2 }} />
      </div>
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${item.slug}`}
              className="text-white font-semibold text-sm leading-snug hover:text-wp-green transition-colors"
              style={{ fontFamily: "'Lora', serif" }}>{item.name}</Link>
            {item.selections && Object.keys(item.selections).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(item.selections).map(([k, v]) => (
                  <span key={k} className="text-[9px] font-body px-2 py-0.5 rounded-sm border border-white/[0.08] text-ivory-300/40">{k}: {v}</span>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleRemove} className="shrink-0 p-1.5 rounded-sm text-ivory-300/25 hover:text-wp-magenta hover:bg-wp-magenta/10 transition-all" aria-label="Remove item">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-ivory-300/35 text-xs font-body">{formatPHP(item.unitPrice)} / {item.unit}</div>
          <div className="flex items-center">
            <button onClick={() => updateQty(item.key, item.qty - 1)}
              className="w-8 h-8 border border-white/[0.10] rounded-l-sm bg-ink-800 flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all">
              <Minus size={11} />
            </button>
            <div className="w-12 h-8 border-t border-b border-white/[0.10] bg-ink-700 flex items-center justify-center text-white text-xs font-body font-bold">{item.qty}</div>
            <button onClick={() => updateQty(item.key, item.qty + 1)}
              className="w-8 h-8 border border-white/[0.10] rounded-r-sm bg-ink-800 flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all">
              <Plus size={11} />
            </button>
          </div>
          <div className="font-bold text-white text-base" style={{ fontFamily: "'Lora', serif" }}>{formatPHP(subtotal)}</div>
        </div>
        {item.turnaround && (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />
            <span className="text-[10px] font-body text-ivory-300/30">Ready in {item.turnaround}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 rounded-sm bg-ink-800 border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
        <ShoppingCart size={32} className="text-ivory-300/15" />
      </div>
      <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Lora', serif" }}>Your cart is empty</h2>
      <p className="text-ivory-300/40 text-sm mb-8 max-w-xs mx-auto">Browse our products and add something to get started.</p>
      <Link to="/products" className="btn-press inline-flex items-center gap-2 text-sm">Browse Products <ArrowRight size={14} /></Link>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-body text-[10px] tracking-widest uppercase mb-2"
        style={{ color: error ? 'var(--wp-magenta)' : 'rgba(216,216,216,0.5)' }}>
        {label}{required && <span className="ml-1" style={{ color: 'var(--wp-green)' }}>*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs flex items-center gap-1" style={{ color: 'var(--wp-magenta)' }}><AlertCircle size={11} /> {error}</p>}
    </div>
  )
}

const inputClass = `w-full bg-ink-900 border border-white/[0.10] rounded-sm px-4 py-3 text-sm text-ivory-200
  placeholder-ivory-300/25 outline-none transition-all duration-200
  focus:border-wp-green/60 focus:bg-ink-800 focus:ring-1 focus:ring-wp-green/20`

const INQUIRY_TYPES = ['New Print Order','Request a Quote','Bulk / Corporate Order','Rush Order','Follow Up on an Order','General Inquiry']

const ORDER_STEPS = [
  { icon: ClipboardList, title: 'Submit Inquiry',     desc: 'Fill out the form below with your contact info and any project notes. We receive your cart automatically.',  color: 'var(--wp-green)'   },
  { icon: MessageSquare, title: 'We Review & Quote',  desc: 'Our team reviews your order within 1 business day and sends you a final price and timeline.',                  color: 'var(--wp-cyan)'    },
  { icon: Paintbrush,    title: 'Approve Artwork',    desc: 'Send your print-ready files (PDF/AI/EPS, 300dpi, CMYK, 3mm bleed). We confirm before printing.',                color: 'var(--wp-yellow)'  },
  { icon: Printer,       title: 'We Print',           desc: 'Production begins once artwork and payment are confirmed. You\'ll receive status updates along the way.',       color: 'var(--wp-magenta)' },
  { icon: PackageCheck,  title: 'Pickup or Delivery', desc: 'Your order is quality-checked, packed, and ready for pickup or delivery to your location.',                     color: 'var(--wp-green)'   },
]

function CheckoutForm({ cart, totalPrice, onSuccess }) {
  const [form, setForm] = useState({ name:'', company:'', email:'', phone:'', inquiryType:'', notes:'', file:null })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState(null)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.inquiryType)  e.inquiryType = 'Please select an order type'
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
      // Call SECURITY DEFINER function — bypasses RLS for anon customers
      const { data: orderId, error: rpcErr } = await supabase.rpc('submit_order', {
        p_customer_name:   form.name.trim(),
        p_customer_email:  form.email.trim().toLowerCase(),
        p_customer_phone:  form.phone.trim(),
        p_customer_company: form.company.trim() || '',
        p_order_type:      form.inquiryType,
        p_notes:           form.notes.trim() || '',
        p_estimated_total: totalPrice,
        p_items: cart.map(item => ({
          product_name: item.name,
          qty:          item.qty,
          unit:         item.unit ?? 'pcs',
          unit_price:   item.unitPrice,
        })),
      })

      if (rpcErr) throw rpcErr

      // Done — clear cart and show success
      setStatus('success')
      if (onSuccess) onSuccess()
    } catch (err) {
      console.error('Order submission failed:', err)
      setSubmitError(err.message ?? 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-ink-800 border border-white/[0.07] rounded-sm px-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)' }}>
          <CheckCircle size={32} style={{ color: 'var(--wp-green)' }} />
        </div>
        <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Lora', serif" }}>Inquiry Sent!</h3>
        <p className="text-ivory-300/55 text-sm max-w-sm leading-relaxed mb-2">
          Thanks, <span className="text-white font-semibold">{form.name}</span>! We've received your order inquiry.
        </p>
        <p className="text-ivory-300/40 text-xs max-w-xs leading-relaxed mb-8">
          Expect a reply at <span className="text-ivory-300/70">{form.email}</span> within 1 business day with your final quote and next steps.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/products" className="btn-press text-sm">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate
      className="bg-ink-800 border border-white/[0.07] rounded-sm p-6 sm:p-8 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-6 bg-wp-green" />
          <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Your Contact Details</span>
        </div>
        <p className="text-ivory-300/40 text-xs mt-2 leading-relaxed">
          Tell us how to reach you. We'll confirm your order and send a final quote shortly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" required error={errors.name}>
          <div className="relative">
            <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
            <input type="text" placeholder="Juan dela Cruz" value={form.name} onChange={set('name')}
              className={inputClass + ' pl-9'} style={errors.name ? { borderColor: 'var(--wp-magenta)' } : {}} />
          </div>
        </Field>
        <Field label="Company / Organization">
          <div className="relative">
            <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
            <input type="text" placeholder="Your Company Inc." value={form.company} onChange={set('company')}
              className={inputClass + ' pl-9'} />
          </div>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email Address" required error={errors.email}>
          <div className="relative">
            <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
            <input type="email" placeholder="juan@company.com" value={form.email} onChange={set('email')}
              className={inputClass + ' pl-9'} style={errors.email ? { borderColor: 'var(--wp-magenta)' } : {}} />
          </div>
        </Field>
        <Field label="Phone / Viber / WhatsApp" required error={errors.phone}>
          <div className="relative">
            <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
            <input type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={set('phone')}
              className={inputClass + ' pl-9'} style={errors.phone ? { borderColor: 'var(--wp-magenta)' } : {}} />
          </div>
        </Field>
      </div>

      <Field label="Order Type" required error={errors.inquiryType}>
        <select value={form.inquiryType} onChange={set('inquiryType')}
          className={inputClass + ' cursor-pointer'} style={errors.inquiryType ? { borderColor: 'var(--wp-magenta)' } : {}}>
          <option value="" disabled>Select order type…</option>
          {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      <Field label="Additional Notes (optional)">
        <textarea rows={4} placeholder="Deadline, special instructions, preferred delivery method, etc."
          value={form.notes} onChange={set('notes')} className={inputClass + ' resize-none'} />
      </Field>

      <Field label="Attach Artwork / Reference File (optional)">
        <label className={`${inputClass} flex items-center gap-3 cursor-pointer`}
          style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}>
          <span className="text-ivory-300/30 shrink-0 text-xs font-body truncate max-w-[180px]">
            {form.file ? form.file.name : 'No file chosen'}
          </span>
          <span className="ml-auto shrink-0 btn-press-outline" style={{ fontSize: '10px', padding: '4px 10px' }}>Browse</span>
          <input type="file" className="hidden" accept=".pdf,.ai,.eps,.jpg,.jpeg,.png,.tiff,.zip"
            onChange={e => setForm(f => ({ ...f, file: e.target.files[0] || null }))} />
        </label>
        <p className="text-[10px] text-ivory-300/25 font-body mt-1.5">Accepted: PDF, AI, EPS, JPG, PNG, TIFF, ZIP · Max 20MB</p>
      </Field>

      {/* Cart snapshot */}
      <div className="bg-ink-900 border border-white/[0.07] rounded-sm p-4">
        <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-3">Items in this inquiry</div>
        <div className="space-y-2">
          {cart.map(item => (
            <div key={item.key} className="flex items-center justify-between text-xs">
              <span className="text-ivory-300/55 truncate max-w-[200px]">{item.name}</span>
              <span className="text-ivory-300/40 font-body shrink-0 ml-4">{item.qty} {item.unit} — {formatPHP(item.unitPrice * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between items-center">
          <span className="text-ivory-300/40 text-xs font-body">Estimated Total</span>
          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Lora', serif" }}>{formatPHP(totalPrice)}</span>
        </div>
        <p className="text-[10px] font-body text-ivory-300/20 mt-1">Final price confirmed after review.</p>
      </div>

      <div className="flex items-center justify-between pt-1 flex-col gap-3">
        {submitError && (
          <div className="w-full flex items-start gap-2 px-4 py-3 rounded-sm border text-xs"
            style={{ background: 'rgba(236,0,140,0.08)', borderColor: 'rgba(236,0,140,0.25)', color: '#CD1B6E' }}>
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}
        <div className="flex items-center justify-between w-full">
          <p className="text-[10px] font-body text-ivory-300/25"><span style={{ color: 'var(--wp-green)' }}>*</span> Required fields</p>
          <button type="submit" disabled={status === 'submitting'}
            className="btn-press flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {status === 'submitting' ? (
              <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
            ) : (
              <> Send Order Inquiry <Send size={14} /> </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default function CartPage() {
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const isEmpty = cart.length === 0

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

      <section className="py-16 bg-ink-900 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          {isEmpty ? <EmptyCart /> : (
            <div className="space-y-14">

              {/* Cart items + summary */}
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30">
                      {totalItems} Item{totalItems !== 1 ? 's' : ''}
                    </span>
                    {!showClearConfirm ? (
                      <button onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] font-body text-ivory-300/25 hover:text-wp-magenta transition-colors flex items-center gap-1">
                        <X size={10} /> Clear cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 text-[10px] font-body">
                        <span className="text-ivory-300/40">Remove all items?</span>
                        <button onClick={() => { clearCart(); setShowClearConfirm(false) }} className="text-wp-magenta hover:underline">Yes, clear</button>
                        <button onClick={() => setShowClearConfirm(false)} className="text-ivory-300/40 hover:text-white">Cancel</button>
                      </div>
                    )}
                  </div>

                  {cart.map(item => <CartItem key={item.key} item={item} />)}

                  <div className="mt-6 bg-ink-800 border border-white/[0.07] rounded-sm p-5 flex gap-4 items-start">
                    <FileText size={18} style={{ color: 'var(--wp-green)', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div className="font-body text-[10px] tracking-widest uppercase text-wp-green mb-1">Don't forget your artwork</div>
                      <p className="text-ivory-300/45 text-xs leading-relaxed">
                        After placing your inquiry, our team will request your print-ready files.
                        Make sure they are PDF/AI/EPS at 300dpi with 3mm bleed and CMYK color mode.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link to="/products" className="btn-press-ghost inline-flex items-center gap-2 text-sm">
                      <ArrowLeft size={14} /> Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Order summary sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(19,161,80,0.06)' }}>
                      <div className="flex items-center gap-2">
                        <Tag size={13} style={{ color: 'var(--wp-green)' }} />
                        <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">Order Summary</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      {cart.map(item => (
                        <div key={item.key} className="flex items-start justify-between gap-3 text-xs">
                          <div className="text-ivory-300/50 leading-snug flex-1 min-w-0">
                            <span className="truncate block">{item.name}</span>
                            <span className="text-ivory-300/25 font-body">{item.qty} {item.unit} × {formatPHP(item.unitPrice)}</span>
                          </div>
                          <span className="text-ivory-300/70 font-body shrink-0">{formatPHP(item.unitPrice * item.qty)}</span>
                        </div>
                      ))}
                      <div className="border-t border-white/[0.08] pt-3 mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-ivory-300/40 text-xs font-body">Subtotal</span>
                          <span className="text-ivory-300/70 text-xs font-body">{formatPHP(totalPrice)}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-ivory-300/40 text-xs font-body">Taxes & Fees</span>
                          <span className="text-ivory-300/30 text-xs font-body">Confirmed on inquiry</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-3 border-t border-white/[0.08]">
                          <span className="text-white font-semibold text-sm">Estimated Total</span>
                          <span className="text-white font-black text-xl" style={{ fontFamily: "'Lora', serif" }}>{formatPHP(totalPrice)}</span>
                        </div>
                        <p className="text-ivory-300/20 text-[9px] font-body mt-1.5 leading-relaxed">Estimate only. Final price confirmed after inquiry review.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-4 space-y-2.5">
                    {[
                      { text: 'Color accuracy guaranteed',   color: 'var(--wp-green)' },
                      { text: 'Reprint if we make an error', color: 'var(--wp-green)' },
                      { text: 'Backed by Bereso Group',      color: 'var(--wp-cyan)'  },
                    ].map(({ text, color }) => (
                      <div key={text} className="flex items-center gap-2.5 text-xs text-ivory-300/45">
                        <CheckCircle size={12} style={{ color, flexShrink: 0 }} /> {text}
                      </div>
                    ))}
                  </div>

                  {/* Contact info quick links */}
                  <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-4 space-y-3">
                    <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-1">Need help? Contact us</div>
                    <a href="tel:+6328XXXXXXXX" className="flex items-center gap-3 text-xs text-ivory-300/55 hover:text-wp-green transition-colors">
                      <Phone size={13} style={{ color: 'var(--wp-green)' }} /> +63 (2) 8XXX-XXXX
                    </a>
                    <a href="mailto:hello@wellprint.com.ph" className="flex items-center gap-3 text-xs text-ivory-300/55 hover:text-wp-cyan transition-colors">
                      <Mail size={13} style={{ color: 'var(--wp-cyan)' }} /> hello@wellprint.com.ph
                    </a>
                    <p className="text-[10px] font-body text-ivory-300/25">Mon–Fri 8AM–6PM · Sat 9AM–1PM</p>
                  </div>

                  <a href="#checkout-form" className="btn-press w-full flex items-center justify-center gap-2 text-sm py-4">
                    Fill Out Order Form <ArrowRight size={15} />
                  </a>
                </div>
              </div>

              {/* Order Process Steps */}
              <div className="border-t border-white/[0.06] pt-14">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-8 bg-wp-green" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">How It Works</span>
                </div>
                <h2 className="text-white text-2xl font-bold mb-10" style={{ fontFamily: "'Lora', serif" }}>
                  Your Order <span style={{ color: 'var(--wp-green)' }}>Process</span>
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {ORDER_STEPS.map((step, i) => (
                    <div key={step.title} className="relative">
                      {i < ORDER_STEPS.length - 1 && (
                        <div className="hidden lg:block absolute top-5 left-[calc(100%_-_8px)] w-full h-px z-0"
                          style={{ background: 'linear-gradient(90deg, rgba(19,161,80,0.3), transparent)' }} />
                      )}
                      <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 h-full relative z-10">
                        <div className="font-body text-[9px] tracking-widest mb-3" style={{ color: step.color, opacity: 0.5 }}>
                          STEP {String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="w-9 h-9 rounded-sm flex items-center justify-center mb-4"
                          style={{ background: `${step.color}14`, border: `1px solid ${step.color}30` }}>
                          <step.icon size={17} style={{ color: step.color }} />
                        </div>
                        <div className="font-semibold text-white text-sm mb-2 leading-snug" style={{ fontFamily: "'Lora', serif" }}>
                          {step.title}
                        </div>
                        <p className="text-ivory-300/40 text-xs leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Form */}
              <div id="checkout-form" className="border-t border-white/[0.06] pt-14">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-8 bg-wp-green" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Place Your Order</span>
                </div>
                <h2 className="text-white text-2xl font-bold mb-8" style={{ fontFamily: "'Lora', serif" }}>
                  Send Your <span style={{ color: 'var(--wp-green)' }}>Inquiry</span>
                </h2>
                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    <CheckoutForm cart={cart} totalPrice={totalPrice} onSuccess={handleOrderSuccess} />
                  </div>

                  {/* What happens next + contact */}
                  <div className="space-y-5">
                    <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
                      <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-4">What happens next?</div>
                      <div className="space-y-4">
                        {[
                          { n: '01', text: 'We receive your inquiry and cart details.' },
                          { n: '02', text: 'Our team reviews and sends you a final quote within 1 business day.' },
                          { n: '03', text: 'You approve the quote and send your print-ready artwork.' },
                          { n: '04', text: 'We confirm payment, start printing, and keep you updated.' },
                          { n: '05', text: 'Your order is ready for pickup or delivery.' },
                        ].map(({ n, text }) => (
                          <div key={n} className="flex gap-3 items-start">
                            <span className="font-body text-[10px] shrink-0 mt-0.5" style={{ color: 'var(--wp-green)', opacity: 0.6 }}>{n}</span>
                            <p className="text-ivory-300/50 text-xs leading-relaxed">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 space-y-4">
                      <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30">Reach us directly</div>
                      <a href="tel:+6328XXXXXXXX" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(19,161,80,0.1)', border: '1px solid rgba(19,161,80,0.25)' }}>
                          <Phone size={15} style={{ color: 'var(--wp-green)' }} />
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold group-hover:text-wp-green transition-colors">+63 (2) 8XXX-XXXX</div>
                          <div className="text-ivory-300/35 text-[10px] font-body">Mon–Fri 8AM–6PM</div>
                        </div>
                      </a>
                      <a href="mailto:hello@wellprint.com.ph" className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(0,200,220,0.08)', border: '1px solid rgba(0,200,220,0.2)' }}>
                          <Mail size={15} style={{ color: 'var(--wp-cyan)' }} />
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold group-hover:text-wp-cyan transition-colors">hello@wellprint.com.ph</div>
                          <div className="text-ivory-300/35 text-[10px] font-body">Reply within 1 business day</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </>
  )
}