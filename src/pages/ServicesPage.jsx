import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers,
  Printer,
  Maximize,
  Package,
  BookOpen,
  CreditCard,
  ArrowRight,
  MonitorPlay,
  PenTool,
  FileText,
  Flag,
  Sticker,
  Sparkles,
  CheckCircle2,
  Wand2,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'

const COLORS = {
  green: '#16a34a',
  greenDk: '#15803d',
  navy: '#002C5F',
  cyan: '#1993D2',
  amber: '#d97706',
  violet: '#a855f7',
  red: '#C8341A',
  slate: '#4A5568',
}

const BORDER_COLORS = [
  COLORS.green,
  COLORS.red,
  COLORS.amber,
  COLORS.cyan,
  COLORS.green,
  COLORS.red,
  COLORS.amber,
  COLORS.green,
  COLORS.slate,
  COLORS.red,
  COLORS.green,
]

const SERVICES = [
  {
    Icon: CreditCard,
    title: 'Business Cards',
    desc: 'First impressions in 350gsm. Matte, gloss, spot UV, foil, or letterpress finishes — your card, your identity.',
    tag: 'Most Popular',
    href: '/products?cat=business-cards',
    accent: COLORS.green,
  },
  {
    Icon: Printer,
    title: 'Digital Printing',
    desc: 'Fast, full-colour printing for any quantity — from short runs to bulk orders. CMYK precision on every sheet with quick turnaround.',
    tag: '48hr Ready',
    href: '/products?cat=digital',
    accent: COLORS.red,
  },
  {
    Icon: Layers,
    title: 'Offset Lithography',
    desc: 'Industrial-scale runs with unmatched colour consistency and Pantone matching. The gold standard for high-volume print jobs.',
    tag: 'High Volume',
    href: '/products?cat=offset',
    accent: COLORS.slate,
  },
  {
    Icon: Maximize,
    title: 'Large Format',
    desc: 'Posters, trade show displays, and oversized prints up to 5m wide at 1440dpi clarity. Bold visuals that command attention.',
    tag: 'Up to 5m',
    href: '/products?cat=large-format',
    accent: COLORS.amber,
  },
  {
    Icon: Package,
    title: 'Custom Packaging',
    desc: 'Boxes, bags, and mailers designed to make unboxing as memorable as the product inside. Fully customisable shapes and finishes.',
    tag: 'Brand Ready',
    href: '/products?cat=packaging',
    accent: COLORS.green,
  },
  {
    Icon: BookOpen,
    title: 'Booklets & Catalogs',
    desc: 'Saddle-stitched, perfect-bound, or spiral-bound. From product lookbooks to company annual reports, we bind them all.',
    tag: 'Custom Sizes',
    href: '/products?cat=booklets',
    accent: COLORS.red,
  },
  {
    Icon: MonitorPlay,
    title: 'Signage',
    desc: 'Indoor and outdoor signage solutions — from retail displays and wayfinding systems to event standees and store signs built to last.',
    tag: 'Indoor & Outdoor',
    href: '/products?cat=signage',
    accent: COLORS.amber,
    id: 'signage',
  },
  {
    Icon: FileText,
    title: 'Flyers & Leaflets',
    desc: 'Eye-catching flyers and leaflets for promotions, events, and campaigns. Available in various sizes with single or double-sided printing.',
    tag: 'Fast Turnaround',
    href: '/products?cat=flyers',
    accent: COLORS.green,
    id: 'flyers',
  },
  {
    Icon: Flag,
    title: 'Banners',
    desc: 'Vinyl, fabric, and mesh banners for events, storefronts, and trade shows. Weatherproof options available for long-term outdoor use.',
    tag: 'Event Ready',
    href: '/products?cat=banners',
    accent: COLORS.slate,
    id: 'banners',
  },
  {
    Icon: Sticker,
    title: 'Stickers',
    desc: 'Die-cut, sheet, or roll stickers in any shape and size. Perfect for product labels, packaging seals, branding, and promotional giveaways.',
    tag: 'Any Shape',
    href: '/products?cat=stickers',
    accent: COLORS.red,
    id: 'stickers',
  },
  {
    Icon: PenTool,
    title: 'Professional Layout Design',
    desc: 'Expert design services to craft print-ready artwork, structured layouts, and brand-consistent collateral that truly stands out.',
    tag: 'Design Service',
    href: '/contact',
    accent: COLORS.green,
    id: 'layout-design',
    cta: 'Get a Quote',
  },
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
      { threshold: 0.12 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}

function ServiceCard({
  Icon,
  title,
  desc,
  tag,
  href,
  accent,
  borderColor,
  delay,
  id,
  cta,
}) {
  const cardRef = useScrollReveal()

  return (
    <div
      id={id}
      ref={cardRef}
      className="animate-on-scroll group relative overflow-hidden cursor-pointer rounded-[24px] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.11)] transition-all duration-300"
      style={{
        transitionDelay: `${delay}ms`,
        border: `1px solid ${borderColor}20`,
        background: 'linear-gradient(180deg, #ffffff 0%, #f9fbfa 100%)',
      }}
    >
      <Link to={href} className="block p-7 h-full">
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]"
          style={{ backgroundColor: accent }}
        />

        <div
          className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `${accent}15` }}
        />

        <div className="relative w-12 h-12 flex items-center justify-center mb-5 rounded-2xl bg-slate-100 group-hover:scale-105 transition-transform duration-300">
          <Icon size={20} style={{ color: accent }} />
        </div>

        <div className="relative flex items-start justify-between gap-3 mb-3">
          <h3
            className="text-slate-900 text-lg font-semibold pr-2 leading-tight"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {title}
          </h3>

          <span
            className="badge flex-shrink-0 mt-0.5"
            style={{
              background: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            {tag}
          </span>
        </div>

        <p className="relative text-sm text-slate-600 leading-relaxed mb-6 font-body">
          {desc}
        </p>

        <div
          className="relative flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:gap-2 font-body"
          style={{ color: accent }}
        >
          {cta || 'View Products'}
          <ArrowRight size={12} />
        </div>
      </Link>
    </div>
  )
}

function HighlightItem({ icon: Icon, title, body, color }) {
  return (
    <div className="flex items-start gap-4 rounded-[22px] border border-slate-100 bg-white p-6 shadow-sm hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-300">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <h3
          className="text-slate-900 text-[1.02rem] font-semibold mb-1.5"
          style={{ fontFamily: "'Lora', serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

export default function ServicesPage() {
  const introRef = useScrollReveal()
  const ctaRef = useScrollReveal()

  return (
    <>
      <PageHero
        label="What We Offer"
        title="Every print product"
        titleAccent="your brand needs."
        subtitle="From a single business card to a full signage suite — WELLPrint delivers consistent quality at every scale, backed by professional design support."
      />

      {/* INTRO + GRID */}
      <section className="py-20 bg-[linear-gradient(180deg,#f8fbf9_0%,#ffffff_100%)] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(34,197,94,0.12) 0px, transparent 1px, transparent 64px), repeating-linear-gradient(-45deg, rgba(14,165,233,0.10) 0px, transparent 1px, transparent 64px)',
            backgroundSize: '64px 64px',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute top-[8%] left-[3%] w-72 h-72 rounded-full blur-[110px] pointer-events-none"
          style={{ background: 'rgba(34,197,94,0.08)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[6%] right-[4%] w-80 h-80 rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(14,165,233,0.08)' }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div
            ref={introRef}
            className="animate-on-scroll grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-end mb-12"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-10 bg-emerald-500" />
                <span className="font-body text-[11px] tracking-[0.2em] uppercase text-emerald-700 font-semibold">
                  Service Categories
                </span>
              </div>

              <h2
                className="text-slate-900 mb-4 leading-tight"
                style={{
                  fontFamily: "'Lora', serif",
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                }}
              >
                Designed for brands,
                <br />
                businesses, and <span className="italic text-emerald-600">bold ideas.</span>
              </h2>

              <p className="text-slate-600 text-base leading-relaxed font-body max-w-xl">
                Explore our core print services, from everyday essentials to custom brand materials.
                Whether you need quick digital prints or premium large-format output, WELLPrint
                delivers with clarity, consistency, and polish.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/70 bg-white/85 backdrop-blur-sm p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                  <Sparkles size={18} className="text-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-700 font-semibold">
                    Tailored Output
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    Built around your exact print needs
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  'Short-run & bulk orders',
                  'Indoor & outdoor print',
                  'Packaging & collateral',
                  'Design-ready production',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-500 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <ServiceCard
                key={s.title}
                {...s}
                borderColor={BORDER_COLORS[i]}
                delay={i * 70}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY THIS PAGE FEELS STRONGER */}
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
              More than services. A complete print workflow.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <HighlightItem
              icon={CheckCircle2}
              title="Reliable Print Quality"
              body="Every output is handled with consistency, precision, and a professional finish that reflects your brand well."
              color={COLORS.green}
            />
            <HighlightItem
              icon={Printer}
              title="Flexible Production Capacity"
              body="From one-off orders to large-volume production, we match the method and scale to your project needs."
              color={COLORS.cyan}
            />
            <HighlightItem
              icon={Wand2}
              title="Design + Print Support"
              body="Need help preparing artwork? Our layout design service helps turn raw ideas into print-ready assets."
              color={COLORS.violet}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 bg-[#f4f6f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={ctaRef}
            className="animate-on-scroll relative overflow-hidden rounded-[28px] px-10 py-14 md:px-16"
            style={{
              background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenDk} 40%, #0b5a20 100%)`,
            }}
          >
            <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full opacity-20 bg-white/15" />
            <div className="absolute -left-8 -bottom-12 w-56 h-56 rounded-full opacity-10 bg-white/20" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2
                  className="text-white leading-tight"
                  style={{ fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)' }}
                >
                  Need help choosing the right print solution?
                </h2>
                <p className="mt-2 text-[0.97rem] text-white/75">
                  Our team can guide you based on quantity, material, finish, and turnaround.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] active:scale-100"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    border: '1.5px solid rgba(255,255,255,0.28)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Talk to a Print Specialist <ArrowRight size={15} />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-white/20"
                  style={{
                    border: '1.5px solid rgba(255,255,255,0.22)',
                    color: 'rgba(255,255,255,0.88)',
                    background: 'transparent',
                  }}
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}