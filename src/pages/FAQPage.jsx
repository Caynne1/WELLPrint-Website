import usePageTitle from '../hooks/usePageTitle'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, MessageSquare, ArrowRight } from 'lucide-react'
import PageHero from '../components/ui/PageHero'
import { useTheme } from '../context/ThemeContext'

const FAQS = [
  {
    category: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Browse our Products page, add items to your cart with your chosen options, then proceed to checkout. You will fill in your contact details and can attach a reference file. Our team will confirm and begin production after reviewing your files.',
      },
      {
        q: 'Can I order without a ready design?',
        a: 'Yes! Select "Layout Design" as your design option when adding a product to your cart. Our in-house designers will create print-ready artwork based on your brief. A design fee applies — contact us for a quote.',
      },
      {
        q: 'What is a "Request a Quote" order type?',
        a: 'For non-standard jobs, large volumes, or custom specifications, select "Request a Quote" during checkout. One of our staff will review your request and send a formal quotation within 1 business day.',
      },
      {
        q: 'Can I get a physical press proof before full production?',
        a: 'Yes — a press proof can be arranged for an additional fee. Please mention this in the notes field at checkout or contact us before placing your order. Digital proofs (PDF) are included free of charge.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept bank transfer (BDO, BPI, UnionBank), GCash, Maya, and cash on pickup. Payment details are provided after your order is confirmed. Full payment is required before production begins.',
      },
    ],
  },
  {
    category: 'Files & Artwork',
    items: [
      {
        q: 'What file formats do you accept?',
        a: 'We accept PDF (preferred), AI, EPS, PSD, TIFF, and PNG. Files must be at 300dpi or higher, in CMYK colour mode, with a 3mm bleed on all sides. Fonts must be outlined or embedded.',
      },
      {
        q: 'What is "bleed" and why do I need it?',
        a: 'Bleed is the extra artwork that extends beyond the trim edge of your document. It ensures no white borders appear after cutting. Set your bleed to 3mm on all sides and keep important content (text, logos) at least 3mm inside the trim line.',
      },
      {
        q: 'What colour mode should I use?',
        a: 'Always use CMYK for print. RGB files submitted for print will be automatically converted, which can cause colour shifts — especially with reds, oranges, and purples. For Pantone colour matching, please specify the Pantone codes in your order notes.',
      },
      {
        q: 'What is the maximum file size I can upload?',
        a: 'You can upload files up to 20MB directly through the website. For larger files (up to 500MB), please contact us and we will provide a cloud upload link via Google Drive or WeTransfer.',
      },
      {
        q: 'Do you check my files before printing?',
        a: 'Yes. Every file goes through a preflight check covering resolution, bleed, colour mode, and trim marks. If we spot an issue, we will contact you before proceeding. We do not print files that fall below our quality standards.',
      },
    ],
  },
  {
    category: 'Turnaround & Delivery',
    items: [
      {
        q: 'How long does production take?',
        a: 'Standard digital jobs are ready in 1–3 business days. Offset lithography, custom packaging, and specialty finishing take 5–10 business days. Rush production (same-day or next-day) is available for select products — add "Rush Order" as the order type.',
      },
      {
        q: 'Do you offer delivery?',
        a: 'Yes. We deliver within Cebu City and to nearby municipalities. Delivery fees are calculated at checkout based on your location. You can also pick up your order from our shop at no extra charge.',
      },
      {
        q: 'How do I track my order?',
        a: 'After placing your order you will receive a reference number. Visit our Track Order page and enter your reference number or the email address you used at checkout to see real-time status updates.',
      },
      {
        q: 'What if my order is delayed?',
        a: 'We will proactively notify you if your order is running behind schedule. You can also reach us directly via the Contact page or send a message from the Track Order page using your order reference.',
      },
    ],
  },
  {
    category: 'Quality & Reprints',
    items: [
      {
        q: 'What if I am not happy with the print quality?',
        a: 'Customer satisfaction is our priority. If your printed items arrive with a manufacturing defect or do not match the approved proof, contact us within 3 days of receiving your order and we will reprint at no cost. Please keep the defective items for inspection.',
      },
      {
        q: 'Are reprints available if I need more copies later?',
        a: 'Yes. We archive approved artwork files for up to 12 months. Simply contact us with your order reference and quantity and we will re-run the same job. Pricing will be based on current rates at the time of reorder.',
      },
      {
        q: 'Can colours vary between print runs?',
        a: 'Minor variations can occur between runs due to the nature of commercial printing. If exact colour matching is critical (e.g., brand guidelines), please specify Pantone codes or request a press proof.',
      },
    ],
  },
]

function Accordion({ q, a, isOpen, onToggle, borderColor }) {
  return (
    <div
      className="border-b transition-colors duration-200"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className="text-sm font-semibold leading-snug pr-2"
          style={{ color: isOpen ? 'var(--wp-green)' : 'var(--text-primary)' }}
        >
          {q}
        </span>
        <ChevronDown
          size={16}
          className="flex-shrink-0 mt-0.5 transition-transform duration-300"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: isOpen ? 'var(--wp-green)' : 'var(--text-muted)',
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: isOpen ? '400px' : '0' }}
      >
        <p
          className="text-sm leading-relaxed pb-5 pr-8 font-body"
          style={{ color: 'var(--text-secondary)' }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  usePageTitle('FAQs')
  const { theme } = useTheme()
  const [openKey, setOpenKey] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = FAQS.map(f => f.category)
  const filtered = activeCategory
    ? FAQS.filter(f => f.category === activeCategory)
    : FAQS

  const toggle = (key) => setOpenKey(prev => prev === key ? null : key)

  return (
    <div style={{ background: 'var(--surface-page)' }}>
      <PageHero
        label="Help Center"
        title="Frequently Asked"
        titleAccent="Questions"
        subtitle="Everything you need to know about ordering, files, turnaround times, and print quality at WELLPrint."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className="px-4 py-2 rounded-full text-xs font-semibold font-body tracking-wide transition-all duration-200"
            style={{
              background: !activeCategory ? 'var(--wp-green)' : 'var(--surface-raised)',
              color: !activeCategory ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${!activeCategory ? 'var(--wp-green)' : 'var(--border-subtle)'}`,
            }}
          >
            All Topics
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className="px-4 py-2 rounded-full text-xs font-semibold font-body tracking-wide transition-all duration-200"
              style={{
                background: activeCategory === cat ? 'var(--wp-green)' : 'var(--surface-raised)',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeCategory === cat ? 'var(--wp-green)' : 'var(--border-subtle)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion sections */}
        <div className="space-y-10">
          {filtered.map(section => (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-6 bg-wp-green" />
                <h2
                  className="text-xs font-bold uppercase tracking-[0.2em] font-body"
                  style={{ color: 'var(--wp-green)' }}
                >
                  {section.category}
                </h2>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="px-6">
                  {section.items.map((item, i) => {
                    const key = `${section.category}-${i}`
                    return (
                      <Accordion
                        key={key}
                        q={item.q}
                        a={item.a}
                        isOpen={openKey === key}
                        onToggle={() => toggle(key)}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div
          className="mt-16 rounded-2xl p-8 text-center"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(19,161,80,0.12)' }}
          >
            <MessageSquare size={22} style={{ color: 'var(--wp-green)' }} />
          </div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "'Lora', serif", color: 'var(--text-primary)' }}
          >
            Still have questions?
          </h3>
          <p className="text-sm font-body mb-6" style={{ color: 'var(--text-secondary)' }}>
            Our team is happy to help with custom jobs, technical questions, or anything not covered here.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-press group">
              Contact Us
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link to="/track-order" className="btn-press-ghost">
              Track My Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}