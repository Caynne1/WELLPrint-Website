import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'

// Animated decorative number/line element
function PressMark({ children, className = '' }) {
  return (
    <span className={`font-body text-[10px] tracking-[0.2em] text-ivory-300/30 uppercase ${className}`}>
      {children}
    </span>
  )
}

export default function HeroSection() {
  const heroRef = useRef(null)

  // Parallax subtle effect on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-ink-950 overflow-hidden flex flex-col">
      {/* ── Background layers ── */}
      <div
        ref={heroRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Radial gold glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vh] rounded-full bg-wp-green/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[50vw] h-[50vh] rounded-full bg-press-amber/[0.03] blur-[80px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(235,224,176,0.5) 0px, transparent 1px, transparent 80px), repeating-linear-gradient(90deg, rgba(235,224,176,0.5) 0px, transparent 1px, transparent 80px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Large watermark W */}
        <div className="absolute right-[-2%] top-[10%] opacity-[0.025] select-none pointer-events-none overflow-hidden">
          <span
            className="text-[38vw] font-black text-ivory-200 leading-none"
            style={{ fontFamily: "'Lora', serif" }}
          >
            W
          </span>
        </div>

        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto px-6 pt-32 pb-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left — Main copy */}
          <div className="lg:col-span-7">
            {/* Pre-title badge */}
            <div
              className="flex items-center gap-3 mb-8"
              style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}
            >
              <span className="badge badge-green">Premium Printing Studio</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="text-wp-green fill-wp-green" />
                ))}
                <span className="text-xs text-ivory-300/50 ml-1 font-body">4.9 / 5</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="text-ivory-50 leading-[0.92] mb-8"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
                animation: 'fadeUp 0.7s ease 0.2s both',
              }}
            >
              Print.{' '}
              <span
                className="italic text-ivory-50"
                style={{ fontFamily: "'Lora', serif" }}
              >
                Precisely.
              </span>
              <br />
              <span
                className="relative inline-block"
                style={{ color: 'var(--wp-green)' }}
              >
                Beautifully.
                {/* Underline rule */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 400 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 5 C80 2, 200 7, 398 4"
                    stroke="var(--wp-green)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: 600,
                      strokeDashoffset: 600,
                      animation: 'lineDraw 1.4s ease 0.8s forwards',
                    }}
                  />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-ivory-300/65 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
              style={{ animation: 'fadeUp 0.7s ease 0.35s both', fontFamily: "'Montserrat', sans-serif" }}
            >
              From business cards to large-format banners — WELLPrint delivers
              studio-quality results with offset precision, digital speed, and
              a team that cares about your brand.
            </p>

            {/* CTA group */}
            <div
              className="flex flex-wrap items-center gap-4"
              style={{ animation: 'fadeUp 0.7s ease 0.45s both' }}
            >
              <Link to="/products" className="btn-press group">
                Browse Products
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn-press-ghost">
                Get a Custom Quote
              </Link>
            </div>

            {/* Trust bar */}
            <div
              className="flex flex-wrap items-center gap-6 mt-12 pt-12 border-t border-ivory-200/10"
              style={{ animation: 'fadeUp 0.7s ease 0.55s both' }}
            >
              {[
                { value: '15+', label: 'Years in business' },
                { value: '50K+', label: 'Happy clients' },
                { value: '48hr', label: 'Turnaround' },
                { value: '500MB', label: 'File uploads' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span
                    className="text-2xl font-black text-ivory-100 leading-none mb-0.5"
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {value}
                  </span>
                  <span className="text-xs text-ivory-300/45 font-body tracking-wide uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual composition */}
          <div
            className="lg:col-span-5 hidden lg:flex flex-col items-end gap-4"
            style={{ animation: 'slideLeft 0.9s ease 0.3s both' }}
            aria-hidden="true"
          >
            {/* Main card */}
            <div className="w-full bg-ink-800 border border-ivory-200/10 p-8 relative">
              <PressMark className="absolute top-4 left-4">WP-001</PressMark>
              <PressMark className="absolute top-4 right-4">CMYK</PressMark>
              <div className="mt-4 mb-6">
                <div className="flex gap-2 mb-4">
                  {['#C8341A','#0A0905','var(--wp-green)','#F4ECCE'].map(c => (
                    <div
                      key={c}
                      className="w-8 h-8 rounded-full border-2 border-ivory-200/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  {[90, 75, 60, 45].map((w, i) => (
                    <div
                      key={i}
                      className="h-2 bg-ivory-200/10 rounded-none"
                      style={{
                        width: `${w}%`,
                        animation: `fadeIn 0.4s ease ${0.5 + i * 0.1}s both`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="border-t border-ivory-200/10 pt-4 flex items-center justify-between">
                <span className="text-xs font-body text-ivory-300/40 tracking-wider">OFFSET LITHO</span>
                <span className="badge badge-green">Ready</span>
              </div>
            </div>

            {/* Floating card 2 — discount reminder */}
            <div className="w-3/4 bg-wp-green/10 border border-wp-green/20 p-5 flex items-center gap-4 self-start">
              <div className="w-10 h-10 bg-wp-green flex items-center justify-center flex-shrink-0">
                <span className="text-ink-950 font-black text-sm font-body">%</span>
              </div>
              <div>
                <p className="text-ivory-200 text-sm font-semibold leading-tight">10% off</p>
                <p className="text-xs text-ivory-300/50 font-body mt-0.5">Orders of 6+ items</p>
              </div>
            </div>

            {/* Card 3 — file types */}
            <div className="w-full bg-ink-800 border border-ivory-200/10 p-5">
              <p className="text-[10px] font-body tracking-[0.15em] text-ivory-300/40 uppercase mb-3">
                Accepted File Formats
              </p>
              <div className="flex gap-2 flex-wrap">
                {['PDF','AI','PSD','EPS','TIFF','SVG'].map(fmt => (
                  <span key={fmt} className="badge badge-ivory">{fmt}</span>
                ))}
              </div>
              <p className="text-[10px] font-body text-ivory-300/30 mt-3">
                Up to 500 MB per file
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom scroll indicator ── */}
      <div
        className="relative z-10 flex justify-center pb-10"
        style={{ animation: 'fadeIn 1s ease 1.2s both' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[9px] tracking-[0.2em] text-ivory-300/30 uppercase">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-ivory-300/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
