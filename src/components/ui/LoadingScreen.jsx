import { Loader2 } from 'lucide-react'

/**
 * Full-page or inline loading spinner.
 *
 *   <LoadingScreen />                        // Full page
 *   <LoadingScreen inline label="Loading orders…" />  // Inline
 */
export default function LoadingScreen({ inline = false, label = 'Loading…' }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2
        size={inline ? 20 : 28}
        className="animate-spin"
        style={{ color: 'var(--wp-green)' }}
      />
      <span className="text-ivory-300/40 text-xs font-body tracking-widest uppercase">
        {label}
      </span>
    </div>
  )

  if (inline) {
    return <div className="py-12 text-center">{content}</div>
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {content}
    </div>
  )
}
