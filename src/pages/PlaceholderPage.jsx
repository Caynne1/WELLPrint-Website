import { Link } from 'react-router-dom'
import { ArrowLeft, Wrench } from 'lucide-react'

export default function PlaceholderPage({ title = 'Coming Soon', phase }) {
  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-16 h-16 bg-ink-800 border border-ivory-200/10 flex items-center justify-center mb-8"
        aria-hidden="true"
      >
        <Wrench size={24} className="text-wp-green/60" />
      </div>
      <span className="badge badge-green mb-4">{phase || 'In Development'}</span>
      <h1
        className="text-ivory-50 text-4xl mb-4"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}
      >
        {title}
      </h1>
      <p className="text-ivory-300/50 max-w-md text-sm leading-relaxed mb-8">
        This section is being built in an upcoming phase of the WELLPrint platform.
      </p>
      <Link to="/" className="btn-press-ghost flex items-center gap-2">
        <ArrowLeft size={14} />
        Back to Home
      </Link>
    </div>
  )
}
