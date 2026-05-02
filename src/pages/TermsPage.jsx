import usePageTitle from '../hooks/usePageTitle'
import { useTheme } from '../context/ThemeContext'
import { FileText } from 'lucide-react'

export default function TermsPage() {
  usePageTitle('Terms of Service')
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const pageBg  = isDark ? '#0c1829' : '#f0f6ff'
  const cardBg  = isDark ? '#112240' : '#ffffff'
  const heading = isDark ? '#f0f4ff' : '#0d1f3c'
  const subText = isDark ? 'rgba(168,190,217,0.65)' : '#5a7a9a'
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)'

  return (
    <section className="min-h-screen pt-10 pb-16" style={{ background: pageBg }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Legal</span>
            <div className="h-px w-8 bg-wp-green" />
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(25,147,210,0.10)', border: '1px solid rgba(25,147,210,0.18)' }}>
            <FileText size={22} style={{ color: 'var(--wp-cyan)' }} />
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight mb-3"
            style={{ fontFamily: "'Lora', serif", color: heading }}>
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: subText }}>Last updated: May 2025</p>
        </div>

        <div className="rounded-[28px] border p-6 sm:p-8 space-y-6 text-sm leading-relaxed"
          style={{ background: cardBg, borderColor: border, color: subText }}>

          <Section>
            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <p>By placing an order or using the WELLPrint website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
          </Section>

          <Section>
            <SectionTitle>2. Order Placement</SectionTitle>
            <p>Orders are considered confirmed once you receive an Order ID and a confirmation from our team. WELLPrint reserves the right to cancel or modify orders in cases of pricing errors, unavailability of materials, or force majeure events.</p>
          </Section>

          <Section>
            <SectionTitle>3. File Submission</SectionTitle>
            <p>Customers are responsible for submitting print-ready files that meet our specifications. WELLPrint is not liable for print quality issues resulting from low-resolution, improperly formatted, or incorrectly sized files. Please review our <a href="/file-specs" style={{ color: 'var(--wp-cyan)' }}>File Specifications</a> page before submitting.</p>
          </Section>

          <Section>
            <SectionTitle>4. Turnaround Time</SectionTitle>
            <p>Estimated turnaround times begin after artwork approval and full payment confirmation. WELLPrint will make reasonable efforts to meet deadlines but is not liable for delays caused by external factors beyond our control.</p>
          </Section>

          <Section>
            <SectionTitle>5. Payment</SectionTitle>
            <p>Payment terms will be communicated upon order confirmation. WELLPrint reserves the right to withhold order processing until payment has been received or verified.</p>
          </Section>

          <Section>
            <SectionTitle>6. Cancellations & Changes</SectionTitle>
            <p>Cancellations or design change requests must be submitted before production begins. Once printing has started, WELLPrint cannot guarantee cancellation or modification. Cancellation fees may apply depending on the stage of production.</p>
          </Section>

          <Section>
            <SectionTitle>7. Intellectual Property</SectionTitle>
            <p>You represent that you own or have the legal right to use any content, designs, logos, or trademarks submitted to WELLPrint for printing. WELLPrint is not liable for any intellectual property infringement arising from customer-submitted files.</p>
          </Section>

          <Section>
            <SectionTitle>8. Limitation of Liability</SectionTitle>
            <p>WELLPrint's liability for any claim arising from our services shall not exceed the amount paid for the specific order in question. We are not liable for indirect, consequential, or incidental damages.</p>
          </Section>

          <Section>
            <SectionTitle>9. Contact</SectionTitle>
            <p>For questions regarding these Terms, contact us at:<br />
              WELLPrint, Ormoc City, Philippines 6541<br />
              Email: <a href="mailto:wellprint.6972@gmail.com" style={{ color: 'var(--wp-cyan)' }}>wellprint.6972@gmail.com</a>
            </p>
          </Section>
        </div>
      </div>
    </section>
  )
}

function Section({ children }) {
  return <div className="space-y-2">{children}</div>
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-semibold" style={{ color: 'inherit', filter: 'brightness(1.5)' }}>
      {children}
    </h2>
  )
}