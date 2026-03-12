import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Layers, Printer, Maximize, Package, BookOpen,
  CreditCard, ArrowRight, MonitorPlay, PenTool,
  FileText, Flag, Sticker,
} from 'lucide-react'
import PageHero from '../components/ui/PageHero'

// Alternating border colors using CMYK brand palette
const BORDER_COLORS = [
  'var(--wp-green)',  // Cyan-ish green
  '#C8341A',          // Magenta-red
  '#D4810A',          // Yellow-amber
  '#29ABE2',          // Cyan blue
  'var(--wp-green)',
  '#C8341A',
  '#D4810A',
  '#29ABE2',
  'var(--wp-green)',
  '#C8341A',
  '#D4810A',
]

const SERVICES = [
  {
    Icon:   CreditCard,
    title:  'Business Cards',
    desc:   'First impressions in 350gsm. Matte, gloss, spot UV, foil, or letterpress finishes — your card, your identity.',
    tag:    'Most Popular',
    href:   '/products?cat=business-cards',
    accent: 'var(--wp-green)',
  },
  {
    Icon:   Printer,
    title:  'Digital Printing',
    desc:   'Fast, full-colour printing for any quantity — from short runs to bulk orders. CMYK precision on every sheet with quick turnaround.',
    tag:    '48hr Ready',
    href:   '/products?cat=digital',
    accent: '#C8341A',
  },
  {
    Icon:   Layers,
    title:  'Offset Lithography',
    desc:   'Industrial-scale runs with unmatched colour consistency and Pantone matching. The gold standard for high-volume print jobs.',
    tag:    'High Volume',
    href:   '/products?cat=offset',
    accent: '#4A5568',
  },
  {
    Icon:   Maximize,
    title:  'Large Format',
    desc:   'Posters, trade show displays, and oversized prints up to 5m wide at 1440dpi clarity. Bold visuals that command attention.',
    tag:    'Up to 5m',
    href:   '/products?cat=large-format',
    accent: '#D4810A',
  },
  {
    Icon:   Package,
    title:  'Custom Packaging',
    desc:   'Boxes, bags, and mailers designed to make unboxing as memorable as the product inside. Fully customisable shapes and finishes.',
    tag:    'Brand Ready',
    href:   '/products?cat=packaging',
    accent: 'var(--wp-green)',
  },
  {
    Icon:   BookOpen,
    title:  'Booklets & Catalogs',
    desc:   'Saddle-stitched, perfect-bound, or spiral-bound. From product lookbooks to company annual reports, we bind them all.',
    tag:    'Custom Sizes',
    href:   '/products?cat=booklets',
    accent: '#C8341A',
  },
  {
    Icon:   MonitorPlay,
    title:  'Signage',
    desc:   'Indoor and outdoor signage solutions — from retail displays and wayfinding systems to event standees and store signs built to last.',
    tag:    'Indoor & Outdoor',
    href:   '/products?cat=signage',
    accent: '#D4810A',
    id:     'signage',
  },
  {
    Icon:   FileText,
    title:  'Flyers & Leaflets',
    desc:   'Eye-catching flyers and leaflets for promotions, events, and campaigns. Available in various sizes with single or double-sided printing.',
    tag:    'Fast Turnaround',
    href:   '/products?cat=flyers',
    accent: 'var(--wp-green)',
    id:     'flyers',
  },
  {
    Icon:   Flag,
    title:  'Banners',
    desc:   'Vinyl, fabric, and mesh banners for events, storefronts, and trade shows. Weatherproof options available for long-term outdoor use.',
    tag:    'Event Ready',
    href:   '/products?cat=banners',
    accent: '#4A5568',
    id:     'banners',
  },
  {
    Icon:   Sticker,
    title:  'Stickers',
    desc:   'Die-cut, sheet, or roll stickers in any shape and size. Perfect for product labels, packaging seals, branding, and promotional giveaways.',
    tag:    'Any Shape',
    href:   '/products?cat=stickers',
    accent: '#C8341A',
    id:     'stickers',
  },
  {
    Icon:   PenTool,
    title:  'Professional Layout Design',
    desc:   'Expert design services to craft print-ready artwork, structured layouts, and brand-consistent collateral that truly stands out.',
    tag:    'Design Service',
    href:   '/contact',
    accent: 'var(--wp-green)',
    id:     'layout-design',
    cta:    'Get a Quote',
  },
]

function ServiceCard({ Icon, title, desc, tag, href, accent, borderColor, delay, id, cta }) {
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
      style={{
        transitionDelay: `${delay}ms`,
        border: `1px solid ${borderColor}40`,
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${borderColor}90`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${borderColor}40`}
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
              <ServiceCard key={s.title} {...s} borderColor={BORDER_COLORS[i]} delay={i * 70} />
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