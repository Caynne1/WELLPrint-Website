import { useState } from 'react'
import { supabase } from '../lib/supabase'
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

const concernOptions = [
  'General Inquiry',
  'Order Follow-up',
  'Cancel Order Request',
  'Change Layout Request',
  'Change Delivery / Pickup Request',
  'Billing Concern',
  'Other',
]

const inputClass =
  'w-full rounded-[18px] border px-4 py-3 text-sm outline-none transition-all duration-200'

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    concern_type: '',
    order_id: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
  }

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

    const errs = validate()
    setFieldErrors(errs)
    setError('')
    setSuccess(false)

    if (Object.keys(errs).length > 0) return

    setLoading(true)

    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      concern_type: form.concern_type,
      order_id: form.order_id.trim().toUpperCase() || null,
      message: form.message.trim(),
    }

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([payload])

    if (insertError) {
      console.error('Contact form error:', insertError)
      setError(insertError.message || 'Failed to send your message. Please try again.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setForm({
      full_name: '',
      email: '',
      phone: '',
      concern_type: '',
      order_id: '',
      message: '',
    })
    setFieldErrors({})
  }

  return (
    <section className="min-h-screen bg-ink-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">
              Contact WELLPrint
            </span>
            <div className="h-px w-8 bg-wp-green" />
          </div>

          <h1
            className="text-white text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none mb-3"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Concerns, Requests, <span style={{ color: 'var(--wp-green)' }}>Follow-ups & Inquiries</span>
          </h1>

          <p className="text-ivory-300/45 text-sm max-w-2xl mx-auto leading-relaxed">
            For inquiries, concerns, follow-ups, or requests related to your order, please send us a message below.
            If your message is about an existing order, include your{' '}
            <span className="text-white font-medium">Order ID</span> so we can trace it faster.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div
              className="rounded-[28px] border p-6"
              style={{
                background: '#0b1730',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(25,147,210,0.12)',
                    border: '1px solid rgba(25,147,210,0.20)',
                  }}
                >
                  <MessageSquare size={18} style={{ color: 'var(--wp-cyan)' }} />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Contact Details</h2>
                  <p className="text-ivory-300/35 text-xs">We’re here to assist you</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-ivory-300/45">Ormoc City, Philippines</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-ivory-300/45">+63 9XX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-wp-green mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-ivory-300/45">wellprintormoc@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="rounded-[28px] border p-6"
              style={{
                background: '#0b1730',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(22,163,74,0.12)',
                    border: '1px solid rgba(22,163,74,0.20)',
                  }}
                >
                  <FileText size={18} style={{ color: 'var(--wp-green)' }} />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Helpful Tip</h2>
                  <p className="text-ivory-300/35 text-xs">For faster assistance</p>
                </div>
              </div>

              <p className="text-ivory-300/45 text-sm leading-relaxed">
                If your concern or inquiry is about an existing order, include the{' '}
                <span className="text-white font-medium">Order ID</span>, your name, and a clear message such as:
              </p>

              <ul className="mt-4 space-y-2 text-sm text-ivory-300/45">
                <li>• Request to cancel order</li>
                <li>• Request to change layout or design</li>
                <li>• Request to change pickup or delivery</li>
                <li>• Follow-up on order status</li>
                <li>• General inquiry about services or pricing</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div
              className="rounded-[28px] border p-6 sm:p-8"
              style={{
                background: '#0b1730',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
              }}
            >
              <div className="mb-6">
                <h2
                  className="text-white text-2xl font-bold mb-2"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Send Us a Message
                </h2>
                <p className="text-ivory-300/40 text-sm">
                  Fill out the form below for concerns, requests, follow-ups, or inquiries.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={setField('full_name')}
                      placeholder="Enter your full name"
                      className={inputClass}
                      style={{
                        background: '#081225',
                        borderColor: fieldErrors.full_name
                          ? 'rgba(205,27,110,0.45)'
                          : 'rgba(255,255,255,0.10)',
                        color: '#fff',
                      }}
                    />
                    {fieldErrors.full_name && (
                      <p className="text-pink-300 text-xs mt-2">{fieldErrors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={setField('email')}
                      placeholder="Enter your email"
                      className={inputClass}
                      style={{
                        background: '#081225',
                        borderColor: fieldErrors.email
                          ? 'rgba(205,27,110,0.45)'
                          : 'rgba(255,255,255,0.10)',
                        color: '#fff',
                      }}
                    />
                    {fieldErrors.email && (
                      <p className="text-pink-300 text-xs mt-2">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={setField('phone')}
                      placeholder="Enter your phone number"
                      className={inputClass}
                      style={{
                        background: '#081225',
                        borderColor: 'rgba(255,255,255,0.10)',
                        color: '#fff',
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                      Concern / Inquiry Type *
                    </label>
                    <select
                      value={form.concern_type}
                      onChange={setField('concern_type')}
                      className={inputClass}
                      style={{
                        background: '#081225',
                        borderColor: fieldErrors.concern_type
                          ? 'rgba(205,27,110,0.45)'
                          : 'rgba(255,255,255,0.10)',
                        color: '#fff',
                      }}
                    >
                      <option value="">Select concern type</option>
                      {concernOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.concern_type && (
                      <p className="text-pink-300 text-xs mt-2">{fieldErrors.concern_type}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={form.order_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        order_id: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="Example: ORD-12345678"
                    className={inputClass}
                    style={{
                      background: '#081225',
                      borderColor: 'rgba(255,255,255,0.10)',
                      color: '#fff',
                    }}
                  />
                  <p className="text-ivory-300/30 text-xs mt-2">
                    Include the Order ID if your message is about an existing order so we can assist you faster.
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-ivory-300/40 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={setField('message')}
                    placeholder="Type your concern, request, follow-up, or inquiry here. Example: I would like to request cancellation of my order / I want to change the layout / I need to update delivery details / I have an inquiry about your printing services."
                    className={inputClass}
                    style={{
                      background: '#081225',
                      borderColor: fieldErrors.message
                        ? 'rgba(205,27,110,0.45)'
                        : 'rgba(255,255,255,0.10)',
                      color: '#fff',
                      resize: 'none',
                    }}
                  />
                  {fieldErrors.message && (
                    <p className="text-pink-300 text-xs mt-2">{fieldErrors.message}</p>
                  )}
                </div>

                {error && (
                  <div
                    className="rounded-[18px] px-4 py-3 text-sm flex items-start gap-2"
                    style={{
                      background: 'rgba(205,27,110,0.10)',
                      border: '1px solid rgba(205,27,110,0.20)',
                      color: '#f9a8d4',
                    }}
                  >
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    className="rounded-[18px] px-4 py-3 text-sm flex items-start gap-2"
                    style={{
                      background: 'rgba(22,163,74,0.10)',
                      border: '1px solid rgba(22,163,74,0.20)',
                      color: '#bbf7d0',
                    }}
                  >
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <span>
                      Your message has been sent successfully. Our team will review your concern or inquiry.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
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