import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers, Printer, Maximize, Package, BookOpen,
  CreditCard, ArrowRight, MonitorPlay, PenTool,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'

const SERVICES = [
  {
    Icon:    CreditCard,
    title:   'Business Cards',
    desc:    'First impressions in 350gsm. Matte, gloss, spot UV, foil, or letterpress finishes — your card, your identity.',
    tag:     'Most Popular',
    href:    '/products?cat=business-cards',
    accent:  'var(--wp-green)',
  },
  {
    Icon:    Printer,
    title:   'Digital Printing',
    desc:    'Fast turnaround for flyers, leaflets, and promotional materials. CMYK precision on every sheet.',
    tag:     '48hr Ready',
    href:    '/products?cat=digital',
    accent:  '#C8341A',
  },
  {
    Icon:    Layers,
    title:   'Offset Lithography',
    desc:    'Industrial-scale runs with unmatched colour consistency and Pantone matching for bulk orders.',
    tag:     'High Volume',
    href:    '/products?cat=offset',
    accent:  '#4A5568',
  },
  {
    Icon:    Maximize,
    title:   'Large Format',
    desc:    'Banners, posters, and trade show displays printed up to 5m wide at 1440dpi clarity.',
    tag:     'Up to 5m',
    href:    '/products?cat=large-format',
    accent:  '#D4810A',
  },
  {
    Icon:    Package,
    title:   'Custom Packaging',
    desc:    'Boxes, bags, and mailers that make unboxing as memorable as the product inside.',
    tag:     'Brand Ready',
    href:    '/products?cat=packaging',
    accent:  'var(--wp-green)',
  },
  {
    Icon:    BookOpen,
    title:   'Booklets & Catalogs',
    desc:    'Saddle-stitched, perfect-bound, or spiral. From lookbooks to annual reports, we bind them all.',
    tag:     'Custom Sizes',
    href:    '/products?cat=booklets',
    accent:  '#C8341A',
  },
  {
    Icon:    MonitorPlay,
    title:   'Signage',
    desc:    'Indoor and outdoor signage solutions — from retail displays and wayfinding systems to event banners built to last.',
    tag:     'Indoor & Outdoor',
    href:    '/products?cat=signage',
    accent:  '#D4810A',
    id:      'signage',
  },
  {
    Icon:    PenTool,
    title:   'Professional Layout Design',
    desc:    'Expert design services to craft print-ready artwork, structured layouts, and brand-consistent collateral that stands out.',
    tag:     'Design Service',
    href:    '/contact',
    accent:  'var(--wp-green)',
    id:      'layout-design',
    cta:     'Get a Quote',
  },
]

function ServiceCard({ Icon, title, desc, tag, href, accent, delay, id, cta }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      id={id}
      ref={cardRef}
      className="animate-on-scroll card-press group relative overflow-hidden cursor-pointer"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link to={href} className="block p-7 h-full">
        {/* Accent border top */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-500 group-hover:h-[4px]"
          style={{ backgroundColor: accent }}
        />

        {/* Icon */}
        <div
          className="w-11 h-11 flex items-center justify-center mb-5 border transition-all duration-300 group-hover:border-opacity-40"
          style={{ borderColor: `${accent}30` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>

        {/* Content */}
        <div className="flex items-start justify-between mb-3">
          <h3
            className="text-ivory-100 text-lg font-medium pr-4 leading-tight"
            style={{ fontFamily: "'DM Serif Display', serif" }}
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

        <p className="text-sm text-ivory-300/55 leading-relaxed mb-6">{desc}</p>

        <div
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-all duration-200 group-hover:gap-2 font-body"
          style={{ color: accent }}
        >
          {cta || 'View Products'}
          <ArrowRight size={12} />
        </div>
      </Link>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="What We Offer"
        title="Every print product"
        titleAccent="your brand needs."
        subtitle="From a single business card to a full signage suite — WELLPrint delivers consistent quality at every scale, backed by professional design support."
      />

      <section className="bg-ink-900 py-20 relative overflow-hidden">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(235,224,176,0.5) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(-45deg, rgba(235,224,176,0.5) 0px, transparent 1px, transparent 60px)',
            backgroundSize: '60px 60px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 70} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center">
            <p className="text-ivory-300/50 text-sm mb-5">
              Not sure what you need? Our team is happy to advise.
            </p>
            <Link to="/contact" className="btn-press-ghost">
              Talk to a Print Specialist
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
