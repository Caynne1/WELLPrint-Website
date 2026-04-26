import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ImagePlus, CheckCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPHP } from '../../utils/formatters'

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const [removing, setRemoving] = useState(false)

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => removeItem(item.key), 300)
  }

  const subtotal = (item.unitPrice || 0) * (item.qty || 0)
  const deliveryFee = item.deliveryFee ?? 0

  return (
    <div
      className="card-press flex gap-0 overflow-hidden transition-all duration-300"
      style={{
        opacity: removing ? 0 : 1,
        transform: removing ? 'translateX(20px)' : 'translateX(0)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 w-28 sm:w-36 flex items-center justify-center border-r border-white/[0.06] overflow-hidden"
        style={{ background: '#1A1A1A', aspectRatio: '1/1' }}
      >
        {item.thumbnail_url ? (
          <img src={item.thumbnail_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <ImagePlus size={22} style={{ color: item.accent || 'var(--wp-green)', opacity: 0.2 }} />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/products/${item.slug}`}
              className="text-white font-semibold text-sm leading-snug hover:text-wp-green transition-colors"
              style={{ fontFamily: "'Lora', serif" }}
            >
              {item.name}
            </Link>

            {/* Variant selections */}
            {item.selections && Object.keys(item.selections).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(item.selections).map(([k, v]) => (
                  <span
                    key={k}
                    className="text-[9px] font-body px-2 py-0.5 rounded-sm border border-white/[0.08] text-ivory-300/40"
                  >
                    {k}: {v}
                  </span>
                ))}
              </div>
            )}

            {/* Design/delivery options */}
            {(item.designOption || item.deliveryMethod) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.designOption && (
                  <span className="text-[9px] font-body px-2 py-0.5 rounded-sm border border-white/[0.08] text-ivory-300/35">
                    Design:{' '}
                    {item.designOption === 'upload'
                      ? item.designFileName || 'Uploaded file'
                      : item.designOption === 'email'
                      ? 'Will email design'
                      : 'Needs layout assistance'}
                  </span>
                )}
                {item.deliveryMethod && (
                  <span className="text-[9px] font-body px-2 py-0.5 rounded-sm border border-white/[0.08] text-ivory-300/35">
                    {item.deliveryMethod === 'deliver'
                      ? `Delivery (+${formatPHP(item.deliveryFee || 0)})`
                      : 'Pickup'}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="shrink-0 p-1.5 rounded-sm text-ivory-300/25 hover:text-wp-magenta hover:bg-wp-magenta/10 transition-all"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Price + quantity */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-ivory-300/35 text-xs font-body">
            {formatPHP(item.unitPrice || 0)} / {item.unit || 'pcs'}
          </div>

          <div className="flex items-center" role="group" aria-label={`Quantity for ${item.name}`}>
            <button
              onClick={() => updateQty(item.key, item.qty - 1)}
              aria-label="Decrease quantity"
              className="w-8 h-8 border border-white/[0.10] rounded-l-sm bg-ink-800 flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all"
            >
              <Minus size={11} />
            </button>
            <div className="w-12 h-8 border-t border-b border-white/[0.10] bg-ink-700 flex items-center justify-center text-white text-xs font-body font-bold">
              {item.qty}
            </div>
            <button
              onClick={() => updateQty(item.key, item.qty + 1)}
              aria-label="Increase quantity"
              className="w-8 h-8 border border-white/[0.10] rounded-r-sm bg-ink-800 flex items-center justify-center text-ivory-300/50 hover:text-white hover:bg-ink-700 transition-all"
            >
              <Plus size={11} />
            </button>
          </div>

          <div className="text-right">
            <div className="font-bold text-white text-base" style={{ fontFamily: "'Lora', serif" }}>
              {formatPHP(subtotal + deliveryFee)}
            </div>
            {deliveryFee > 0 && (
              <div className="text-[10px] text-ivory-300/25 font-body">
                includes {formatPHP(deliveryFee)} delivery
              </div>
            )}
          </div>
        </div>

        {item.turnaround && (
          <div className="flex items-center gap-1.5">
            <CheckCircle size={10} style={{ color: 'var(--wp-green)' }} />
            <span className="text-[10px] font-body text-ivory-300/30">
              Ready in {item.turnaround}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
