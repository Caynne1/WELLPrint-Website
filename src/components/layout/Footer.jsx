import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Facebook,
  Clock,
  Printer,
} from 'lucide-react'

const YEAR = new Date().getFullYear()

const QUICK_LINKS = [
  { label: 'About Us',     to: '/about' },
  { label: 'Services',     to: '/services' },
  { label: 'Products',     to: '/products' },
  { label: 'Contact',      to: '/contact' },
]

const CUSTOMER_LINKS = [
  { label: 'Track Order',       to: '/track-order' },
  { label: 'Shopping Cart',     to: '/cart' },
  { label: 'FAQs',              to: '/faq' },
  { label: 'File Specs',        to: '/file-specs' },
]

const SERVICES = [
  'Digital Printing',
  'Offset Printing',
  'Tarpaulin & Banners',
  'Packaging & Labels',
]

export default function Footer() {
  return (
    <footer className="relative" style={{ background: '#080f1c' }}>
      {/* CMYK strip */}
      <div className="cmyk-bar" aria-hidden="true" />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-8">

          {/* ── Brand column ────────────────────────────────── */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'rgba(22,163,74,0.12)',
                  border: '1px solid rgba(22,163,74,0.20)',
                }}
              >
                <Printer size={18} style={{ color: '#16a34a' }} />
              </div>
              <div>
                <span
                  className="text-white text-lg font-bold tracking-tight block leading-none"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  WELLPrint
                </span>
                <span
                  className="text-[9px] uppercase tracking-[0.18em] font-semibold block mt-0.5"
                  style={{ color: '#1993D2' }}
                >
                  EBGC
                </span>
              </div>
            </Link>

            <p
              className="text-sm leading-relaxed mb-6 max-w-xs"
              style={{ color: 'rgba(148,163,184,0.65)' }}
            >
              Your trusted partner for commercial printing — from business cards
              to large-format banners. Quality you can see, service you can count on.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:wellprint.6972@gmail.com"
                className="flex items-center gap-3 text-sm transition-colors group"
                style={{ color: 'rgba(148,163,184,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#1993D2')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.55)')}
              >
                <Mail size={14} className="shrink-0" style={{ color: '#1993D2' }} />
                wellprint.6972@gmail.com
              </a>

              <a
                href="0920 578 5304"
                className="flex items-center gap-3 text-sm transition-colors"
                style={{ color: 'rgba(148,163,184,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.55)')}
              >
                <Phone size={14} className="shrink-0" style={{ color: '#16a34a' }} />               
                0920 578 5304
              </a>

              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(148,163,184,0.55)' }}
              >
                <MapPin size={14} className="shrink-0" style={{ color: '#fdc010' }} />
                Ormoc City, Philippines, 6541
              </div>

              <div
                className="flex items-center gap-3 text-sm"
                style={{ color: 'rgba(148,163,184,0.45)' }}
              >
                <Clock size={14} className="shrink-0" style={{ color: 'rgba(148,163,184,0.35)' }} />
                Mon–Fri 8AM–6PM · Sat 9AM–1PM
              </div>
            </div>
          </div>

          {/* ── Quick Links ─────────────────────────────────── */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(148,163,184,0.45)' }}
            >
              Company
            </h4>

            <ul className="space-y-3">
              {QUICK_LINKS.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors inline-flex items-center gap-1 group"
                    style={{ color: 'rgba(248,250,252,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Customer Links ──────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(148,163,184,0.45)' }}
            >
              Customer
            </h4>

            <ul className="space-y-3">
              {CUSTOMER_LINKS.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors inline-flex items-center gap-1"
                    style={{ color: 'rgba(248,250,252,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h4
              className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
              style={{ color: 'rgba(148,163,184,0.45)' }}
            >
              Services
            </h4>

            <ul className="space-y-3">
              {SERVICES.map(service => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-sm transition-colors"
                    style={{ color: 'rgba(248,250,252,0.55)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.55)')}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────── */}
        <div
          className="mt-14 mb-8 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.15), transparent)',
          }}
        />

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-center sm:text-left"
            style={{ color: 'rgba(148,163,184,0.35)' }}
          >
            &copy; {YEAR} WELLPrint · Espiel-Bereso Group of Companies.
            All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/wellprintormoc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(148,163,184,0.5)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(25,147,210,0.12)'
                e.currentTarget.style.borderColor = 'rgba(25,147,210,0.25)'
                e.currentTarget.style.color = '#1993D2'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = 'rgba(148,163,184,0.5)'
              }}
            >
              <Facebook size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}