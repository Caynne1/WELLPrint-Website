import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import {
  ArrowRight,
  Award,
  Users,
  Printer,
  Globe,
  Sparkles,
  ShieldCheck,
  Quote,
} from 'lucide-react'

// ─── Palette (Blue · Green · Yellow) ───────────────────────────
const P = {
  blue:       '#1993D2',
  blueLt:     '#3caee6',
  blueTint:   'rgba(25,147,210,0.08)',
  blueGlow:   'rgba(25,147,210,0.12)',
  green:      '#16a34a',
  greenLt:    '#22c55e',
  greenTint:  'rgba(22,163,74,0.08)',
  greenGlow:  'rgba(22,163,74,0.12)',
  yellow:     '#e5a700',
  yellowLt:   '#fdc010',
  yellowTint: 'rgba(253,192,16,0.10)',
  yellowGlow: 'rgba(253,192,16,0.14)',
  cream:      '#f7f9fc',
  navy:       '#0c1a2e',
  slate:      '#3e4c5e',
  muted:      '#7c8898',
  border:     'rgba(15,23,42,0.07)',
  borderDk:   'rgba(255,255,255,0.08)',
}

// Accent trio for value cards
const ACCENTS = [
  { color: P.blue,   glow: P.blueGlow,   border: 'rgba(25,147,210,0.22)' },
  { color: P.green,  glow: P.greenGlow,   border: 'rgba(22,163,74,0.22)' },
  { color: P.yellow, glow: P.yellowGlow,  border: 'rgba(253,192,16,0.25)' },
]

// ─── Scroll reveal ─────────────────────────────────────────────
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

// ─── Stat pill ─────────────────────────────────────────────────
const STATS = [
  { value: '10+',  label: 'Years of Service', color: P.blue },
  { value: '500+', label: 'Happy Customers',  color: P.green },
  { value: '98%',  label: 'Satisfaction Rate', color: P.yellow },
  { value: '3',    label: 'Group Companies',   color: P.blue },
]

function Stat({ value, label, color }) {
  const ref = useScrollReveal()

  return (
    <div ref={ref} className="animate-on-scroll text-center px-2">
      <div
        className="leading-none mb-1.5"
        style={{
          fontFamily: "'Lora', serif",
          fontWeight: 800,
          fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
          color,
        }}
      >
        {value}
      </div>
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: P.muted }}
      >
        {label}
      </div>
    </div>
  )
}

// ─── Value card ────────────────────────────────────────────────
function ValueCard({ icon: Icon, title, body, index }) {
  const ref = useScrollReveal()
  const num = String(index + 1).padStart(2, '0')
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <div
      ref={ref}
      className="animate-on-scroll group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${P.borderDk}`,
      }}
    >
      <span
        className="absolute top-5 right-6 text-[11px] font-bold tracking-widest select-none"
        style={{ color: 'rgba(255,255,255,0.06)', fontFamily: "'Lora', serif" }}
      >
        {num}
      </span>

      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
        style={{
          background: accent.glow,
          border: `1px solid ${accent.border}`,
        }}
      >
        <Icon size={20} style={{ color: accent.color }} />
      </div>

      <h3
        className="text-white text-[1.05rem] font-semibold mb-2"
        style={{ fontFamily: "'Lora', serif" }}
      >
        {title}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {body}
      </p>
    </div>
  )
}

// ─── Highlight card ────────────────────────────────────────────
function HighlightCard({ icon: Icon, title, body, accent }) {
  const tint = accent === 'green'
    ? P.greenTint
    : accent === 'yellow'
    ? P.yellowTint
    : P.blueTint

  const color = accent === 'green'
    ? P.green
    : accent === 'yellow'
    ? P.yellow
    : P.blue

  return (
    <div
      className="group rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: '#ffffff',
        border: `1px solid ${P.border}`,
        boxShadow: '0 8px 30px rgba(15,23,42,0.05)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
        style={{ background: tint }}
      >
        <Icon size={20} style={{ color }} />
      </div>

      <h3
        className="mb-2"
        style={{
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          fontSize: '1.1rem',
          color: P.navy,
        }}
      >
        {title}
      </h3>

      <p className="text-sm leading-relaxed" style={{ color: P.slate }}>
        {body}
      </p>
    </div>
  )
}

// ─── Feature list items ────────────────────────────────────────
const FEATURES = [
  { label: 'Commercial-grade equipment', color: P.blue },
  { label: 'Full-service design support', color: P.green },
  { label: 'End-to-end production',       color: P.yellow },
  { label: 'Fast turnaround times',       color: P.blue },
]

// ─── Section label ─────────────────────────────────────────────
function SectionLabel({ children, light = false, color }) {
  const c = color || (light ? P.blueLt : P.blue)

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-10" style={{ background: c }} />
      <span
        className="text-[10px] font-bold tracking-[0.22em] uppercase"
        style={{ color: c }}
      >
        {children}
      </span>
    </div>
  )
}


// ═══════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════

export default function AboutPage() {
  const storyRef = useScrollReveal()
  const chairRef = useScrollReveal()

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <PageHero
        label="Who We Are"
        title="The Printing Arm of"
        titleAccent="Espiel-Bereso Group"
        subtitle="WELLPRINT was established to serve the printing needs of WELLife and has since grown into a comprehensive printing service provider, combining institutional backing with agile, client-first delivery."
      />


      {/* ── STATS BAR ─────────────────────────────────────── */}
      <section style={{ background: P.cream, borderBottom: `1px solid ${P.border}` }}>
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(s => (
              <Stat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>


      {/* ── OUR STORY ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, #ffffff 0%, ${P.cream} 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div ref={storyRef} className="animate-on-scroll">
              <SectionLabel color={P.green}>Our Story</SectionLabel>

              <h2
                className="mb-6 leading-snug"
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  color: P.navy,
                }}
              >
                From Internal Division
                <br />
                to{' '}
                <span className="italic" style={{ color: P.green }}>
                  Industry Leader
                </span>
              </h2>

              <div className="space-y-4 mb-8">
                <p className="leading-relaxed" style={{ color: P.slate, fontSize: '0.95rem' }}>
                  WELLPRINT started as an internal printing division, handling the
                  marketing materials, packaging, and promotional items for WELLife.
                  The quality and efficiency of our operations quickly caught
                  the attention of partner businesses and clients.
                </p>

                <p className="leading-relaxed" style={{ color: P.slate, fontSize: '0.95rem' }}>
                  What began as an internal service evolved into a full commercial
                  printing operation with a dedicated team, industrial-grade equipment,
                  and a clear mandate: deliver exceptional print quality to every
                  client, every time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {FEATURES.map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-[13px] font-medium" style={{ color: P.slate }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: P.blue }}
                onMouseEnter={e => (e.currentTarget.style.color = P.blueLt)}
                onMouseLeave={e => (e.currentTarget.style.color = P.blue)}
              >
                Explore our services <ArrowRight size={14} />
              </Link>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: `1px solid ${P.border}`,
                  boxShadow: '0 24px 60px rgba(15,23,42,0.10)',
                }}
              >
                <img
                  src="/images/print1.png"
                  alt="WELLPrint Operations"
                  className="w-full object-cover"
                  style={{ height: 'clamp(280px, 40vw, 420px)' }}
                  loading="lazy"
                />
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -left-3 md:-left-5 rounded-2xl px-5 py-4 text-center"
                style={{
                  background: '#ffffff',
                  border: `1px solid ${P.border}`,
                  boxShadow: '0 12px 36px rgba(15,23,42,0.10)',
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Lora', serif", color: P.green }}
                >
                  500+
                </div>
                <div
                  className="text-[9px] uppercase tracking-widest mt-0.5"
                  style={{ color: P.muted }}
                >
                  clients served
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── VALUES (dark band) ────────────────────────────── */}
      <section style={{ background: P.navy }}>
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <SectionLabel light>Our Values</SectionLabel>

            <h2
              className="text-white leading-tight mb-3"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              }}
            >
              What Drives{' '}
              <span className="italic" style={{ color: P.blueLt }}>
                Everything We Do
              </span>
            </h2>

            <p
              className="max-w-md mx-auto text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              The principles behind every print job, every client interaction,
              and every result we deliver.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <ValueCard
              icon={Award}
              title="Uncompromising Quality"
              body="Every print run is held to exacting standards. We do not ship anything we would not proudly put our name on."
              index={0}
            />
            <ValueCard
              icon={Globe}
              title="Client-First Mindset"
              body="From brief to finished product, our team stays in step with your timeline, your specs, and your vision."
              index={1}
            />
            <ValueCard
              icon={Sparkles}
              title="Continuous Improvement"
              body="We invest in better equipment, better processes, and a better team to stay ahead of industry standards."
              index={2}
            />
          </div>
        </div>
      </section>


      {/* ── CHAIRMAN ──────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: P.cream }}
      >
        <div className="max-w-7xl mx-auto px-6 py-24">
          <SectionLabel color={P.yellow}>Leadership</SectionLabel>

          <div className="grid md:grid-cols-5 gap-14 items-start mt-2">
            {/* Photo column */}
            <div ref={chairRef} className="animate-on-scroll md:col-span-2">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  border: `1px solid ${P.border}`,
                  boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
                }}
              >
                <img
                  src="/images/chairman.jpg"
                  alt="Chairman, WELLPrint"
                  className="w-full object-cover"
                  style={{ aspectRatio: '3/4' }}
                  loading="lazy"
                />
              </div>

              <div className="mt-5">
                <div
                  className="text-xl mb-0.5"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontWeight: 700,
                    color: P.navy,
                  }}
                >
                  Engr. Eglesciano &quot;Boboy&quot; Bereso
                </div>
                <div
                  className="text-[10px] tracking-[0.16em] uppercase font-semibold"
                  style={{ color: P.muted }}
                >
                  Chairman · Espiel-Bereso Group
                </div>
              </div>
            </div>

            {/* Quote column */}
            <div className="md:col-span-3">
              <h2
                className="mb-10 leading-snug"
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  color: P.navy,
                }}
              >
                A Message from{' '}
                <span className="italic" style={{ color: P.blue }}>
                  Our Chairman
                </span>
              </h2>

              <div
                className="relative rounded-2xl p-8"
                style={{
                  background: '#ffffff',
                  border: `1px solid ${P.border}`,
                  boxShadow: '0 12px 40px rgba(15,23,42,0.05)',
                }}
              >
                {/* Quote mark */}
                <Quote
                  size={32}
                  className="absolute -top-4 left-7"
                  style={{ color: P.yellow, opacity: 0.35 }}
                  fill="currentColor"
                />

                <div
                  className="space-y-5 leading-relaxed"
                  style={{ color: P.slate, fontSize: '0.95rem' }}
                >
                  <p>
                    WELLPRINT was born out of a need, but it grew because of a
                    conviction. The conviction that printing, done right, is not
                    just a service but a craft — a craft that demands precision,
                    care, and an unrelenting eye for detail.
                  </p>

                  <p>
                    When Espiel-Bereso Group made the decision to formalize and
                    expand our printing operations, we did so with a clear mandate:
                    to serve not just WELLife, but every business that values
                    quality communications. We invested in technology, in people,
                    and in process, because our clients deserve nothing less.
                  </p>

                  <p>
                    Today, I am proud of what our team has built. Every brochure,
                    every banner, every packaging run is a reflection of our
                    commitment to excellence. We do not just print — we deliver
                    confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── WHY WELLPRINT ─────────────────────────────────── */}
      <section
        className="py-24"
        style={{
          background: '#ffffff',
          borderTop: `1px solid ${P.border}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <SectionLabel color={P.green}>Why WELLPrint</SectionLabel>

            <h2
              className="leading-tight"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                color: P.navy,
              }}
            >
              Built for reliability, speed,
              <br className="hidden sm:block" /> and brand quality
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <HighlightCard
              icon={Printer}
              title="Commercial-Grade Output"
              body="From internal campaigns to client work, we maintain the same standard of sharp, polished results."
              accent="blue"
            />
            <HighlightCard
              icon={ShieldCheck}
              title="Reliable Production Flow"
              body="A smoother process from inquiry to delivery, built for businesses that need consistency and trust."
              accent="green"
            />
            <HighlightCard
              icon={Users}
              title="Backed by a Strong Group"
              body="As part of Espiel-Bereso Group, WELLPRINT benefits from structure, scale, and long-term stability."
              accent="yellow"
            />
          </div>
        </div>
      </section>
    </>
  )
}