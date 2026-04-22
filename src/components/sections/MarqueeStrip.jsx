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
      className="relative z-20 w-full bg-white border-y border-emerald-100 overflow-hidden"
      aria-hidden="true"
    >
      <div className="h-12 flex items-center overflow-hidden">
        <div className="marquee-track px-4">
          {ITEMS.map((item, i) => (
            <span
<<<<<<< HEAD
              key={i}
              className="flex items-center gap-4 mr-8 flex-shrink-0"
=======
              className="text-sm font-bold text-wp-black uppercase tracking-widest whitespace-nowrap"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
>>>>>>> a5d91e36c677cee500593d29c92d9ae63d16399d
            >
              <span className="text-[11px] md:text-xs font-semibold text-emerald-700 uppercase tracking-[0.18em] whitespace-nowrap font-body">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}