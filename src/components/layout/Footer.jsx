import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ArrowUpRight } from 'lucide-react'

const SERVICES = [
  { label: 'Business Cards',    href: '/products?cat=business-cards' },
  { label: 'Flyers & Leaflets', href: '/products?cat=flyers' },
  { label: 'Banners & Signage', href: '/products?cat=banners' },
  { label: 'Brochures',         href: '/products?cat=brochures' },
  { label: 'Custom Packaging',  href: '/products?cat=packaging' },
  { label: 'Offset Printing',   href: '/products?cat=offset' },
]
const COMPANY = [
  { label: 'About WellPrint',   href: '/about' },
  { label: 'Our Process',       href: '/about#process' },
  { label: 'Quality Promise',   href: '/about#quality' },
  { label: 'Careers',           href: '/careers' },
  { label: 'Blog',              href: '/blog' },
]
const SUPPORT = [
  { label: 'Track Your Order',  href: '/track' },
  { label: 'File Specifications', href: '/file-specs' },
  { label: 'FAQs',              href: '/faq' },
  { label: 'Terms of Service',  href: '/terms' },
  { label: 'Privacy Policy',    href: '/privacy' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-ink-950 border-t border-white/[0.07] pt-20 pb-10 relative overflow-hidden">
      {/* Decorative faded logo watermark */}
      <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none select-none" aria-hidden="true">
        <img src="/logo.png" alt="" className="w-80 h-80 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="block mb-6 w-fit">
              <img src="/logo.png" alt="WellPrint" className="h-14 w-auto object-contain" />
            </Link>

            <p className="text-ivory-300/55 text-sm leading-relaxed mb-6 max-w-xs">
              Precision printing for businesses, creatives, and brands that demand nothing less than exceptional quality.
            </p>

            {/* CMYK bar */}
            <div className="cmyk-bar mb-6 rounded-full" />

            <ul className="space-y-3 mb-8">
              {[
                { Icon: Mail,    text: 'hello@wellprint.com',   href: 'mailto:hello@wellprint.com' },
                { Icon: Phone,   text: '+1 (800) 555-PRINT',    href: 'tel:+18005557746' },
                { Icon: MapPin,  text: '123 Press Lane, New York, NY 10001', href: null },
              ].map(({ Icon, text, href }) => (
                <li key={text}>
                  {href ? (
                    <a href={href} className="flex items-start gap-2.5 text-sm text-ivory-300/60 hover:text-wp-green transition-colors group">
                      <Icon size={14} className="mt-0.5 flex-shrink-0 text-wp-green/60 group-hover:text-wp-green transition-colors" />
                      {text}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 text-sm text-ivory-300/60">
                      <Icon size={14} className="mt-0.5 flex-shrink-0 text-wp-green/60" />
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook,  href: '#', label: 'Facebook' },
                { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-ivory-300/50 hover:text-white hover:border-wp-green/50 hover:bg-wp-green/10 transition-all duration-200 rounded-sm">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Services', links: SERVICES },
            { title: 'Company',  links: COMPANY },
            { title: 'Support',  links: SUPPORT },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase mb-5" style={{ color: 'var(--wp-green)' }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-ivory-300/55 hover:text-white transition-colors duration-200 flex items-center gap-1 group w-fit">
                      {label}
                      <ArrowUpRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border border-white/[0.08] bg-ink-800/50 p-6 md:p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-sm">
          <div>
            <h4 className="text-white text-lg mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Stay in the loop
            </h4>
            <p className="text-sm text-ivory-300/55">Deals, new products, and print tips — no spam.</p>
          </div>
          <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="your@email.com"
              className="bg-ink-900 border border-white/[0.12] text-white placeholder:text-ivory-300/25 text-sm px-4 py-2.5 flex-1 md:w-64 focus:outline-none focus:border-wp-green/50 transition-colors font-mono rounded-none" />
            <button type="submit"
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap transition-colors duration-200 rounded-none"
              style={{ background: 'var(--wp-green)' }}
              onMouseEnter={e => e.target.style.background = 'var(--wp-green-lt)'}
              onMouseLeave={e => e.target.style.background = 'var(--wp-green)'}>
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <hr className="section-rule mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ivory-300/25 font-mono tracking-wider">
            © {year} WellPrint, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="badge badge-green">ISO 9001 Certified</span>
            <span className="text-xs text-ivory-300/25 font-mono">Secure checkout · 256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
