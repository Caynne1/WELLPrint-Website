import { Link } from 'react-router-dom'
import { ArrowLeft, Wrench, SearchX } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

export default function PlaceholderPage({ title = 'Coming Soon', phase }) {
  const is404 = phase === 'Error'
  usePageTitle(is404 ? '404 — Page Not Found' : title)

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-16 h-16 bg-ink-800 border border-ivory-200/10 flex items-center justify-center mb-8"
        aria-hidden="true"
      >
        {is404
          ? <SearchX size={24} className="text-wp-magenta/60" />
          : <Wrench size={24} className="text-wp-green/60" />
        }
      </div>

      {!is404 && (
        <span className="badge badge-green mb-4">{phase || 'In Development'}</span>
      )}

      <h1
        className="text-ivory-50 text-4xl mb-4"
        style={{ fontFamily: "'Lora', serif", fontWeight: 900 }}
      >
        {is404 ? 'Page Not Found' : title}
      </h1>

      <p className="text-ivory-300/50 max-w-md text-sm leading-relaxed mb-8">
        {is404
          ? "The page you're looking for doesn't exist or may have been moved."
          : 'This section is being built in an upcoming phase of the WELLPrint platform.'
        }
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to="/" className="btn-press-ghost flex items-center gap-2">
          <ArrowLeft size={14} />
          Back to Home
        </Link>
        {is404 && (
          <>
            <Link to="/products" className="btn-press-ghost flex items-center gap-2">
              Browse Products
            </Link>
            <Link to="/contact" className="btn-press-ghost flex items-center gap-2">
              Contact Us
            </Link>
          </>
        )}
      </div>
    </div>
  )
}