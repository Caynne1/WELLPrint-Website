const ITEMS = [
  'Business Cards', 'Digital Printing', 'Signage', 'Large Format',
  'Custom Packaging', 'Booklets & Catalogs', 'Offset Lithography', 'Flyers',
  'Banners', 'Stickers', 'Tarpaulins', 'Layout Design',
  'Business Cards', 'Digital Printing', 'Signage', 'Large Format',
  'Custom Packaging', 'Booklets & Catalogs', 'Offset Lithography', 'Flyers',
  'Banners', 'Stickers', 'Tarpaulins', 'Layout Design',
]

export default function MarqueeStrip() {
  return (
    <div className="bg-wp-green py-3.5 overflow-hidden relative border-y-2 border-ink-950" aria-hidden="true">
      <div className="marquee-track">
        {ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-4 mr-4">
            <span
              className="text-sm font-bold text-wp-black uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ink-950/40 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}