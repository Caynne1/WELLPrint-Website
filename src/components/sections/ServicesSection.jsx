import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Printer, Maximize, Package, BookOpen, CreditCard, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    Icon:     CreditCard,
    title:    'Business Cards',
    desc:     'First impressions in 350gsm. Matte, gloss, spot UV, foil, or letterpress finishes.',
    tag:      'Most Popular',
    href:     '/products?cat=business-cards',
    accent:   'var(--wp-green)',
  },
  {
    Icon:     Printer,
    title:    'Digital Printing',
    desc:     'Fast turnaround for flyers, leaflets, and promotional materials. CMYK precision.',
    tag:      '48hr Ready',
    href:     '/products?cat=digital',
    accent:   '#C8341A',
  },
  {
    Icon:     Layers,
    title:    'Offset Lithography',
    desc:     'Industrial-scale runs with unmatched colour consistency and Pantone matching.',
    tag:      'High Volume',
    href:     '/products?cat=offset',
    accent:   '#4A5568',
  },
  {
    Icon:     Maximize,
    title:    'Large Format',
    desc:     'Banners, posters, and trade show displays printed up to 5m wide at 1440dpi.',
    tag:      'Up to 5m',
    href:     '/products?cat=large-format',
    accent:   '#D4810A',
  },
  {
    Icon:     Package,
    title:    'Custom Packaging',
    desc:     'Boxes, bags, and mailers that make unboxing as memorable as the product.',
    tag:      'Brand Ready',
    href:     '/products?cat=packaging',
    accent:   'var(--wp-green)',
  },
  {
    Icon:     BookOpen,
    title:    'Booklets & Catalogs',
    desc:     'Saddle-stitched, perfect-bound, or spiral. From lookbooks to annual reports.',
    tag:      'Custom Sizes',
    href:     '/products?cat=booklets',
    accent:   '#C8341A',
  },
]

function ServiceCard({ Icon, title, desc, tag, href, accent, delay }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
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
          className="w-11 h-11 flex items-center justify-center mb-5 border border-ivory-200/10 transition-all duration-300 group-hover:border-opacity-40"
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
          View Products
          <ArrowRight size={12} />
        </div>
      </Link>
    </div>
  )
}

export default function ServicesSection() {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="bg-ink-900 py-28 relative overflow-hidden" id="services">
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
        {/* Section header */}
        <div ref={titleRef} className="animate-on-scroll mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-12 bg-wp-green" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-wp-green uppercase">
              What We Offer
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2
              className="text-ivory-50 leading-tight max-w-lg"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              }}
            >
              Every print product
              <br />
              <span className="italic text-wp-green">your brand needs.</span>
            </h2>
            <p className="text-ivory-300/55 max-w-xs text-sm leading-relaxed md:text-right">
              Whether you need 50 cards or 50,000 catalogues, our press delivers the same uncompromising quality.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.title} {...s} delay={i * 80} />
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Link to="/products" className="btn-press-ghost">
            View All Products & Pricing
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
