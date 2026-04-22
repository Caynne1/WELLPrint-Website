import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const onScroll = () => {
      const y = window.scrollY
      el.style.transform = `translateY(${y * 0.08}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative min-h-[88vh] overflow-hidden flex flex-col bg-white">
      <div
        ref={heroRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfa_42%,#edf8f3_68%,#e9f4fb_100%)]" />

        <div className="absolute top-[-10%] left-[-8%] w-[38rem] h-[38rem] rounded-full bg-wp-green/[0.08] blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-8%] w-[34rem] h-[34rem] rounded-full bg-wp-cyan/[0.10] blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(15,23,42,0.06) 0px, transparent 1px, transparent 84px), repeating-linear-gradient(90deg, rgba(15,23,42,0.06) 0px, transparent 1px, transparent 84px)',
            backgroundSize: '84px 84px',
          }}
        />

        <div className="absolute right-[-2%] top-[6%] opacity-[0.035] select-none overflow-hidden">
          <span
            className="text-[34vw] leading-none text-ink-900"
            style={{ fontFamily: "'Lora', serif", fontWeight: 700 }}
          >
            W
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pt-16 md:pt-20 pb-24">
        <div className="max-w-4xl text-center">
          <h1
            className="text-ink-900 leading-[0.92] mb-8"
            style={{
              fontFamily: "'Lora', serif",
              fontWeight: 800,
              fontSize: 'clamp(3.2rem, 8vw, 7rem)',
              animation: 'fadeUp 0.7s ease 0.15s both',
            }}
          >
            Print.{' '}
            <span style={{ fontStyle: 'italic' }}>
              Precisely.
            </span>
            <br />
            <span className="relative inline-block text-wp-green">
              Beautifully.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 400 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 5 C80 2, 200 7, 398 4"
                  stroke="var(--wp-green)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: 600,
                    strokeDashoffset: 600,
                    animation: 'lineDraw 1.4s ease 0.7s forwards',
                  }}
                />
              </svg>
            </span>
          </h1>

          <p
            className="mx-auto max-w-3xl text-base md:text-xl leading-relaxed text-slate-700 font-body"
            style={{ animation: 'fadeUp 0.7s ease 0.3s both' }}
          >
            From business cards to large-format banners, WELLPrint delivers polished
            print results with a smoother ordering experience for businesses,
            events, and everyday brand needs.
          </p>
        </div>
      </div>

      <div
        className="relative z-10 flex justify-center pb-10"
        style={{ animation: 'fadeIn 1s ease 1s both' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.22em] uppercase text-slate-500 font-body">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-wp-green to-transparent" />
        </div>
      </div>
    </section>
  )
}