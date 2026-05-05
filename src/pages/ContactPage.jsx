import usePageTitle from '../hooks/usePageTitle'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import { CONCERN_TYPES } from '../utils/constants'
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
} from 'lucide-react'


export default function ContactPage() {
  usePageTitle('Contact')
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // ── Color tokens ──────────────────────────────────────────────
  const pageBg        = isDark ? '#0c1829'                       : '#f0f6ff'
  const cardBg        = isDark ? '#112240'                       : '#ffffff'
  const cardBorder    = isDark ? 'rgba(255,255,255,0.08)'        : 'rgba(13,31,60,0.07)'
  const cardShadow    = isDark ? '0 20px 50px rgba(0,0,0,0.32)' : '0 4px 20px rgba(13,31,60,0.07)'
  const heading       = isDark ? '#f0f4ff'                        : '#0d1f3c'
  const headingMd     = isDark ? '#f0f4ff'                        : '#1e3a5f'
  const subText       = isDark ? 'rgba(168,190,217,0.65)'        : '#5a7a9a'
  const labelColor    = isDark ? 'rgba(168,190,217,0.55)'        : '#5a7a9a'
  const mutedText     = isDark ? 'rgba(168,190,217,0.45)'        : '#8aabcc'
  const tinyText      = isDark ? 'rgba(168,190,217,0.35)'        : '#a8c4d8'
  const inputBg       = isDark ? '#1a2f52'                        : '#f7f9ff'
  const inputBorder   = isDark ? 'rgba(255,255,255,0.10)'        : 'rgba(13,31,60,0.10)'
  const inputColor    = isDark ? '#f0f4ff'                        : '#0d1f3c'
  const errorBorder   = isDark ? 'rgba(205,27,110,0.45)'         : 'rgba(205,27,110,0.35)'
  const errorText     = isDark ? '#f9a8d4'                        : '#9f1239'
  const successText   = isDark ? '#86efac'                        : '#13A150'
  const successBg     = isDark ? 'rgba(19,161,80,0.10)'          : 'rgba(19,161,80,0.08)'
  const successBorder = isDark ? 'rgba(19,161,80,0.22)'          : 'rgba(19,161,80,0.28)'

  const inputClass = `w-full rounded-[18px] border px-4 py-3 text-sm outline-none transition-all duration-200`

  // ── Form state ────────────────────────────────────────────────
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    concern_type: '',
    order_id: '',
    message: '',
  })
  const [lastSubmit, setLastSubmit] = useState(0)
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  function validate() {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.concern_type.trim()) errs.concern_type = 'Please select a concern type.'
    if (!form.message.trim()) errs.message = 'Message is required.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Honeypot: bots fill hidden fields, humans don't
    if (honeypot) return

    // Cooldown: prevent rapid re-submissions (30 seconds)
    const now = Date.now()
    if (now - lastSubmit < 30_000) {
      setError('Please wait a moment before submitting again.')
      return
    }

    const errs = validate()
    setFieldErrors(errs)
    setError('')
    setSuccess(false)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    const payload = {
      full_name:    form.full_name.trim(),
      email:        form.email.trim().toLowerCase(),
      phone:        form.phone.trim() || null,
      concern_type: form.concern_type,
      order_id:     form.order_id.trim().toUpperCase() || null,
      message:      form.message.trim(),
    }
    const { error: insertError } = await supabase.from('contact_messages').insert([payload])
    if (insertError) {
      setError(insertError.message || 'Failed to send your message. Please try again.')
      setLoading(false)
      return
    }
    setSuccess(true)
    setLastSubmit(Date.now())
    setLoading(false)
    setForm({ full_name: '', email: '', phone: '', concern_type: '', order_id: '', message: '' })
    setFieldErrors({})
  }

  return (
    <section className="min-h-screen pt-10 pb-16 sm:pt-12 sm:pb-20" style={{ background: pageBg }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">
              Contact WELLPrint
            </span>
            <div className="h-px w-8 bg-wp-green" />
          </div>

          <h1
            className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none mb-3"
            style={{ fontFamily: "'Lora', serif", color: heading }}
          >
            Concerns, Requests,{' '}
            <span style={{ color: 'var(--wp-green)' }}>Follow-ups & Inquiries</span>
          </h1>

          <p className="text-sm max-w-2xl mx-auto leading-relaxed" style={{ color: subText }}>
            For inquiries, concerns, follow-ups, or requests related to your order, please send us
            a message below. If your message is about an existing order, include your{' '}
            <span style={{ color: heading, fontWeight: 600 }}>Order ID</span> so we can trace it faster.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Contact details card */}
            <div
              className="rounded-[28px] border p-6"
              style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(25,147,210,0.12)', border: '1px solid rgba(25,147,210,0.20)' }}
                >
                  <MessageSquare size={18} style={{ color: 'var(--wp-cyan)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: heading }}>Contact Details</h2>
                  <p className="text-xs" style={{ color: mutedText }}>We're here to assist you</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="font-medium" style={{ color: headingMd }}>Address</p>
                    <p style={{ color: subText }}>Ormoc City, Philippines 6541</p>
                  </div>
                </div>  
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="font-medium" style={{ color: headingMd }}>Phone</p>
                    <p style={{ color: subText }}>0920 578 5304</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="font-medium" style={{ color: headingMd }}>Email</p>
                    <p style={{ color: subText }}>wellprint.6972@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Helpful tip card */}
            <div
              className="rounded-[28px] border p-6"
              style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.20)' }}
                >
                  <FileText size={18} style={{ color: 'var(--wp-green)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: heading }}>Helpful Tip</h2>
                  <p className="text-xs" style={{ color: mutedText }}>For faster assistance</p>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: subText }}>
                If your concern or inquiry is about an existing order, include the{' '}
                <span style={{ color: heading, fontWeight: 600 }}>Order ID</span>, your name, and a clear message such as:
              </p>

              <ul className="mt-4 space-y-2 text-sm" style={{ color: subText }}>
                <li>• Request to cancel order</li>
                <li>• Request to change layout or design</li>
                <li>• Request to change pickup or delivery</li>
                <li>• Follow-up on order status</li>
                <li>• General inquiry about services or pricing</li>
              </ul>
            </div>
          </div>

          {/* ── Right column — form ── */}
          <div className="lg:col-span-8">
            <div
              className="rounded-[28px] border p-6 sm:p-8"
              style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow }}
            >
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: "'Poppins', san serif", color: heading }}
                >
                  Send Us a Message
                </h2>
                <p className="text-sm" style={{ color: mutedText }}>
                  Fill out the form below for concerns, requests, follow-ups, or inquiries.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Row 1: name + email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ color: labelColor }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={setField('full_name')}
                      placeholder="Enter your full name"
                      className={inputClass}
                      style={{
                        background: inputBg,
                        borderColor: fieldErrors.full_name ? errorBorder : inputBorder,
                        color: inputColor,
                      }}
                    />
                    {fieldErrors.full_name && (
                      <p className="text-xs mt-2" style={{ color: errorText }}>{fieldErrors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ color: labelColor }}
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="Enter your email"
                      className={inputClass}
                      style={{
                        background: inputBg,
                        borderColor: fieldErrors.email ? errorBorder : inputBorder,
                        color: inputColor,
                      }}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs mt-2" style={{ color: errorText }}>{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: phone + concern */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ color: labelColor }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={setField('phone')}
                      placeholder="Enter your phone number"
                      className={inputClass}
                      style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                      style={{ color: labelColor }}
                    >
                      Concern / Inquiry Type *
                    </label>
                    <select
                      value={form.concern_type}
                      onChange={setField('concern_type')}
                      className={inputClass}
                      style={{
                        background: inputBg,
                        borderColor: fieldErrors.concern_type ? errorBorder : inputBorder,
                        color: form.concern_type ? inputColor : mutedText,
                      }}
                    >
                      <option value="" style={{ background: isDark ? '#081225' : '#ffffff', color: inputColor }}>
                        Select concern type
                      </option>
                      {CONCERN_TYPES.map((option) => (
                        <option
                          key={option}
                          value={option}
                          style={{ background: isDark ? '#081225' : '#ffffff', color: inputColor }}
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.concern_type && (
                      <p className="text-xs mt-2" style={{ color: errorText }}>{fieldErrors.concern_type}</p>
                    )}
                  </div>
                </div>

                {/* Order ID */}
                <div>
                  <label
                    className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                    style={{ color: labelColor }}
                  >
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={form.order_id}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, order_id: e.target.value.toUpperCase() }))
                    }
                    placeholder="Example: ORD-12345678"
                    className={inputClass}
                    style={{ background: inputBg, borderColor: inputBorder, color: inputColor }}
                  />
                  <p className="text-xs mt-2" style={{ color: tinyText }}>
                    Include the Order ID if your message is about an existing order so we can assist you faster.
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label
                    className="block text-[10px] tracking-[0.18em] uppercase mb-2"
                    style={{ color: labelColor }}
                  >
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={setField('message')}
                    placeholder="Type your concern, request, follow-up, or inquiry here."
                    className={inputClass}
                    style={{
                      background: inputBg,
                      borderColor: fieldErrors.message ? errorBorder : inputBorder,
                      color: inputColor,
                      resize: 'none',
                    }}
                  />
                  {fieldErrors.message && (
                    <p className="text-xs mt-2" style={{ color: errorText }}>{fieldErrors.message}</p>
                  )}
                </div>

                {/* Error banner */}
                {error && (
                  <div
                    className="rounded-[18px] px-4 py-3 text-sm flex items-start gap-2"
                    style={{
                      background: 'rgba(205,27,110,0.10)',
                      border: '1px solid rgba(205,27,110,0.20)',
                      color: errorText,
                    }}
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Success banner */}
                {success && (
                  <div
                    className="rounded-[18px] px-4 py-3 text-sm flex items-start gap-2"
                    style={{ background: successBg, border: `1px solid ${successBorder}`, color: successText }}
                  >
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span>
                      Your message has been sent successfully. Our team will review your concern or inquiry.
                    </span>
                  </div>
                )}

                {/* Honeypot — hidden from real users, bots fill this */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  disabled={loading}
                  className="btn-press w-full flex items-center justify-center gap-2 text-sm py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}