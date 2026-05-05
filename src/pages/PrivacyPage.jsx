import usePageTitle from '../hooks/usePageTitle'
import { useTheme } from '../context/ThemeContext'
import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  usePageTitle('Privacy Policy')
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const pageBg   = isDark ? '#0c1829' : '#f0f6ff'
  const cardBg   = isDark ? '#112240' : '#ffffff'
  const heading  = isDark ? '#f0f4ff' : '#0d1f3c'
  const subText  = isDark ? 'rgba(168,190,217,0.65)' : '#5a7a9a'
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(13,31,60,0.07)'

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
            style={{ background: 'rgba(19,161,80,0.10)', border: '1px solid rgba(19,161,80,0.18)' }}>
            <Shield size={22} style={{ color: 'var(--wp-green)' }} />
          </div>
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight mb-3"
            style={{ fontFamily: "'Lora', serif", color: heading }}>
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: subText }}>Last updated: May 2025</p>
        </div>

        <div className="rounded-[28px] border p-6 sm:p-8 space-y-6 text-sm leading-relaxed"
          style={{ background: cardBg, borderColor: border, color: subText }}>

          <Section heading={heading}>
            <SectionTitle>1. Information We Collect</SectionTitle>
            <p>When you place an order or contact us through WELLPrint, we collect personal information you voluntarily provide, including your full name, email address, phone number, and delivery address. We also collect order-related data such as the products ordered, file uploads, and payment amounts.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>2. How We Use Your Information</SectionTitle>
            <p>We use the information we collect to process and fulfill your print orders, communicate with you about your order status, respond to inquiries and concerns, and improve our services. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>3. Data Storage</SectionTitle>
            <p>Your data is stored securely using Supabase, a cloud database platform. Order data, contact messages, and uploaded files are retained for the duration of your order lifecycle and for a period thereafter to handle any follow-up concerns or disputes.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>4. File Uploads</SectionTitle>
            <p>Design files you upload are stored securely and used solely for the purpose of fulfilling your print order. Files are not shared with third parties and are retained only as long as necessary for order completion.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>5. Cookies & Local Storage</SectionTitle>
            <p>WELLPrint uses browser local storage to save your shopping cart across sessions. No third-party tracking cookies are used. We use cookies only for session management on the staff dashboard.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>6. Your Rights</SectionTitle>
            <p>You may request access to, correction of, or deletion of your personal data by contacting us at <a href="mailto:wellprint.6972@gmail.com" style={{ color: 'var(--wp-cyan)' }}>wellprint.6972@gmail.com</a>. We will respond to requests within a reasonable time frame.</p>
          </Section>

          <Section heading={heading}>
            <SectionTitle>7. Contact</SectionTitle>
            <p>If you have questions about this Privacy Policy, contact us at:<br />
              WELLPrint, Ormoc City, Philippines 6541<br />
              Email: <a href="mailto:wellprint.6972@gmail.com" style={{ color: 'var(--wp-cyan)' }}>wellprint.6972@gmail.com</a><br />
              Phone: 0920 578 5304
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