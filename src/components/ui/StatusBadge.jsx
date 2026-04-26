import { ORDER_STATUSES } from '../../utils/constants'

/**
 * Consistent order status badge used across dashboard pages.
 *
 *   <StatusBadge status="printing" />
 *   <StatusBadge status="completed" size="lg" />
 */
export default function StatusBadge({ status, size = 'sm' }) {
  const s = ORDER_STATUSES[status] || {
    label: status ?? 'Unknown',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.10)',
  }

  const sizeClasses =
    size === 'lg'
      ? 'text-xs px-3 py-1.5'
      : 'text-[10px] px-2.5 py-1'

  return (
    <span
      className={`${sizeClasses} font-semibold rounded-full border whitespace-nowrap inline-flex items-center gap-1.5`}
      style={{
        background: s.bg,
        borderColor: s.color + '35',
        color: s.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  )
}
