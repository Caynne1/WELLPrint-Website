const ITEMS = [
  'Business Cards',
  'Digital Printing',
  'Signage',
  'Large Format',
  'Custom Packaging',
  'Booklets & Catalogs',
  'Offset Lithography',
  'Flyers',
  'Banners',
  'Stickers',
  'Tarpaulins',
  'Layout Design',
  'Business Cards',
  'Digital Printing',
  'Signage',
  'Large Format',
  'Custom Packaging',
  'Booklets & Catalogs',
  'Offset Lithography',
  'Flyers',
  'Banners',
  'Stickers',
  'Tarpaulins',
  'Layout Design',
]

export default function MarqueeStrip() {
  return (
    <section
      className="relative z-20 w-full overflow-hidden"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}
      aria-hidden="true"
    >
      <div className="h-12 flex items-center overflow-hidden">
        <div className="marquee-track px-4">
          {ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-4 mr-8 flex-shrink-0"
            >
              <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.18em] whitespace-nowrap font-body" style={{ color: 'var(--wp-green)' }}>
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--wp-green)', opacity: 0.4 }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}