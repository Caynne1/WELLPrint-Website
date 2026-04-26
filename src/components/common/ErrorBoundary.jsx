import { Component } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

/**
 * Error Boundary — catches render errors and shows a recovery UI.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourPage />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary level="section" fallback={<p>Widget failed</p>}>
 *     <SomeWidget />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log to your error reporting service here
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    // Allow custom fallback
    if (this.props.fallback) return this.props.fallback

    const level = this.props.level || 'page' // 'page' | 'section'

    if (level === 'section') {
      return (
        <div
          className="rounded-xl border p-6 text-center my-4"
          style={{
            background: 'rgba(220,38,38,0.06)',
            borderColor: 'rgba(220,38,38,0.18)',
          }}
        >
          <AlertCircle
            size={24}
            className="mx-auto mb-3"
            style={{ color: '#dc2626' }}
          />
          <p className="text-sm text-ivory-300/60 mb-3">
            This section encountered an error.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-white/10 text-ivory-300/50 hover:text-white transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )
    }

    // Full-page error
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950 px-6">
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(220,38,38,0.10)',
              border: '1px solid rgba(220,38,38,0.25)',
            }}
          >
            <AlertCircle size={28} style={{ color: '#dc2626' }} />
          </div>

          <h1
            className="text-white text-2xl font-bold mb-2"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Something went wrong
          </h1>

          <p className="text-ivory-300/50 text-sm mb-8 leading-relaxed">
            We hit an unexpected error. Try refreshing the page, or go
            back to the homepage.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <pre
              className="text-left text-xs text-red-400/70 bg-ink-900 border border-red-400/15 rounded-lg p-4 mb-6 overflow-x-auto max-h-40"
            >
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
            </pre>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-press inline-flex items-center gap-2 text-sm"
            >
              <RefreshCw size={14} /> Refresh Page
            </button>

            <a
              href="/"
              className="btn-press-ghost inline-flex items-center gap-2 text-sm"
            >
              <Home size={14} /> Homepage
            </a>
          </div>
        </div>
      </div>
    )
  }
}
