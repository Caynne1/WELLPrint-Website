import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:  'WellPrint is the only printer we trust with our annual reports. The colour accuracy is remarkable — Pantone matching is spot on every time.',
    author: 'Sarah K.',
    role:   'Brand Director, ArchGroup',
    init:   'SK',
  },
  {
    quote:  'Ordered 2,000 brochures on a Thursday, had them Friday afternoon. The quality exceeded what we were getting from our previous supplier at twice the price.',
    author: 'Marcus L.',
    role:   'Founder, Lumen Studio',
    init:   'ML',
  },
  {
    quote:  'The file upload system is a game changer. 450MB Photoshop files, no problem. Staff kept us updated throughout. Five stars.',
    author: 'Priya N.',
    role:   'Production Manager, Bold Creative',
    init:   'PN',
  },
]

function TestimonialCard({ quote, author, role, init, delay }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="animate-on-scroll card-press p-7 flex flex-col relative"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Quote size={28} className="text-wp-green/20 mb-5 flex-shrink-0" aria-hidden="true" />
      <p className="text-ivory-300/70 text-sm leading-relaxed flex-1 mb-6 italic">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-wp-green flex items-center justify-center flex-shrink-0">
          <span className="text-ink-950 font-bold text-xs font-mono">{init}</span>
        </div>
        <div>
          <p className="text-ivory-200 text-sm font-semibold leading-tight">{author}</p>
          <p className="text-xs text-ivory-300/40 font-mono">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function SocialProofSection() {
  const discountRef = useRef(null)

  useEffect(() => {
    const el = discountRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Discount Banner ── */}
      <section className="bg-wp-green py-0 relative overflow-hidden" aria-label="Bulk order discount">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        <div
          ref={discountRef}
          className="animate-on-scroll max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-ink-950 flex items-center justify-center flex-shrink-0">
              <span
                className="text-wp-green font-black text-2xl leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                10%
              </span>
            </div>
            <div>
              <h3
                className="text-ink-950 text-xl md:text-2xl font-black leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bulk Order Discount — Automatic
              </h3>
              <p className="text-ink-900/60 text-sm mt-1 font-body">
                Add 6 or more items to your cart and we automatically apply a 10% discount at checkout. No codes needed.
              </p>
            </div>
          </div>
          <Link
            to="/products"
            className="bg-ink-950 text-ivory-200 px-7 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-ink-800 transition-colors duration-200 whitespace-nowrap flex items-center gap-2 font-body"
          >
            Start Ordering
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-ink-900 py-28 relative" id="testimonials">
        <div className="absolute top-0 left-0 right-0">
          <hr className="section-rule" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-wp-green uppercase block mb-4">
              Client Stories
            </span>
            <h2
              className="text-ivory-50"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              }}
            >
              Trusted by{' '}
              <span className="italic text-wp-green">50,000+ clients</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.author} {...t} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
