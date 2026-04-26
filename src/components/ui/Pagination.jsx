import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Pagination controls that pair with the usePagination hook.
 *
 *   const pagination = usePagination({ ... })
 *   <Pagination {...pagination} />
 */
export default function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  hasNext,
  hasPrev,
  nextPage,
  prevPage,
  goToPage,
  isLight = false,
}) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  // Generate page numbers to show (max 7 buttons)
  function getPageNumbers() {
    const pages = []
    const maxButtons = 7

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')

      const start = Math.max(2, page - 1)
      const end = Math.min(totalPages - 1, page + 1)
      for (let i = start; i <= end; i++) pages.push(i)

      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const textMuted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.75)'
  const borderColor = isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)'
  const btnBg = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.04)'
  const btnBgActive = isLight ? '#f1f5f9' : 'rgba(255,255,255,0.10)'
  const textColor = isLight ? '#374151' : 'rgba(248,250,252,0.85)'
  const activeColor = isLight ? '#0f172a' : '#f8fafc'

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-4">
      <span className="text-xs" style={{ color: textMuted }}>
        Showing {from}–{to} of {totalCount}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={prevPage}
          disabled={!hasPrev}
          className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor,
            background: btnBg,
            color: textColor,
          }}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span
              key={`dots-${i}`}
              className="w-8 h-8 flex items-center justify-center text-xs"
              style={{ color: textMuted }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className="w-8 h-8 rounded-lg border text-xs font-semibold transition-all"
              style={{
                borderColor: p === page ? 'rgba(25,147,210,0.4)' : borderColor,
                background: p === page ? btnBgActive : btnBg,
                color: p === page ? activeColor : textColor,
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={nextPage}
          disabled={!hasNext}
          className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            borderColor,
            background: btnBg,
            color: textColor,
          }}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
