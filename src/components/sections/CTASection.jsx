import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="bg-ink-950 py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0"><hr className="section-rule" /></div>

      {/* Background W */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-[60vw] font-black text-ivory-200 leading-none block"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          W
        </span>
      </div>

      {/* Gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(184,151,42,0.05) 0%, transparent 70%)',
        }}
      />

      <div
        ref={ref}
        className="animate-on-scroll relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <span className="font-mono text-[10px] tracking-[0.25em] text-wp-green uppercase block mb-6">
          Ready to Print?
        </span>

        <h2
          className="text-ivory-50 mb-6 leading-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          }}
        >
          Let's make something
          <br />
          <span className="italic text-wp-green">extraordinary.</span>
        </h2>

        <p className="text-ivory-300/55 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          No account needed. Upload your files, configure your job, and check out as a guest in under two minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/products" className="btn-press text-sm group">
            Browse & Order Now
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <a href="tel:+18005557746" className="btn-press-ghost text-sm flex items-center gap-2">
            <Phone size={14} />
            Talk to Our Team
          </a>
        </div>

        {/* Trust micro-copy */}
        <p className="text-xs text-ivory-300/30 font-mono mt-8 tracking-wider">
          No account required · Secure file upload · 256-bit SSL encryption
        </p>
      </div>
    </section>
  )
}
