import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeDollarSign,
  Palette,
  ShieldCheck,
  Star,
  Truck,
  Upload,
  Printer,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const COLORS = {
  green: '#16a34a',
  greenDk: '#15803d',
  greenLt: '#22c55e',
  navy: '#002C5F',
  cyan: '#1993D2',
}

const featureItems = [
  { title: 'High-Quality Prints', desc: 'Crisp, vibrant, and long-lasting results', icon: ShieldCheck, accent: COLORS.cyan },
  { title: 'Fast Turnaround', desc: 'On-time delivery, every time', icon: Truck, accent: COLORS.green },
  { title: 'Affordable Pricing', desc: 'Quality prints that fit your budget', icon: BadgeDollarSign, accent: '#d97706' },
  { title: 'Custom Design Support', desc: 'We help bring your ideas to life', icon: Palette, accent: '#a855f7' },
]

const steps = [
  { title: 'Upload or Request', desc: 'Upload your design or let our team craft one for you.', icon: Upload, num: '01' },
  { title: 'We Print', desc: 'Precision printing on commercial-grade equipment.', icon: Printer, num: '02' },
  { title: 'Pickup or Delivery', desc: 'Choose pickup or have it delivered to your door.', icon: Truck, num: '03' },
]

const testimonials = [
  { quote: 'Smooth ordering and excellent quality every single time!', name: 'Mark T.', role: 'Cafe Owner' },
  { quote: 'Fast turnaround and incredibly professional team.', name: 'Ella D.', role: 'Event Organizer' },
  { quote: 'Our banners and business cards always look stunning.', name: 'James L.', role: 'Entrepreneur' },
]

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function FeatureBar({ isDark }) {
  return (
    <div
      className={`relative rounded-[24px] overflow-hidden border backdrop-blur-2xl
      ${
        isDark
          ? 'bg-white/[0.04] border-white/[0.09] shadow-[0_32px_80px_rgba(0,0,0,0.40)]'
          : 'bg-white/90 border-black/[0.06] shadow-[0_32px_80px_rgba(0,0,0,0.12)]'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {featureItems.map(({ title, desc, icon: Icon, accent }, i) => (
          <div
            key={title}
            className={`relative flex items-start gap-4 px-6 py-7 group transition-all duration-300
              ${
                i !== featureItems.length - 1
                  ? isDark
                    ? 'lg:border-r border-white/[0.07]'
                    : 'lg:border-r border-black/[0.05]'
                  : ''
              }`}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}08 0%, transparent 70%)` }}
            />
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}
            >
              <Icon size={20} style={{ color: accent }} />
            </div>
            <div className="relative">
              <h3 className={`text-[0.95rem] font-semibold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h3>
              <p className={`mt-0.5 text-xs leading-relaxed ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const processRef = useScrollReveal()
  const trustRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className={isDark ? 'bg-[#060c14]' : 'bg-[#f4f6f4]'}>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[760px] flex flex-col">
        <div className="absolute inset-0">
          <img
            src={isDark ? '/images/print.png' : '/images/print 2.png'}
            alt="WELLPrint"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
          {/* Thin base tone — barely tints center/right so logo stays visible */}
          <div
            className="absolute inset-0"
            style={{ background: isDark ? 'rgba(0,0,0,0.50)' : 'rgba(255,255,255,0.06)' }}
          />
          {/* Left-side fade — heavy only where the text lives, clears out fast */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(105deg,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.52) 42%,rgba(0,0,0,0.16) 72%,transparent 100%)'
                : 'linear-gradient(105deg,rgba(255,255,255,0.88) 0%,rgba(255,255,255,0.42) 33%,rgba(255,255,255,0.08) 55%,transparent 70%)',
            }}
          />
          {/* Subtle green accent tint on left — same width, same opacity */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/2"
            style={{
              background: isDark
                ? 'linear-gradient(90deg,rgba(22,163,74,0.07) 0%,transparent 100%)'
                : 'linear-gradient(90deg,rgba(22,163,74,0.04) 0%,transparent 100%)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-20 md:pt-24 pb-12">
          {/* LEFT-ALIGNED WRAPPER FIX */}
          <div className="max-w-[580px] flex flex-col items-start text-left">
            {/* Label pill */}
            <div
              className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border w-fit"
              style={{
                background: isDark ? 'rgba(22,163,74,0.10)' : 'rgba(22,163,74,0.08)',
                borderColor: 'rgba(22,163,74,0.28)',
              }}
            >
              <Sparkles size={13} style={{ color: COLORS.green }} />
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: COLORS.green }}
              >
                Premium Printing Solutions
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`leading-[0.9] ${isDark ? 'text-white' : 'text-slate-900'} text-left`}
              style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(3.2rem,7.5vw,6.4rem)' }}
            >
              <span className="block type-line type-line-1">Print.</span>
              <span className="block italic type-line type-line-2">Precisely.</span>
              <span className="relative inline-block type-line type-line-3" style={{ color: COLORS.green }}>
                Beautifully.
                <svg className="absolute -bottom-2 left-0 w-[82%]" viewBox="0 0 400 10" fill="none">
                  <path
                    d="M2 6 C60 2, 160 9, 260 5 S360 2, 398 6"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="hero-underline-path"
                  />
                </svg>
              </span>
            </h1>

            <p
              className={`mt-7 max-w-md text-[1.05rem] leading-relaxed text-left ${isDark ? 'text-white/75' : 'text-slate-600'}`}
              style={{ fontFamily: 'inherit' }}
            >
              From business cards to large-format banners, WELLPrint delivers polished
              results with a seamless ordering experience — built for brands that care.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3 justify-start">
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-100"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                  boxShadow: `0 12px 32px rgba(22,163,74,0.32)`,
                }}
              >
                Start Printing
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
                style={{
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(22,163,74,0.35)'}`,
                  color: isDark ? 'rgba(255,255,255,0.88)' : COLORS.green,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Browse Products
              </Link>
            </div>

            {/* Social proof micro */}
            <div className="mt-8 flex items-center gap-3 justify-start">
              <div className="flex -space-x-2">
                {['M', 'E', 'J', 'L', 'R'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                    style={{
                      borderColor: isDark ? '#0a0f1a' : '#fff',
                      background: [COLORS.green, COLORS.cyan, '#d97706', '#a855f7', '#ef4444'][i],
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
                  4.9 from 500+ clients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <FeatureBar isDark={isDark} />
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section ref={processRef} className="reveal-up py-20" style={{ background: isDark ? '#080f18' : '#f1f5f9' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
              style={{ background: 'rgba(22,163,74,0.07)', borderColor: 'rgba(22,163,74,0.22)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.green }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.green }}>
                How It Works
              </span>
            </div>
            <h2
              className={`leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
              style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)' }}
            >
              Simple. Fast. <span className="italic" style={{ color: COLORS.green }}>Reliable.</span>
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-relaxed ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
              A smoother ordering process — from request to finished print.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">

            {steps.map(({ title, desc, icon: Icon, num }, i) => (
              <div
                key={title}
                className={`relative rounded-[22px] p-7 border group transition-all duration-300 hover:-translate-y-1
                  ${
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.08] hover:border-green-500/25 hover:bg-white/[0.06]'
                      : 'bg-white border-slate-200 hover:border-green-300 shadow-[0_4px_24px_rgba(0,0,0,0.09)] hover:shadow-[0_16px_48px_rgba(22,163,74,0.14)]'
                  }`}
              >
                <div
                  className="absolute top-4 right-5 font-bold leading-none select-none pointer-events-none"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: '5rem',
                    color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(15,23,42,0.04)',
                  }}
                >
                  {num}
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        background:
                          i === 0 ? 'rgba(22,163,74,0.12)' : i === 1 ? 'rgba(25,147,210,0.12)' : 'rgba(168,85,247,0.12)',
                        border: `1px solid ${
                          i === 0 ? 'rgba(22,163,74,0.25)' : i === 1 ? 'rgba(25,147,210,0.25)' : 'rgba(168,85,247,0.25)'
                        }`,
                      }}
                    >
                      <Icon size={24} style={{ color: i === 0 ? COLORS.green : i === 1 ? COLORS.cyan : '#a855f7' }} />
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(22,163,74,0.08)',
                        color: isDark ? 'rgba(255,255,255,0.4)' : COLORS.green,
                      }}
                    >
                      Step {i + 1}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}
                    style={{ fontFamily: "'Lora', serif" }}
                  >
                    {title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-white/55' : 'text-slate-500'}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / TESTIMONIALS ── */}
      <section ref={trustRef} className="reveal-up py-20" style={{ background: isDark ? '#060c14' : '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr_260px] items-start">
            <div className="flex flex-col gap-5">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-5"
                  style={{ background: 'rgba(22,163,74,0.07)', borderColor: 'rgba(22,163,74,0.22)' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.green }} />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.green }}>
                    Client Stories
                  </span>
                </div>
                <h2
                  className={`leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                  style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 'clamp(1.9rem,3.5vw,2.8rem)' }}
                >
                  Trusted by Local <span className="italic" style={{ color: COLORS.green }}>Businesses</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" stroke="none" />
                ))}
              </div>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>4.9 / 5 from 500+ customers</p>

              <div className="flex items-center gap-2 mt-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      height: '8px',
                      width: activeTestimonial === i ? '28px' : '8px',
                      background: activeTestimonial === i ? COLORS.green : isDark ? 'rgba(255,255,255,0.18)' : '#cbd5e1',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px]">
              <div
                className="flex transition-transform duration-600 ease-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item) => (
                  <div key={item.name} className="min-w-full">
                    <div
                      className={`rounded-[22px] border p-8 min-h-[180px]
                      ${
                        isDark
                          ? 'bg-white/[0.04] border-white/[0.09]'
                          : 'bg-white border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.10)]'
                      }`}
                    >
                      <div
                        className="text-5xl leading-none mb-4 select-none"
                        style={{ fontFamily: "'Lora', serif", color: COLORS.green, opacity: 0.22 }}
                      >
                        "
                      </div>
                      <p
                        className={`text-lg font-medium leading-relaxed ${isDark ? 'text-white/85' : 'text-slate-700'}`}
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {item.quote}
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDk})` }}
                        >
                          {item.name[0]}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.name}</p>
                          <p className={`text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>{item.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`flex flex-col items-center justify-center rounded-[22px] border p-8 text-center
              ${isDark ? 'bg-white/[0.04] border-white/[0.09]' : 'bg-white border-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.10)]'}`}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)' }}
              >
                <CheckCircle2 size={26} style={{ color: COLORS.green }} />
              </div>
              <p className="text-5xl font-bold leading-none mb-2" style={{ fontFamily: "'Lora', serif", color: COLORS.green }}>
                500+
              </p>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Happy Customers</p>
              <div className="mt-5 pt-5 w-full border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9' }}>
                <p className="text-3xl font-bold" style={{ fontFamily: "'Lora', serif", color: COLORS.cyan }}>98%</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-slate-500'}`}>Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section ref={ctaRef} className="reveal-up pb-20" style={{ background: isDark ? '#060c14' : '#f4f6f4' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative overflow-hidden rounded-[28px] px-10 py-14 md:px-16"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #0d1a30 0%, #0a2447 50%, #0a3060 100%)'
                : `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 40%, #0b5a20 100%)`,
            }}
          >
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-20" style={{ background: isDark ? COLORS.cyan : 'rgba(255,255,255,0.15)' }} />
            <div className="absolute -left-8 -bottom-12 w-56 h-56 rounded-full opacity-10" style={{ background: isDark ? COLORS.green : 'rgba(255,255,255,0.20)' }} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2
                  className="text-white leading-tight"
                  style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)' }}
                >
                  Ready to print your ideas?
                </h2>
                <p className="mt-2 text-[0.97rem]" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  Let's create something amazing together.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-100"
                  style={{
                    background: isDark ? COLORS.green : 'rgba(255,255,255,0.18)',
                    border: '1.5px solid rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Start Printing <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/20"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.22)',
                    color: 'rgba(255,255,255,0.88)',
                    background: 'transparent',
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}