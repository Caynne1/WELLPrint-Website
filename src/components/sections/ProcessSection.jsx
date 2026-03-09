import { useEffect, useRef } from 'react'
import { UploadCloud, Settings, Zap, PackageCheck } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    Icon:   UploadCloud,
    title:  'Upload Your Files',
    desc:   'Send us your artwork in PDF, AI, or PSD format — up to 500MB. Our team pre-flights every file before production.',
  },
  {
    number: '02',
    Icon:   Settings,
    title:  'Configure Your Order',
    desc:   'Choose size, stock, finish, and quantity. Our system automatically applies discounts on bulk orders of 6 or more items.',
  },
  {
    number: '03',
    Icon:   Zap,
    title:  'We Go to Press',
    desc:   'Your job is queued, proofed, and printed with CMYK or Pantone precision. Real-time status updates at every step.',
  },
  {
    number: '04',
    Icon:   PackageCheck,
    title:  'Fast Delivery',
    desc:   'Packed with care and shipped directly to your door. Same-day dispatch available for standard digital jobs.',
  },
]

export default function ProcessSection() {
  const refs = useRef([])

  useEffect(() => {
    const observers = refs.current.map((el) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) el.classList.add('visible') },
        { threshold: 0.15 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(obs => obs?.disconnect())
  }, [])

  return (
    <section className="bg-ink-950 py-28 relative overflow-hidden" id="process">
      {/* Decorative rule */}
      <div className="absolute top-0 left-0 right-0">
        <hr className="section-rule" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          ref={el => refs.current[0] = el}
          className="animate-on-scroll mb-20 text-center"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] text-wp-green uppercase block mb-4">
            Our Process
          </span>
          <h2
            className="text-ivory-50"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            }}
          >
            From file to{' '}
            <span className="italic text-wp-green">finished print</span>
            <br />in four steps.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Connecting line — desktop only */}
          <div
            className="hidden lg:block absolute top-[42px] left-[12.5%] right-[12.5%] h-[1px] bg-gradient-to-r from-transparent via-ivory-200/10 to-transparent pointer-events-none"
            aria-hidden="true"
          />

          {STEPS.map(({ number, Icon, title, desc }, i) => (
            <div
              key={number}
              ref={el => refs.current[i + 1] = el}
              className="animate-on-scroll relative flex flex-col items-center text-center px-6 py-10 group"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Step circle */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-ink-800 border border-ivory-200/10 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:border-wp-green/30 group-hover:bg-ink-700">
                  <Icon size={26} className="text-ivory-300/60 group-hover:text-wp-green transition-colors duration-300" />
                </div>
                {/* Step number — floating */}
                <span
                  className="absolute -top-3 -right-3 w-7 h-7 bg-wp-green flex items-center justify-center text-ink-950 font-black font-mono text-xs z-20"
                >
                  {i + 1}
                </span>
              </div>

              <h3
                className="text-ivory-100 text-lg mb-3 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {title}
              </h3>
              <p className="text-sm text-ivory-300/50 leading-relaxed max-w-[220px]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
