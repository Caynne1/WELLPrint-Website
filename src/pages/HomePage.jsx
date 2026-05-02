import usePageTitle from '../hooks/usePageTitle'
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
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Zap,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const COLORS = {
  green: '#13A150',
  greenDk: '#0e8040',
  greenLt: '#1dc76a',
  cyan: '#1993D2',
  cyanDk: '#1270a8',
  yellow: '#FDC010',
  yellowDk: '#c99a00',
}

const featureItems = [
  { title: 'High-Quality Prints',     desc: 'Crisp, vibrant, long-lasting results',  icon: ShieldCheck,    accent: COLORS.cyan   },
  { title: 'Fast Turnaround',         desc: 'On-time delivery, every single time',   icon: Zap,            accent: COLORS.green  },
  { title: 'Affordable Pricing',      desc: 'Quality prints that fit your budget',   icon: BadgeDollarSign, accent: COLORS.yellow },
  { title: 'Custom Design Support',   desc: 'We bring your ideas to life',           icon: Palette,        accent: '#a855f7'     },
]

const steps = [
  { title: 'Upload or Request', desc: 'Upload your design or let our team craft one for you.', icon: Upload, num: '01', accent: COLORS.cyan   },
  { title: 'We Print',         desc: 'Precision printing on commercial-grade equipment.',      icon: Printer, num: '02', accent: COLORS.green  },
  { title: 'Pickup or Delivery', desc: 'Choose pickup or have it delivered to your door.',    icon: Truck,   num: '03', accent: COLORS.yellow },
]

const testimonials = [
  { quote: 'Smooth ordering and excellent quality every single time!', name: 'Mark T.',  role: 'Cafe Owner',       initial: 'M', color: COLORS.green },
  { quote: 'Fast turnaround and incredibly professional team.',         name: 'Ella D.',  role: 'Event Organizer',  initial: 'E', color: COLORS.cyan  },
  { quote: 'Our banners and business cards always look stunning.',      name: 'James L.', role: 'Entrepreneur',     initial: 'J', color: COLORS.yellow },
]

const stats = [
  { value: '500+', label: 'Happy Clients',      icon: Award,        color: COLORS.green },
  { value: '98%',  label: 'Satisfaction Rate',  icon: Star,         color: COLORS.cyan  },
  { value: '3d',   label: 'Avg. Turnaround',    icon: Clock,        color: COLORS.yellow },
  { value: '10k+', label: 'Orders Completed',   icon: CheckCircle2, color: '#a855f7'    },
]

function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.08 }
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
      ${isDark
        ? 'bg-[#112240]/80 border-white/[0.10] shadow-[0_32px_80px_rgba(0,0,0,0.50)]'
        : 'bg-white/95 border-white shadow-[0_24px_64px_rgba(13,31,60,0.12)]'
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {featureItems.map(({ title, desc, icon: Icon, accent }, i) => (
          <div
            key={title}
            className={`relative flex items-start gap-4 px-6 py-7 group transition-all duration-300
              ${i !== featureItems.length - 1
                ? isDark
                  ? 'lg:border-r border-white/[0.08] md:border-b lg:border-b-0 border-white/[0.08]'
                  : 'lg:border-r border-slate-100 md:border-b lg:border-b-0 border-slate-100'
                : ''
              }`}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent}10 0%, transparent 70%)` }}
            />
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
              style={{ background: `${accent}18`, border: `1.5px solid ${accent}35` }}
            >
              <Icon size={20} style={{ color: accent }} />
            </div>
            <div className="relative">
              <h3 className={`text-[0.92rem] font-semibold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {title}
              </h3>
              <p className={`mt-0.5 text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
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
  usePageTitle()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const processRef   = useScrollReveal()
  const statsRef     = useScrollReveal()
  const trustRef     = useScrollReveal()
  const ctaRef       = useScrollReveal()

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 4500)
    return () => clearInterval(timer)
  }, [])

  const prevTestimonial = () => setActiveTestimonial((p) => (p - 1 + testimonials.length) % testimonials.length)
  const nextTestimonial = () => setActiveTestimonial((p) => (p + 1) % testimonials.length)

  return (
    <main style={{ background: isDark ? '#0c1829' : '#f0f6ff' }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[780px] flex flex-col">
        <div className="absolute inset-0">
          <img
            src={isDark ? '/images/print.png' : '/images/print 2.png'}
            alt="WELLPrint"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0" style={{ background: isDark ? 'rgba(8,14,28,0.62)' : 'rgba(240,246,255,0.14)' }} />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? 'linear-gradient(108deg,rgba(12,24,41,0.90) 0%,rgba(12,24,41,0.60) 40%,rgba(12,24,41,0.18) 70%,transparent 100%)'
                : 'linear-gradient(108deg,rgba(240,246,255,0.94) 0%,rgba(240,246,255,0.52) 35%,rgba(240,246,255,0.10) 58%,transparent 72%)',
            }}
          />
          {/* Brand glow hints */}
          <div className="orb orb-cyan" style={{ width: '40vw', height: '40vw', top: '5%', left: '-10%' }} />
          <div className="orb orb-green" style={{ width: '30vw', height: '30vw', top: '40%', left: '5%' }} />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-20 md:pt-24 pb-8 md:pb-12">
          <div className="max-w-[600px] flex flex-col items-start text-left">
            {/* Label pill */}
            <div
              className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border w-fit"
              style={{
                background: isDark ? 'rgba(25,147,210,0.12)' : 'rgba(25,147,210,0.09)',
                borderColor: 'rgba(25,147,210,0.35)',
              }}
            >
              <Sparkles size={13} style={{ color: COLORS.cyan }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: COLORS.cyan }}>
                Premium Printing Solutions
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`leading-[0.9] text-left ${isDark ? 'text-white' : 'text-[#0d1f3c]'}`}
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
              className={`mt-8 max-w-md text-[1.05rem] leading-relaxed ${isDark ? 'text-white/72' : 'text-[#2d4a6e]'}`}
            >
              From business cards to large-format banners, WELLPrint delivers polished
              results with a seamless ordering experience — built for brands that care.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/products"
                className="btn-pulse inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-100"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 100%)`,
                  boxShadow: `0 12px 32px rgba(19,161,80,0.36)`,
                }}
              >
                Start Printing
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
                style={{
                  border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(25,147,210,0.35)'}`,
                  color: isDark ? 'rgba(255,255,255,0.88)' : COLORS.cyan,
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Browse Products
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['M', 'E', 'J', 'L', 'R'].map((l, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                    style={{
                      borderColor: isDark ? '#0c1829' : '#f0f6ff',
                      background: [COLORS.green, COLORS.cyan, COLORS.yellow, '#a855f7', '#ef4444'][i],
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill={COLORS.yellow} stroke="none" />
                  ))}
                </div>
                <span className={`text-xs font-medium ${isDark ? 'text-white/55' : 'text-[#5a7a9a]'}`}>
                  4.9 from 500+ clients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-10 md:pb-12 w-full">
          <FeatureBar isDark={isDark} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        className="reveal-up py-12 sm:py-16"
        style={{ background: isDark ? '#0e1e33' : '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {stats.map(({ value, label, icon: Icon, color }, i) => (
              <div
                key={label}
                className={`relative group rounded-[20px] p-6 border transition-all duration-300 hover:-translate-y-1 overflow-hidden
                  ${isDark
                    ? 'bg-[#112240] border-white/[0.08] hover:border-white/[0.14]'
                    : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(13,31,60,0.06)] hover:shadow-[0_12px_40px_rgba(13,31,60,0.10)]'
                  }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Accent top bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px]" style={{ background: color }} />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}0c 0%, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 relative"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="stat-number text-3xl relative" style={{ color }}>
                  {value}
                </div>
                <p className={`text-xs mt-1 font-medium relative ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section
        ref={processRef}
        className="reveal-up py-14 sm:py-20"
        style={{ background: isDark ? '#0c1829' : '#f0f6ff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
              style={{ background: 'rgba(25,147,210,0.09)', borderColor: 'rgba(25,147,210,0.28)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.cyan }} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.cyan }}>
                How It Works
              </span>
            </div>
            <h2
              className={`leading-tight ${isDark ? 'text-white' : 'text-[#0d1f3c]'}`}
              style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 'clamp(2rem,4vw,3rem)' }}
            >
              Simple. Fast. <span className="italic" style={{ color: COLORS.green }}>Reliable.</span>
            </h2>
            <p className={`mt-3 max-w-md text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>
              A smoother ordering process — from request to finished print.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map(({ title, desc, icon: Icon, num, accent }, i) => (
              <div
                key={title}
                className={`relative rounded-[22px] border overflow-hidden group transition-all duration-300 hover:-translate-y-1.5
                  ${isDark
                    ? 'bg-[#112240] border-white/[0.08] hover:border-white/[0.16]'
                    : 'bg-white border-slate-100 shadow-[0_4px_24px_rgba(13,31,60,0.07)] hover:shadow-[0_18px_50px_rgba(13,31,60,0.12)]'
                  }`}
              >
                {/* Colored top accent bar */}
                <div className="h-[3px] w-full" style={{ background: accent }} />
                <div className="p-7">
                  {/* Ghost number */}
                  <div
                    className="absolute top-6 right-5 font-bold leading-none select-none pointer-events-none"
                    style={{
                      fontFamily: "'Lora', serif",
                      fontSize: '5rem',
                      color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(13,31,60,0.04)',
                    }}
                  >
                    {num}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                        style={{ background: `${accent}18`, border: `1.5px solid ${accent}30` }}
                      >
                        <Icon size={24} style={{ color: accent }} />
                      </div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
                        style={{
                          background: isDark ? 'rgba(255,255,255,0.07)' : `${accent}12`,
                          color: isDark ? 'rgba(255,255,255,0.45)' : accent,
                        }}
                      >
                        Step {i + 1}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#0d1f3c]'}`}
                      style={{ fontFamily: "'Lora', serif" }}
                    >
                      {title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        ref={trustRef}
        className="reveal-up py-14 sm:py-20"
        style={{ background: isDark ? '#0e1e33' : '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-5"
                style={{ background: 'rgba(19,161,80,0.09)', borderColor: 'rgba(19,161,80,0.28)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.green }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: COLORS.green }}>
                  Client Stories
                </span>
              </div>
              <h2
                className={`leading-tight ${isDark ? 'text-white' : 'text-[#0d1f3c]'}`}
                style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 'clamp(1.9rem,3.5vw,2.8rem)' }}
              >
                Trusted by Local{' '}
                <span className="italic" style={{ color: COLORS.green }}>Businesses</span>
              </h2>
              <div className="flex items-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill={COLORS.yellow} stroke="none" />
                ))}
                <span className={`text-sm ml-1 ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>
                  4.9 / 5 from 500+ customers
                </span>
              </div>
            </div>

            {/* Nav arrows */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    height: '8px',
                    width: activeTestimonial === i ? '28px' : '8px',
                    background: activeTestimonial === i ? COLORS.cyan : isDark ? 'rgba(255,255,255,0.18)' : '#cbd5e1',
                  }}
                />
              ))}
              <div className="flex gap-2 ml-3">
                <button
                  onClick={prevTestimonial}
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(13,31,60,0.12)',
                    color: isDark ? 'rgba(255,255,255,0.65)' : '#5a7a9a',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(13,31,60,0.12)',
                    color: isDark ? 'rgba(255,255,255,0.65)' : '#5a7a9a',
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* Testimonial carousel */}
            <div className="relative overflow-hidden rounded-[24px]">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((item) => (
                  <div key={item.name} className="min-w-full">
                    <div
                      className={`rounded-[24px] border p-8 min-h-[200px] relative overflow-hidden
                      ${isDark
                        ? 'bg-[#112240] border-white/[0.10]'
                        : 'bg-white border-slate-100 shadow-[0_4px_24px_rgba(13,31,60,0.07)]'
                      }`}
                    >
                      {/* Accent top bar */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px]" style={{ background: item.color }} />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at 80% 20%, ${item.color}08 0%, transparent 60%)` }}
                      />
                      <div
                        className="text-6xl leading-none mb-4 select-none relative"
                        style={{ fontFamily: "'Lora', serif", color: item.color, opacity: 0.25 }}
                      >
                        "
                      </div>
                      <p
                        className={`text-lg font-medium leading-relaxed relative ${isDark ? 'text-white/88' : 'text-[#0d1f3c]'}`}
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {item.quote}
                      </p>
                      <div className="mt-6 flex items-center gap-3 relative">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                          style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}bb)` }}
                        >
                          {item.initial}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#0d1f3c]'}`}>{item.name}</p>
                          <p className={`text-xs ${isDark ? 'text-white/45' : 'text-[#5a7a9a]'}`}>{item.role}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={COLORS.yellow} stroke="none" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Side stats card */}
            <div
              className={`rounded-[24px] border p-7 flex flex-col justify-between relative overflow-hidden
              ${isDark
                ? 'bg-[#112240] border-white/[0.10]'
                : 'bg-white border-slate-100 shadow-[0_4px_24px_rgba(13,31,60,0.07)]'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[24px]"
                style={{ background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.cyan})` }} />
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'rgba(19,161,80,0.14)', border: '1.5px solid rgba(19,161,80,0.28)' }}
                >
                  <CheckCircle2 size={22} style={{ color: COLORS.green }} />
                </div>
                <p className="stat-number text-5xl mb-1" style={{ color: COLORS.green }}>500+</p>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>Happy Customers</p>
              </div>

              <hr className="divider-brand my-5" />

              <div>
                <p className="stat-number text-3xl mb-1" style={{ color: COLORS.cyan }}>98%</p>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>Satisfaction Rate</p>
              </div>

              <hr className="divider-brand my-5" />

              <div>
                <p className="stat-number text-3xl mb-1" style={{ color: COLORS.yellow }}>4.9</p>
                <div className="flex gap-0.5 mt-1 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={11} fill={COLORS.yellow} stroke="none" />)}
                </div>
                <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#5a7a9a]'}`}>Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        ref={ctaRef}
        className="reveal-up pb-14 sm:pb-20 pt-4"
        style={{ background: isDark ? '#0c1829' : '#f0f6ff' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div
            className="relative overflow-hidden rounded-[28px] px-10 py-16 md:px-16"
            style={{
              background: isDark
                ? `linear-gradient(135deg, #0d2240 0%, #0a2d52 45%, #0e3a6e 100%)`
                : `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 40%, #07562a 100%)`,
            }}
          >
            {/* Decorative orbs */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full"
              style={{ background: `radial-gradient(circle, ${isDark ? COLORS.cyan : 'rgba(255,255,255,0.14)'} 0%, transparent 70%)`, opacity: 0.22 }} />
            <div className="absolute -left-10 -bottom-14 w-64 h-64 rounded-full"
              style={{ background: `radial-gradient(circle, ${isDark ? COLORS.green : 'rgba(255,255,255,0.18)'} 0%, transparent 70%)`, opacity: 0.16 }} />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

            {/* Brand color strip at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{ background: `linear-gradient(90deg, ${COLORS.cyan}, ${COLORS.green}, ${COLORS.yellow})` }} />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-4"
                  style={{ background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)' }}
                >
                  <Sparkles size={11} className="text-white" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    Get Started Today
                  </span>
                </div>
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
                    background: isDark ? COLORS.green : 'rgba(255,255,255,0.20)',
                    border: '1.5px solid rgba(255,255,255,0.30)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: isDark ? `0 8px 24px rgba(19,161,80,0.32)` : '0 8px 24px rgba(0,0,0,0.12)',
                  }}
                >
                  Start Printing <ArrowRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/15"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    color: 'rgba(255,255,255,0.90)',
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