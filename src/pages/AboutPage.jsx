import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import { ArrowRight, Award, Users, Printer, Globe } from 'lucide-react'

/* ── Scroll-reveal hook ── */
function useScrollReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Stat card ── */
function StatCard({ value, label, accent }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className="animate-on-scroll text-center p-6">
      <div className="text-5xl font-black mb-1 leading-none" style={{ fontFamily: "'Playfair Display', serif", color: accent || 'var(--wp-green)' }}>
        {value}
      </div>
      <div className="text-ivory-300/50 text-xs font-mono tracking-widest uppercase">{label}</div>
    </div>
  )
}

/* ── Value card ── */
function ValueCard({ icon: Icon, title, body, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className="animate-on-scroll card-press p-8 group" style={{ transitionDelay: `${delay}ms` }}>
      <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-5"
        style={{ background: 'rgba(45,176,75,0.10)', border: '1px solid rgba(45,176,75,0.2)' }}>
        <Icon size={22} style={{ color: 'var(--wp-green)' }} />
      </div>
      <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{title}</h3>
      <p className="text-ivory-300/55 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

export default function AboutPage() {
  const storyRef1 = useScrollReveal()
  const storyRef2 = useScrollReveal()
  const storyRef3 = useScrollReveal()
  const chairRef  = useScrollReveal()
  const missionRef = useScrollReveal()

  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        label="Who We Are"
        title="The Printing Arm of"
        titleAccent="Espiel-Bereso Group"
        subtitle="WELLPRINT was established to serve the printing needs of WELLife and has since grown into a comprehensive printing service provider. As a subsidiary of Bereso Group of Companies, we combine institutional backing with agile, client-first service delivery."
      />

      {/* ── Stats strip ── */}
      <section className="bg-ink-800 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
          <StatCard value="15+" label="Years in Print" />
          <StatCard value="5K+" label="Clients Served" accent="var(--wp-cyan)" />
          <StatCard value="99%" label="On-Time Delivery" accent="var(--wp-yellow)" />
          <StatCard value="ISO" label="Certified Quality" accent="var(--wp-magenta)" />
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-24 bg-ink-900">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-wp-green" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-wp-green">Our Story</span>
            </div>

            <h2 ref={storyRef1} className="animate-on-scroll text-white mb-6 leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              From Internal Division<br />to Industry Leader
            </h2>

            <p ref={storyRef2} className="animate-on-scroll text-ivory-300/60 leading-relaxed mb-5">
              WELLPRINT started as an internal printing division, handling the marketing materials, packaging,
              and promotional items for WELLife. The quality and efficiency of our operations quickly caught
              the attention of partner businesses and clients.
            </p>

            <p ref={storyRef3} className="animate-on-scroll text-ivory-300/60 leading-relaxed mb-8">
              Recognizing the opportunity to serve a broader market, Bereso Group invested in expanding
              WELLPRINT's capabilities — upgrading equipment, hiring skilled technicians, and adopting
              industry-leading color management systems. Today, we serve businesses across industries
              with the same precision and dedication that defined our earliest work.
            </p>

            <Link to="/services" className="btn-press-outline inline-flex items-center gap-2 text-sm">
              Explore Our Services <ArrowRight size={15} />
            </Link>
          </div>

          {/* Decorative image panel */}
          <div className="relative">
            {/* Main image placeholder */}
            <div className="relative rounded-sm overflow-hidden bg-ink-700 border border-white/[0.08]"
              style={{ aspectRatio: '4/3' }}>
              <img
                src="/images/press-room.jpg"
                alt="WELLPrint Press Room"
                className="w-full h-full object-cover"
              />
              {/* Corner accent */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-wp-green/60" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-wp-green/60" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-5 bg-ink-950 border border-white/[0.10] px-5 py-4 rounded-sm shadow-press">
              <div className="text-2xl font-black text-wp-green" style={{ fontFamily: "'Playfair Display', serif" }}>2010</div>
              <div className="text-ivory-300/40 text-[10px] font-mono tracking-widest uppercase">Founded</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 bg-ink-950 relative overflow-hidden">
        {/* BG accent */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(45,176,75,0.04) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div ref={missionRef} className="animate-on-scroll">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-wp-green" />
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-wp-green">Mission & Vision</span>
            </div>
            <h2 className="text-white mb-8 leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              Print That Moves <span className="italic" style={{ color: 'var(--wp-green)' }}>Business</span> Forward
            </h2>
            {/* Mission block */}
            <div className="mb-6 pl-5 border-l-2 border-wp-green/40">
              <div className="font-mono text-[10px] tracking-widest uppercase text-wp-green/80 mb-1">Mission</div>
              <p className="text-ivory-300/70 leading-relaxed text-sm">
                To deliver precision-crafted print solutions that amplify our clients' brand presence —
                on time, on budget, and beyond expectation.
              </p>
            </div>
            {/* Vision block */}
            <div className="pl-5 border-l-2 border-wp-cyan/40">
              <div className="font-mono text-[10px] tracking-widest uppercase text-wp-cyan/80 mb-1">Vision</div>
              <p className="text-ivory-300/70 leading-relaxed text-sm">
                To be the most trusted commercial printing partner in the region — recognized for
                quality, reliability, and a commitment to sustainable practices.
              </p>
            </div>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-1 gap-4">
            <ValueCard icon={Award} title="Quality Without Compromise"
              body="Every print run is held to exacting standards. We don't ship anything we wouldn't proudly put our name on."
              delay={0} />
            <ValueCard icon={Users} title="Client-First Delivery"
              body="From brief to finished product, our team stays in step with your timeline, your specs, and your vision."
              delay={100} />
            <ValueCard icon={Globe} title="Institutional Backing"
              body="As part of Bereso Group of Companies, WELLPRINT brings the stability and infrastructure of a trusted conglomerate."
              delay={200} />
          </div>
        </div>
      </section>

      {/* ── Chairman's Message ── */}
      <section className="py-24 bg-ink-900 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-wp-green">Leadership</span>
          </div>

          <div className="grid md:grid-cols-5 gap-12 items-start">

            {/* Photo placeholder */}
            <div ref={chairRef} className="animate-on-scroll md:col-span-2">
              <div className="relative rounded-sm overflow-hidden bg-ink-700 border border-white/[0.08]"
                style={{ aspectRatio: '3/4' }}>
                <img
                  src="/images/chairman.jpg"
                  alt="Chairman, WELLPrint"
                  className="w-full h-full object-cover"
                />
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-wp-yellow/50" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-wp-yellow/50" />
              </div>

              {/* Name plate */}
              <div className="mt-4 p-4 bg-ink-800 border border-white/[0.07] rounded-sm">
                <div className="text-white font-bold text-lg mb-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Engr. Eglesciano "Boboy" Bereso
                </div>
                <div className="text-ivory-300/40 text-xs font-mono tracking-wider uppercase">
                  Chairman, WELLPRINT
                </div>
                <div className="text-ivory-300/30 text-xs font-mono tracking-wider">
                  Bereso Group of Companies
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <h2 className="text-white mb-8 leading-snug"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                A Message from <span className="italic" style={{ color: 'var(--wp-yellow)' }}>Our Chairman</span>
              </h2>

              {/* Large opening quote mark */}
              <div className="text-8xl leading-none mb-4 -ml-1 select-none"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--wp-green)', opacity: 0.25 }}>
                "
              </div>

              <div className="space-y-5 text-ivory-300/65 leading-relaxed text-[0.97rem]">
                <p>
                  WELLPRINT was born out of a need — but it grew because of a conviction.
                  The conviction that printing, done right, is not just a service but a craft.
                  A craft that demands precision, care, and an unrelenting eye for detail.
                </p>
                <p>
                  When Bereso Group made the decision to formalize and expand our printing operations,
                  we did so with a clear mandate: to serve not just WELLife, but every business that
                  values quality communications. We invested in technology, in people, and in process —
                  because our clients deserve nothing less.
                </p>
                <p>
                  Today, I am proud of what our team has built. Every brochure, every banner,
                  every packaging run is a reflection of our commitment to excellence. We don't
                  just print — we deliver confidence.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/[0.07]" />
                <div className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30">
                  Espiel-Bereso Group
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Parent Company ── */}
      <section className="py-20 bg-ink-800 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-wp-green">Part of a Larger Family</span>
            <div className="h-px w-8 bg-wp-green" />
          </div>

          <h2 className="text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            A Subsidiary of <span className="italic" style={{ color: 'var(--wp-green)' }}>Bereso Group</span>
          </h2>
          <p className="text-ivory-300/50 max-w-2xl mx-auto text-sm leading-relaxed mb-10">
            Bereso Group of Companies is a diversified conglomerate with interests in healthcare,
            retail, distribution, and services. WELLPRINT benefits from the group's infrastructure,
            financial strength, and shared commitment to operational excellence.
          </p>

          {/* Sibling brands */}
          <div className="flex flex-wrap justify-center gap-4">
            {['WELLife', 'Bereso Group', 'WELLPrint'].map((brand, i) => (
              <div key={brand} className="px-6 py-3 bg-ink-900 border border-white/[0.08] rounded-sm font-mono text-xs tracking-widest uppercase"
                style={{ color: i === 2 ? 'var(--wp-green)' : 'var(--ivory-300, #D8D8D8)', opacity: i === 2 ? 1 : 0.45 }}>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-ink-950 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
            Ready to Work With Us?
          </h2>
          <p className="text-ivory-300/50 mb-8 text-sm">
            Let's talk about your next print project. Our team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-press inline-flex items-center gap-2">
              Get in Touch <ArrowRight size={15} />
            </Link>
            <Link to="/services" className="btn-press-ghost inline-flex items-center gap-2">
              Our Services
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}