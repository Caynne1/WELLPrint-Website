import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import {
  Phone, Mail, MapPin, Clock, Send, Facebook,
  Instagram, Linkedin, ArrowRight, CheckCircle, AlertCircle
} from 'lucide-react'

/* ── Scroll-reveal hook ── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Contact info card ── */
function InfoCard({ icon: Icon, label, value, sub, href, accent, delay }) {
  const ref = useScrollReveal()
  const content = (
    <div ref={ref} className="animate-on-scroll card-press p-6 flex gap-4 items-start group"
      style={{ transitionDelay: `${delay}ms` }}>
      <div className="shrink-0 w-11 h-11 rounded-sm flex items-center justify-center mt-0.5"
        style={{ background: `${accent}14`, border: `1px solid ${accent}30` }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <div className="font-body text-[10px] tracking-widest uppercase mb-1" style={{ color: accent, opacity: 0.7 }}>{label}</div>
        <div className="text-white font-semibold text-sm leading-snug">{value}</div>
        {sub && <div className="text-ivory-300/40 text-xs mt-0.5">{sub}</div>}
      </div>
    </div>
  )
  return href
    ? <a href={href} className="block hover:no-underline">{content}</a>
    : content
}

/* ── Social button ── */
function SocialBtn({ icon: Icon, label, href, color }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3 rounded-sm border border-white/[0.08] bg-ink-800
        hover:border-white/20 transition-all duration-200 group">
      <Icon size={18} style={{ color }} />
      <span className="text-ivory-300/60 text-sm group-hover:text-white transition-colors">{label}</span>
    </a>
  )
}

/* ── Input component ── */
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-body text-[10px] tracking-widest uppercase mb-2"
        style={{ color: error ? 'var(--wp-magenta)' : 'rgba(216,216,216,0.5)' }}>
        {label}{required && <span className="ml-1" style={{ color: 'var(--wp-green)' }}>*</span>}
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

const inputClass = `w-full bg-ink-800 border border-white/[0.10] rounded-sm px-4 py-3 text-sm text-ivory-200
  placeholder-ivory-300/25 outline-none transition-all duration-200
  focus:border-wp-green/60 focus:bg-ink-700 focus:ring-1 focus:ring-wp-green/20`

const INQUIRY_TYPES = [
  'Request a Quote',
  'Follow Up on an Order',
  'General Inquiry',
  'Partnership / B2B',
  'Other',
]

/* ═══════════════════════════════════════════════════════ */
export default function ContactPage() {
  const formRef   = useScrollReveal()
  const infoRef   = useScrollReveal()
  const mapRef    = useScrollReveal()

  /* ── Form state ── */
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '',
    inquiryType: '', subject: '', message: '', file: null,
  })
  const [errors, setErrors]   = useState({})
  const [status, setStatus]   = useState('idle') // idle | submitting | success | error

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.name.trim())        e.name = 'Name is required'
    if (!form.email.trim())       e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.inquiryType)        e.inquiryType = 'Please select an inquiry type'
    if (!form.message.trim())     e.message = 'Message is required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setErrors({})
    setStatus('submitting')
    // Simulate async submission
    setTimeout(() => setStatus('success'), 1800)
  }

  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        label="Get in Touch"
        title="We'd Love to"
        titleAccent="Hear From You"
        subtitle="Whether you need a quote, want to follow up on an order, or just have a question — our team is ready to help."
      />

      {/* ── Main grid ── */}
      <section className="py-20 bg-ink-900">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">

          {/* ── LEFT: contact info ── */}
          <aside className="lg:col-span-2 space-y-4">
            <div ref={infoRef} className="animate-on-scroll mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-wp-green" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Contact Details</span>
              </div>
              <p className="text-ivory-300/50 text-sm leading-relaxed">
                Reach us through any of the channels below. We typically respond within one business day.
              </p>
            </div>

            <InfoCard icon={Phone} label="Phone" value="+63 (2) 8XXX-XXXX"
              sub="Mon–Fri, 8:00 AM – 6:00 PM" href="tel:+6328XXXXXXXX"
              accent="var(--wp-green)" delay={0} />
            <InfoCard icon={Mail} label="Email" value="hello@wellprint.com.ph"
              sub="We reply within 1 business day" href="mailto:hello@wellprint.com.ph"
              accent="var(--wp-cyan)" delay={80} />
            <InfoCard icon={MapPin} label="Office Address"
              value="[Building Name], [Street], [City], Philippines"
              sub="By appointment only" accent="var(--wp-yellow)" delay={160} />
            <InfoCard icon={Clock} label="Business Hours"
              value="Monday – Friday: 8:00 AM – 6:00 PM"
              sub="Saturday: 9:00 AM – 1:00 PM · Closed Sunday"
              accent="var(--wp-magenta)" delay={240} />

            {/* Social */}
            <div className="pt-4">
              <div className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30 mb-3">Follow Us</div>
              <div className="space-y-2">
                <SocialBtn icon={Facebook}  label="WELLPrint on Facebook"  href="#" color="#1877F2" />
                <SocialBtn icon={Instagram} label="@wellprint.ph"          href="#" color="#E1306C" />
                <SocialBtn icon={Linkedin}  label="WELLPrint Philippines"  href="#" color="#0A66C2" />
              </div>
            </div>
          </aside>

          {/* ── RIGHT: form ── */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              /* Success state */
              <div ref={formRef} className="animate-on-scroll h-full flex flex-col items-center justify-center
                text-center py-20 bg-ink-800 border border-white/[0.07] rounded-sm px-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.3)' }}>
                  <CheckCircle size={32} style={{ color: 'var(--wp-green)' }} />
                </div>
                <h3 className="text-white text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif" }}>
                  Message Sent!
                </h3>
                <p className="text-ivory-300/55 text-sm max-w-sm leading-relaxed mb-8">
                  Thanks for reaching out. Our team will get back to you within one business day.
                </p>
                <button onClick={() => { setStatus('idle'); setForm({ name:'',company:'',email:'',phone:'',inquiryType:'',subject:'',message:'',file:null }) }}
                  className="btn-press-outline text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Form */
              <form ref={formRef} onSubmit={handleSubmit} noValidate
                className="animate-on-scroll bg-ink-800 border border-white/[0.07] rounded-sm p-8 space-y-6">

                <div className="flex items-center gap-3 mb-2">
                  <div className="h-px w-6 bg-wp-green" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Send Us a Message</span>
                </div>

                {/* Row 1: Name + Company */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required error={errors.name}>
                    <input type="text" placeholder="Juan dela Cruz" value={form.name}
                      onChange={set('name')} className={inputClass}
                      style={errors.name ? { borderColor: 'var(--wp-magenta)' } : {}} />
                  </Field>
                  <Field label="Company / Organization">
                    <input type="text" placeholder="Your Company Inc." value={form.company}
                      onChange={set('company')} className={inputClass} />
                  </Field>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email Address" required error={errors.email}>
                    <input type="email" placeholder="juan@company.com" value={form.email}
                      onChange={set('email')} className={inputClass}
                      style={errors.email ? { borderColor: 'var(--wp-magenta)' } : {}} />
                  </Field>
                  <Field label="Phone Number">
                    <input type="tel" placeholder="+63 9XX XXX XXXX" value={form.phone}
                      onChange={set('phone')} className={inputClass} />
                  </Field>
                </div>

                {/* Inquiry type */}
                <Field label="Inquiry Type" required error={errors.inquiryType}>
                  <select value={form.inquiryType} onChange={set('inquiryType')}
                    className={inputClass + ' cursor-pointer'}
                    style={errors.inquiryType ? { borderColor: 'var(--wp-magenta)' } : {}}>
                    <option value="" disabled>Select inquiry type…</option>
                    {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>

                {/* Subject */}
                <Field label="Subject">
                  <input type="text" placeholder="e.g. Quote for 500 flyers" value={form.subject}
                    onChange={set('subject')} className={inputClass} />
                </Field>

                {/* Message */}
                <Field label="Message" required error={errors.message}>
                  <textarea rows={5} placeholder="Tell us about your project — quantity, size, material, deadline…"
                    value={form.message} onChange={set('message')} className={inputClass + ' resize-none'}
                    style={errors.message ? { borderColor: 'var(--wp-magenta)' } : {}} />
                </Field>

                {/* File upload */}
                <Field label="Attach a File (optional)">
                  <label className={`${inputClass} flex items-center gap-3 cursor-pointer`}
                    style={{ paddingTop: '0.65rem', paddingBottom: '0.65rem' }}>
                    <span className="text-ivory-300/30 shrink-0 text-xs font-body">
                      {form.file ? form.file.name : 'No file chosen'}
                    </span>
                    <span className="ml-auto shrink-0 btn-press-outline text-[10px] py-1 px-3"
                      style={{ fontSize: '10px', padding: '4px 10px' }}>
                      Browse
                    </span>
                    <input type="file" className="hidden"
                      accept=".pdf,.ai,.eps,.jpg,.jpeg,.png,.tiff,.zip"
                      onChange={e => setForm(f => ({ ...f, file: e.target.files[0] || null }))} />
                  </label>
                  <p className="text-[10px] text-ivory-300/25 font-body mt-1.5">
                    Accepted: PDF, AI, EPS, JPG, PNG, TIFF, ZIP · Max 20MB
                  </p>
                </Field>

                {/* Submit */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[10px] font-body text-ivory-300/25 tracking-wider">
                    <span style={{ color: 'var(--wp-green)' }}>*</span> Required fields
                  </p>
                  <button type="submit" disabled={status === 'submitting'}
                    className="btn-press flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === 'submitting' ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <> Send Message <Send size={14} /> </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Map placeholder ── */}
      <section className="bg-ink-950 border-t border-white/[0.06]">
        <div ref={mapRef} className="animate-on-scroll max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Find Us</span>
          </div>

          {/* Map embed placeholder */}
          <div className="w-full rounded-sm overflow-hidden border border-white/[0.08] bg-ink-800 relative"
            style={{ height: '360px' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ivory-300/20">
              <MapPin size={40} />
              <span className="font-body text-xs tracking-widest uppercase">Google Maps Embed</span>
              <span className="text-xs text-ivory-300/15">Replace with your &lt;iframe&gt; embed code</span>
            </div>
            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-wp-green/30" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-wp-green/30" />
          </div>
        </div>
      </section>

      {/* ── FAQ nudge ── */}
      <section className="py-16 bg-ink-900 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-ivory-300/40 text-sm mb-4">
            Looking for quick answers? Check our FAQ first.
          </p>
          <Link to="/faq" className="btn-press-ghost inline-flex items-center gap-2 text-sm">
            View Frequently Asked Questions <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}