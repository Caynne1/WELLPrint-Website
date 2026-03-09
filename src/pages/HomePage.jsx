import HeroSection       from '../components/sections/HeroSection'
import MarqueeStrip      from '../components/sections/MarqueeStrip'
import ServicesSection   from '../components/sections/ServicesSection'
import ProcessSection    from '../components/sections/ProcessSection'
import SocialProofSection from '../components/sections/SocialProofSection'
import CTASection        from '../components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <ServicesSection />
      <ProcessSection />
      <SocialProofSection />
      <CTASection />
    </>
  )
}
