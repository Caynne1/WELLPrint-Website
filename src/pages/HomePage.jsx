import HeroSection              from '../components/sections/HeroSection'
import MarqueeStrip             from '../components/sections/MarqueeStrip'
import FeaturedProductsSection  from '../components/sections/FeaturedProductsSection'
import ProcessSection           from '../components/sections/ProcessSection'
import SocialProofSection       from '../components/sections/SocialProofSection'
import CTASection               from '../components/sections/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <FeaturedProductsSection />
      <ProcessSection />
      <SocialProofSection />
      <CTASection />
    </>
  )
}