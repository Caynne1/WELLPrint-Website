import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Modal — accessible overlay dialog
 *
 * Props:
 *   open      {boolean}  — whether to show the modal
 *   onClose   {function} — called when backdrop or × is clicked
 *   title     {string}   — heading shown in the header
 *   subtitle  {string}   — small label shown above the title
 *   maxWidth  {string}   — Tailwind max-width class (default 'max-w-2xl')
 *   children  {ReactNode}
 */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = 'max-w-2xl',
  children,
}) {
  const panelRef = useRef(null)

  // Trap focus & close on Escape
  useEffect(() => {
    if (!open) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.80)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={panelRef}
        className={`w-full ${maxWidth} max-h-[92vh] overflow-hidden rounded-[22px] shadow-[0_30px_90px_rgba(0,0,0,0.50)] flex flex-col`}
        style={{
          background: 'var(--surface-card)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div
            className="flex items-center justify-between shrink-0 px-6 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              {subtitle && (
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-px w-6" style={{ background: 'var(--wp-green)' }} />
                  <span
                    className="font-body text-[10px] tracking-[0.25em] uppercase"
                    style={{ color: 'var(--wp-green)' }}
                  >
                    {subtitle}
                  </span>
                </div>
              )}
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: "'Lora', serif" }}
                >
                  {title}
                </h2>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-150"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">{children}</div>
      </div>
    </div>
  )
}