import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import {
  ArrowRight,
  Award,
  Users,
  Printer,
  Globe,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'

const COLORS = {
  green: '#16a34a',
  greenDk: '#15803d',
  navy: '#002C5F',
  cyan: '#1993D2',
  amber: '#d97706',
  violet: '#a855f7',
}

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

const STATS = [
  { value: '10+', label: 'Years of Service', accent: COLORS.green, tint: 'from-emerald-50/80 to-white' },
  { value: '500+', label: 'Happy Customers', accent: COLORS.cyan, tint: 'from-sky-50/80 to-white' },
  { value: '98%', label: 'Satisfaction Rate', accent: COLORS.amber, tint: 'from-amber-50/80 to-white' },
  { value: '3', label: 'Group Companies', accent: COLORS.violet, tint: 'from-violet-50/80 to-white' },
]

function StatCard({ value, label, accent, tint }) {
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`animate-on-scroll relative overflow-hidden rounded-[24px] border border-white/80 bg-gradient-to-br ${tint} px-6 py-8 text-center shadow-[0_12px_40px_rgba(15,23,42,0.07)] backdrop-blur-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.11)]`}
    >
      <div
        className="absolute top-4 right-4 w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"
        style={{ background: accent }}
      />
      <div
        className="mb-2 leading-none transition-transform duration-300 group-hover:scale-105"
        style={{
          fontFamily: "'Lora', serif",
          fontWeight: 800,
          fontSize: 'clamp(2rem,4vw,3.25rem)',
          color: accent,
        }}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
        {label}
      </div>
    </div>
  )
}

function ValueStepCard({ icon: Icon, title, body, num, color, bg, border, delay = 0 }) {
  const ref = useScrollReveal()

  return (
    <div
      ref={ref}
      className="animate-on-scroll relative rounded-[22px] p-7 border group transition-all duration-300 hover:-translate-y-1 bg-white/[0.04] border-white/[0.08] hover:border-green-500/25 hover:bg-white/[0.06]"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="absolute top-4 right-5 font-bold leading-none select-none pointer-events-none"
        style={{
          fontFamily: "'Lora', serif",
          fontSize: '5rem',
          color: 'rgba(255,255,255,0.03)',
        }}
      >
        {num}
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{
              background: bg,
              border: `1px solid ${border}`,
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>

          <span
            className="text-[9px] font-bold uppercase tracking-[0.22em] px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Value {parseInt(num, 10)}
          </span>
        </div>

        <h3
          className="text-base font-semibold mb-2 text-white"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-white/55">
          {body}
        </p>
      </div>
    </div>
  )
}

function HighlightCard({ icon: Icon, title, body, tone = 'emerald' }) {
  const styles = {
    emerald: {
      wrap: 'from-emerald-50/70 to-white border-emerald-100/80',
      icon: 'bg-emerald-100 text-emerald-700',
    },
    cyan: {
      wrap: 'from-cyan-50/70 to-white border-cyan-100/80',
      icon: 'bg-cyan-100 text-cyan-700',
    },
    violet: {
      wrap: 'from-violet-50/70 to-white border-violet-100/80',
      icon: 'bg-violet-100 text-violet-700',
    },
  }

  const c = styles[tone]

  return (
    <div className={`relative overflow-hidden rounded-[22px] border bg-gradient-to-br ${c.wrap} p-7 shadow-sm group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)]`}>
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={20} />
      </div>
      <h3
        className="text-slate-900 mb-2"
        style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: '1.15rem' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-slate-500">{body}</p>
    </div>
  )
}

export default function AboutPage() {
  const storyRef1 = useScrollReveal()
  const storyRef2 = useScrollReveal()
  const valuesRef = useScrollReveal()
  const chairRef = useScrollReveal()

  return (
    <>
      <PageHero
        label="Who We Are"
        title="The Printing Arm of"
        titleAccent="Espiel-Bereso Group"
        subtitle="WELLPRINT was established to serve the printing needs of WELLife and has since grown into a comprehensive printing service provider. As a subsidiary of Espiel-Bereso Group of Companies, we combine institutional backing with agile, client-first service delivery."
      />

      {/* STATS */}
      <section className="relative py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="relative overflow-hidden py-24 bg-[linear-gradient(180deg,#ffffff_0%,#f5fbf7_50%,#eef8fb_100%)]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-6%] left-[2%] w-96 h-96 rounded-full bg-emerald-300/[0.10] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[4%] w-[28rem] h-[28rem] rounded-full bg-cyan-300/[0.09] blur-[140px]" />
          <div className="absolute right-[3%] top-[6%] opacity-[0.035] select-none pointer-events-none">
            <span
              className="text-[18vw] leading-none text-slate-900"
              style={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
            >
              W
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-emerald-500" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-700">
                Our Story
              </span>
            </div>

            <h2
              ref={storyRef1}
              className="animate-on-scroll text-slate-900 mb-6 leading-snug"
              style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.1rem)' }}
            >
              From Internal Division
              <br />
              to <span className="italic text-emerald-600">Industry Leader</span>
            </h2>

            <div className="space-y-5">
              <p ref={storyRef2} className="animate-on-scroll text-slate-500 leading-relaxed text-[0.95rem]">
                WELLPRINT started as an internal printing division, handling the marketing materials, packaging,
                and promotional items for WELLife. The quality and efficiency of our operations quickly caught
                the attention of partner businesses and clients.
              </p>

              <p className="text-slate-500 leading-relaxed text-[0.95rem]">
                What began as an internal service evolved into a full commercial printing operation with a
                dedicated team, industrial-grade equipment, and a clear mandate: deliver exceptional
                print quality to every client, every time.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Commercial-grade equipment', color: COLORS.green },
                  { label: 'Full-service design support', color: COLORS.cyan },
                  { label: 'End-to-end production', color: COLORS.amber },
                  { label: 'Fast turnaround times', color: COLORS.violet },
                ].map(({ label, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-xs text-slate-600 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Explore our services
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[28px] overflow-hidden border border-white/70 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
              <img
                src="/images/print1.png"
                alt="WELLPrint Operations"
                className="w-full h-72 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-md px-4 py-3">
                <TrendingUp size={18} className="text-emerald-400 shrink-0" />
                <span className="text-white text-xs font-semibold">Growing since Day 1</span>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 rounded-2xl border border-white/80 bg-white px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.12)] text-center">
              <div className="text-2xl font-bold text-emerald-600" style={{ fontFamily: "'Lora', serif" }}>
                500+
              </div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">
                clients served
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        ref={valuesRef}
        className="reveal-up py-20"
        style={{ background: '#080f18' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5"
              style={{
                background: 'rgba(22,163,74,0.10)',
                borderColor: 'rgba(22,163,74,0.22)',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: COLORS.green }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: COLORS.green }}
              >
                Our Values
              </span>
            </div>

            <h2
              className="leading-tight text-white"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 700,
                fontSize: 'clamp(2rem,4vw,3rem)',
              }}
            >
              What Drives{' '}
              <span className="italic" style={{ color: COLORS.green }}>
                Everything We Do
              </span>
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
              The principles behind every print job, every client interaction, and every result we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 relative">
            <ValueStepCard
              icon={Award}
              title="Uncompromising Quality"
              body="Every print run is held to exacting standards. We do not ship anything we would not proudly put our name on."
              num="01"
              color={COLORS.green}
              bg="rgba(22,163,74,0.12)"
              border="rgba(22,163,74,0.25)"
              delay={0}
            />

            <ValueStepCard
              icon={Globe}
              title="Client-First Mindset"
              body="From brief to finished product, our team stays in step with your timeline, your specs, and your vision."
              num="02"
              color={COLORS.cyan}
              bg="rgba(25,147,210,0.12)"
              border="rgba(25,147,210,0.25)"
              delay={120}
            />

            <ValueStepCard
              icon={Sparkles}
              title="Continuous Improvement"
              body="We invest in better equipment, better processes, and a better team to stay ahead of industry standards."
              num="03"
              color={COLORS.amber}
              bg="rgba(217,119,6,0.12)"
              border="rgba(217,119,6,0.25)"
              delay={240}
            />
          </div>
        </div>
      </section>

      {/* CHAIRMAN */}
      <section className="relative py-24 overflow-hidden bg-[linear-gradient(180deg,#f8fcfa_0%,#eef7fb_100%)] border-t border-emerald-100/60">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[12%] right-[8%] w-80 h-80 rounded-full bg-amber-100/60 blur-[120px]" />
          <div className="absolute bottom-[5%] left-[6%] w-72 h-72 rounded-full bg-emerald-100/60 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-10 bg-emerald-500" />
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-700">
              Leadership
            </span>
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div ref={chairRef} className="animate-on-scroll md:col-span-2">
              <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-sm">
                <img
                  src="/images/chairman.jpg"
                  alt="Chairman, WELLPrint"
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>

              <div className="mt-5 rounded-[22px] border border-amber-100/80 bg-gradient-to-br from-white via-amber-50/60 to-white p-5 shadow-sm">
                <div
                  className="text-slate-900 text-xl mb-1"
                  style={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
                >
                  Engr. Eglesciano &quot;Boboy&quot; Bereso
                </div>
                <div className="text-slate-400 text-[10px] tracking-[0.16em] uppercase font-semibold mt-1">
                  Chairman, WELLPRINT
                </div>
                <div className="text-slate-400 text-[10px] tracking-wide mt-0.5">
                  Espiel-Bereso Group of Companies
                </div>
              </div>
            </div>

            <div className="md:col-span-3">
              <h2
                className="text-slate-900 mb-8 leading-snug"
                style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.2vw,2.7rem)' }}
              >
                A Message from <span className="italic text-amber-500">Our Chairman</span>
              </h2>

              <div
                className="text-7xl leading-none mb-4 select-none"
                style={{ fontFamily: "'Lora', serif", color: COLORS.green, opacity: 0.14 }}
              >
                "
              </div>

              <div className="relative rounded-[26px] border border-white/80 bg-white/80 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent rounded-full" />

                <div className="space-y-5 text-slate-600 leading-relaxed text-[0.98rem]">
                  <p>
                    WELLPRINT was born out of a need, but it grew because of a conviction.
                    The conviction that printing, done right, is not just a service but a craft.
                    A craft that demands precision, care, and an unrelenting eye for detail.
                  </p>

                  <p>
                    When Espiel-Bereso Group made the decision to formalize and expand our printing operations,
                    we did so with a clear mandate: to serve not just WELLife, but every business that
                    values quality communications. We invested in technology, in people, and in process,
                    because our clients deserve nothing less.
                  </p>

                  <p>
                    Today, I am proud of what our team has built. Every brochure, every banner,
                    every packaging run is a reflection of our commitment to excellence. We do not
                    just print, we deliver confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-emerald-500" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-700">
                Why WELLPrint
              </span>
              <div className="h-px w-10 bg-emerald-500" />
            </div>

            <h2
              className="text-slate-900 leading-tight"
              style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(1.9rem,3.5vw,2.9rem)' }}
            >
              Built for reliability, speed, and brand quality
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <HighlightCard
              icon={Printer}
              title="Commercial-Grade Output"
              body="From internal campaigns to client work, we maintain the same standard of sharp, polished results."
              tone="emerald"
            />
            <HighlightCard
              icon={ShieldCheck}
              title="Reliable Production Flow"
              body="A smoother process from inquiry to delivery, built for businesses that need consistency and trust."
              tone="cyan"
            />
            <HighlightCard
              icon={Users}
              title="Backed by a Strong Group"
              body="As part of Espiel-Bereso Group, WELLPRINT benefits from structure, scale, and long-term stability."
              tone="violet"
            />
          </div>
        </div>
      </section>
    </>
  )
}