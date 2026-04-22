import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f3fbf6_100%)] py-20 md:py-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-[8%] w-72 h-72 rounded-full bg-wp-green/[0.07] blur-[90px]" />
        <div className="absolute bottom-0 right-[10%] w-80 h-80 rounded-full bg-wp-cyan/[0.08] blur-[110px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="rounded-[28px] border border-emerald-100 bg-white/85 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.08)] px-8 py-12 md:px-12 md:py-14 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-700 font-body mb-4">
            WELLPrint
          </p>

          <h2
            className="text-ink-900 mb-5 leading-tight"
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.4rem)',
            }}
          >
            Ready to print?
          </h2>

          <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed font-body mb-8">
            Start your order today and get polished prints for your business,
            event, or brand with a smoother ordering experience.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/products" className="btn-press group">
              Order Now
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <Link to="/contact" className="btn-press-ghost">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}