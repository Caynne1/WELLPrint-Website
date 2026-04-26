import { useState } from 'react'
import {
  CheckCircle,
  AlertCircle,
  Send,
  User,
  Building2,
  Mail,
  Phone,
  Upload,
} from 'lucide-react'

import Modal from '../common/Modal'
import useForm from '../../hooks/useForm'
import { formatPHP } from '../../utils/formatters'
import { ORDER_TYPES, ACCEPTED_FILE_MIME, MAX_FILE_SIZE } from '../../utils/constants'
import {
  required,
  email as emailRule,
  phone as phoneRule,
  maxFileSize,
} from '../../utils/validators'
import { supabase } from '../../lib/supabase'

// ─── Styles ────────────────────────────────────────────────────
const inputClass = `w-full bg-ink-900 border border-white/[0.10] rounded-sm px-4 py-3 text-sm text-ivory-200
  placeholder-ivory-300/25 outline-none transition-all duration-200
  focus:border-wp-green/60 focus:bg-ink-800 focus:ring-1 focus:ring-wp-green/20`

// ─── File upload helper ────────────────────────────────────────
async function uploadDesignFile(file) {
  if (!file) return { url: null, fileName: null }

  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = `orders/${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('customer-designs')
    .upload(filePath, file, { cacheControl: '3600', upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('customer-designs').getPublicUrl(filePath)
  return { url: data?.publicUrl || null, fileName: file.name }
}

// ─── Field wrapper ─────────────────────────────────────────────
function Field({ label, required: req, error, children }) {
  return (
    <div>
      <label
        className="block font-body text-[10px] tracking-widest uppercase mb-2"
        style={{ color: error ? 'var(--wp-magenta)' : 'rgba(216,216,216,0.5)' }}
      >
        {label}
        {req && <span className="ml-1" style={{ color: 'var(--wp-green)' }}>*</span>}
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

// ─── Component ─────────────────────────────────────────────────
export default function CheckoutModal({ open, onClose, cart, totalPrice, onSuccess }) {
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [submitError, setSubmitError] = useState(null)
  const [placedOrderId, setPlacedOrderId] = useState(null)

  const { form, errors, setField, setFile, validateAll, resetForm } = useForm(
    { name: '', company: '', email: '', phone: '', orderType: '', notes: '', file: null },
    {
      name:      [v => required(v, 'Full name')],
      email:     [v => required(v, 'Email'), emailRule],
      phone:     [v => required(v, 'Phone'), phoneRule],
      orderType: [v => required(v, 'Order type')],
      file:      [f => maxFileSize(f, MAX_FILE_SIZE)],
    }
  )

  function handleClose() {
    if (status === 'success') {
      resetForm()
      setStatus('idle')
      setPlacedOrderId(null)
    }
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateAll()) return

    setSubmitError(null)
    setStatus('submitting')

    try {
      const itemsPayload = cart.map(item => ({
        product_name:     item.name,
        qty:              item.qty,
        unit:             item.unit ?? 'pcs',
        unit_price:       item.unitPrice,
        selections:       item.selections ?? {},
        design_option:    item.designOption ?? null,
        design_file_name: item.designFileName ?? null,
        layout_request:   !!item.layoutRequest,
        delivery_method:  item.deliveryMethod ?? 'pickup',
        delivery_fee:     item.deliveryFee ?? 0,
      }))

      // Find a design file to upload
      let uploadFile = form.file || cart.find(i => i.designFile instanceof File)?.designFile || null
      let uploadedFileUrl = null
      let uploadedFileName = null

      if (uploadFile) {
        const uploaded = await uploadDesignFile(uploadFile)
        uploadedFileUrl = uploaded.url
        uploadedFileName = uploaded.fileName
      } else {
        const withName = cart.find(i => i.designFileName)
        if (withName) uploadedFileName = withName.designFileName
      }

      const payload = {
        p_customer_name:     form.name.trim(),
        p_customer_email:    form.email.trim().toLowerCase(),
        p_customer_phone:    form.phone.trim(),
        p_customer_company:  form.company.trim() || '',
        p_order_type:        form.orderType,
        p_notes:             form.notes.trim() || '',
        p_estimated_total:   totalPrice,
        p_status:            'pending',
        p_items:             JSON.parse(JSON.stringify(itemsPayload)),
        p_design_file_url:   uploadedFileUrl,
        p_design_file_name:  uploadedFileName,
      }

      const { data, error } = await supabase.rpc('submit_order', payload)
      if (error) throw error

      setPlacedOrderId(data)
      setStatus('success')
      onSuccess?.(data)
    } catch (err) {
      console.error('Order submission failed:', err)
      setSubmitError(
        err?.message || err?.error_description || err?.details || err?.hint || 'Something went wrong.'
      )
      setStatus('idle')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Place Your Order" subtitle="Checkout" maxWidth="max-w-4xl">
      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)' }}
          >
            <CheckCircle size={32} style={{ color: 'var(--wp-green)' }} />
          </div>

          <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Lora', serif" }}>
            Order Placed!
          </h3>

          <p className="text-ivory-300/55 text-sm max-w-sm leading-relaxed mb-3">
            Thanks, <span className="text-white font-semibold">{form.name}</span>!
            Your order has been submitted successfully.
          </p>

          {placedOrderId && (
            <div className="px-4 py-3 rounded-sm border mb-6" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="text-[10px] uppercase tracking-[0.2em] text-ivory-300/30 mb-1">Order Reference</div>
              <div className="text-white font-semibold break-all">{placedOrderId}</div>
            </div>
          )}

          <p className="text-ivory-300/35 text-xs max-w-xs leading-relaxed mb-8">
            Save this reference — you can use it to track your order.
          </p>

          <button onClick={handleClose} className="btn-press text-sm">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <p className="text-ivory-300/40 text-xs leading-relaxed">
            Fill out your details below to complete your order. Your cart items are included automatically.
          </p>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full Name" required error={errors.name}>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                <input
                  type="text" placeholder="Juan dela Cruz"
                  value={form.name} onChange={setField('name')}
                  className={inputClass + ' pl-9'}
                  style={errors.name ? { borderColor: 'var(--wp-magenta)' } : {}}
                />
              </div>
            </Field>

            <Field label="Company / Organization">
              <div className="relative">
                <Building2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                <input
                  type="text" placeholder="Your Company Inc."
                  value={form.company} onChange={setField('company')}
                  className={inputClass + ' pl-9'}
                />
              </div>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Email Address" required error={errors.email}>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                <input
                  type="email" placeholder="juan@company.com"
                  value={form.email} onChange={setField('email')}
                  className={inputClass + ' pl-9'}
                  style={errors.email ? { borderColor: 'var(--wp-magenta)' } : {}}
                />
              </div>
            </Field>

            <Field label="Phone / Viber / WhatsApp" required error={errors.phone}>
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
                <input
                  type="tel" placeholder="+63 9XX XXX XXXX"
                  value={form.phone} onChange={setField('phone')}
                  className={inputClass + ' pl-9'}
                  style={errors.phone ? { borderColor: 'var(--wp-magenta)' } : {}}
                />
              </div>
            </Field>
          </div>

          <Field label="Order Type" required error={errors.orderType}>
            <select
              value={form.orderType} onChange={setField('orderType')}
              className={inputClass + ' cursor-pointer'}
              style={errors.orderType ? { borderColor: 'var(--wp-magenta)' } : {}}
            >
              <option value="" disabled>Select order type…</option>
              {ORDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Additional Notes (optional)">
            <textarea
              rows={4}
              placeholder="Deadline, special instructions, preferred delivery method, etc."
              value={form.notes} onChange={setField('notes')}
              className={inputClass + ' resize-none'}
            />
          </Field>

          <Field label="Attach Reference File (optional)" error={errors.file}>
            <label
              className={`${inputClass} flex items-center gap-3 cursor-pointer`}
              style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}
            >
              <span className="text-ivory-300/30 shrink-0 text-xs font-body truncate max-w-[180px]">
                {form.file ? form.file.name : 'No file chosen'}
              </span>
              <span className="ml-auto shrink-0 btn-press-outline" style={{ fontSize: '10px', padding: '4px 10px' }}>
                <Upload size={12} className="inline mr-1" /> Browse
              </span>
              <input type="file" className="hidden" accept={ACCEPTED_FILE_MIME} onChange={setFile('file')} />
            </label>
            <p className="text-[10px] text-ivory-300/25 font-body mt-1.5">
              Accepted: PDF, AI, EPS, JPG, PNG, TIFF, ZIP · Max 20MB
            </p>
          </Field>

          {/* Cart snapshot */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-4">
            <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-3">Cart snapshot</div>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.key} className="flex items-center justify-between text-xs gap-4">
                  <span className="text-ivory-300/55 truncate max-w-[220px]">{item.name}</span>
                  <span className="text-ivory-300/40 font-body shrink-0">
                    {item.qty} {item.unit || 'pcs'} — {formatPHP((item.unitPrice || 0) * (item.qty || 0) + (item.deliveryFee || 0))}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex justify-between items-center">
              <span className="text-ivory-300/40 text-xs font-body">Estimated Total</span>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "'Lora', serif" }}>
                {formatPHP(totalPrice)}
              </span>
            </div>
          </div>

          {/* Submit area */}
          <div className="flex flex-col gap-3 pt-1">
            {submitError && (
              <div
                className="w-full flex items-start gap-2 px-4 py-3 rounded-sm border text-xs"
                style={{ background: 'rgba(236,0,140,0.08)', borderColor: 'rgba(236,0,140,0.25)', color: '#CD1B6E' }}
              >
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex items-center justify-between w-full gap-4 flex-wrap">
              <p className="text-[10px] font-body text-ivory-300/25">
                <span style={{ color: 'var(--wp-green)' }}>*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <button type="button" onClick={handleClose} className="btn-press-ghost text-sm">Cancel</button>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-press flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>Place Order <Send size={14} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
