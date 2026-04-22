import { useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Search,
  Package,
  CheckCircle,
  Circle,
  Clock3,
  User,
  FileText,
  Truck,
  Store,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const STATUS_FLOW = ['pending', 'processing', 'printing', 'ready', 'completed']

const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  printing: 'Printing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const COLORS = {
  green: '#16a34a',
  cyan: '#1993D2',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  red: '#dc2626',
  slate: '#94a3b8',
}

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString()}`
}

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString()
  } catch {
    return '—'
  }
}

function getStepColor(status, active) {
  if (!active) return COLORS.slate

  switch (status) {
    case 'pending':
      return COLORS.cyan
    case 'processing':
      return COLORS.amber
    case 'printing':
      return COLORS.violet
    case 'ready':
      return COLORS.cyan
    case 'completed':
      return COLORS.green
    default:
      return COLORS.slate
  }
}

function getFulfillmentText(items) {
  const item = items?.find((x) => x?.delivery_method)
  if (!item) return '—'

  return item.delivery_method === 'deliver'
    ? `Delivery (+${formatPeso(item.delivery_fee || 0)})`
    : 'Pickup'
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const items = useMemo(() => {
    if (!order?.items) return []
    if (Array.isArray(order.items)) return order.items
    try {
      return typeof order.items === 'string' ? JSON.parse(order.items) : []
    } catch {
      return []
    }
  }, [order?.items])

  const currentIndex = useMemo(() => {
    if (!order?.status) return -1
    return STATUS_FLOW.indexOf(order.status)
  }, [order?.status])

  async function handleTrackOrder(e) {
    e.preventDefault()

    if (!orderId.trim()) {
      setError('Please enter your Order ID.')
      setOrder(null)
      setSearched(true)
      return
    }

    if (!customerName.trim()) {
      setError('Please enter the customer name used in the order.')
      setOrder(null)
      setSearched(true)
      return
    }

    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    const normalizedOrderId = orderId.trim().toUpperCase()
    const normalizedName = customerName.trim()

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', normalizedOrderId)
      .ilike('customer_name', `%${normalizedName}%`)
      .limit(1)

    if (fetchError) {
      console.error('Track order error:', fetchError)
      setError('Something went wrong while searching for your order.')
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      setError('No matching order found. Please check the Order ID and customer name.')
      setOrder(null)
      setLoading(false)
      return
    }

    setOrder(data[0])
    setLoading(false)
  }

  return (
    <section className="min-h-screen bg-ink-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">
              Track Order
            </span>
            <div className="h-px w-8 bg-wp-green" />
          </div>

          <h1
            className="text-white text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none mb-3"
            style={{ fontFamily: "'Lora', serif" }}
          >
            Track Your <span style={{ color: 'var(--wp-green)' }}>Order</span>
          </h1>

          <p className="text-ivory-300/45 text-sm max-w-2xl mx-auto leading-relaxed">
            Enter your Order ID and customer name to check the latest status of your print order.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div
              className="rounded-[28px] border p-6"
              style={{
                background: '#0b1730',
                borderColor: 'rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'rgba(25,147,210,0.12)',
                    border: '1px solid rgba(25,147,210,0.20)',
                  }}
                >
                  <Search size={17} style={{ color: 'var(--wp-cyan)' }} />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Find Order</h2>
                  <p className="text-ivory-300/35 text-xs">
                    Use the details from your order confirmation
                  </p>
                </div>
              </div>

              <form onSubmit={handleTrackOrder} className="space-y-5">
                <div>
                  <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">
                    Order ID
                  </label>
                  <input
                    type="text"
                    placeholder="ORD-12345678"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
                    style={{
                      background: '#081225',
                      borderColor: 'rgba(255,255,255,0.10)',
                    }}
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
                    style={{
                      background: '#081225',
                      borderColor: 'rgba(255,255,255,0.10)',
                    }}
                  />
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 rounded-[18px] px-4 py-3 text-sm"
                    style={{
                      background: 'rgba(205,27,110,0.10)',
                      border: '1px solid rgba(205,27,110,0.20)',
                      color: '#f9a8d4',
                    }}
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-press w-full flex items-center justify-center gap-2 text-sm py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      Track Order
                      <Search size={14} />
                    </>
                  )}
                </button>
              </form>

              <div
                className="mt-6 rounded-[18px] border p-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <p className="text-ivory-300/45 text-xs leading-relaxed">
                  Your Order ID is shown after checkout. Please enter the same name used when placing the order.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            {!searched && (
              <div
                className="rounded-[28px] border p-10 text-center"
                style={{
                  background: '#0b1730',
                  borderColor: 'rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'rgba(25,147,210,0.10)',
                    border: '1px solid rgba(25,147,210,0.18)',
                  }}
                >
                  <Package size={28} style={{ color: 'var(--wp-cyan)' }} />
                </div>

                <h3
                  className="text-white text-2xl font-bold mb-3"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Your order status will appear here
                </h3>

                <p className="text-ivory-300/40 text-sm max-w-md mx-auto leading-relaxed">
                  Once you search for your order, you’ll see the current status, timeline, and order summary.
                </p>
              </div>
            )}

            {searched && order && (
              <div className="space-y-6">
                <div
                  className="rounded-[28px] border p-6"
                  style={{
                    background: '#0b1730',
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-ivory-300/35 mb-2">
                        Order Found
                      </div>
                      <h2
                        className="text-white text-2xl font-bold"
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {order.id}
                      </h2>
                    </div>

                    <div
                      className="px-4 py-2 rounded-full text-sm font-semibold"
                      style={{
                        background:
                          order.status === 'completed'
                            ? 'rgba(22,163,74,0.12)'
                            : order.status === 'processing'
                            ? 'rgba(245,158,11,0.12)'
                            : order.status === 'printing'
                            ? 'rgba(139,92,246,0.12)'
                            : 'rgba(25,147,210,0.12)',
                        color:
                          order.status === 'completed'
                            ? COLORS.green
                            : order.status === 'processing'
                            ? COLORS.amber
                            : order.status === 'printing'
                            ? COLORS.violet
                            : COLORS.cyan,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {STATUS_LABELS[order.status] || order.status}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div
                      className="rounded-[18px] border p-4"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="text-ivory-300/35 text-xs mb-2">Customer</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        <User size={14} className="text-ivory-300/40" />
                        {order.customer_name || '—'}
                      </div>
                    </div>

                    <div
                      className="rounded-[18px] border p-4"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="text-ivory-300/35 text-xs mb-2">Placed On</div>
                      <div className="text-white font-medium">{formatDate(order.created_at)}</div>
                    </div>

                    <div
                      className="rounded-[18px] border p-4"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="text-ivory-300/35 text-xs mb-2">Fulfillment</div>
                      <div className="text-white font-medium flex items-center gap-2">
                        {getFulfillmentText(items).toLowerCase().includes('delivery') ? (
                          <Truck size={14} className="text-ivory-300/40" />
                        ) : (
                          <Store size={14} className="text-ivory-300/40" />
                        )}
                        {getFulfillmentText(items)}
                      </div>
                    </div>

                    <div
                      className="rounded-[18px] border p-4"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="text-ivory-300/35 text-xs mb-2">Estimated Total</div>
                      <div className="text-white font-semibold">
                        {formatPeso(order.total_amount || order.estimated_total)}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-[28px] border p-6"
                  style={{
                    background: '#0b1730',
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Clock3 size={16} style={{ color: 'var(--wp-cyan)' }} />
                    <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-ivory-300/35">
                      Progress Timeline
                    </span>
                  </div>

                  <div className="relative overflow-x-auto">
                    <div className="min-w-[700px] relative px-2 pt-1">
                      <div className="absolute top-4 left-4 right-4 h-[3px] bg-white/10 rounded-full" />

                      <div
                        className="absolute top-4 left-4 h-[3px] rounded-full transition-all duration-700"
                        style={{
                          background: COLORS.green,
                          width: `${currentIndex <= 0 ? 0 : (currentIndex / (STATUS_FLOW.length - 1)) * 100}%`,
                        }}
                      />

                      <div className="grid grid-cols-5 gap-4 relative z-10">
                        {STATUS_FLOW.map((status, index) => {
                          const active = index <= currentIndex
                          const color = getStepColor(status, active)
                          const time = order.status_timestamps?.[status]

                          return (
                            <div key={status} className="text-center">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center mx-auto border transition-all duration-500"
                                style={{
                                  background: active ? color : '#081225',
                                  borderColor: active ? color : 'rgba(255,255,255,0.12)',
                                  color: active ? '#FFFFFF' : '#94a3b8',
                                }}
                              >
                                {active ? <CheckCircle size={14} /> : <Circle size={12} />}
                              </div>

                              <p className="text-xs text-white mt-3 font-medium">
                                {STATUS_LABELS[status]}
                              </p>

                              <p className="text-[10px] text-ivory-300/35 mt-1 min-h-[28px]">
                                {time ? formatDateTime(time) : '—'}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-[28px] border p-6"
                  style={{
                    background: '#0b1730',
                    borderColor: 'rgba(255,255,255,0.08)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <FileText size={16} style={{ color: 'var(--wp-cyan)' }} />
                    <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-ivory-300/35">
                      Order Items
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-ivory-300/35 text-sm">No order items available.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-[20px] border p-4"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            borderColor: 'rgba(255,255,255,0.08)',
                          }}
                        >
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <p className="text-white font-medium">
                                {item.name || item.product_name || `Item ${index + 1}`}
                              </p>
                              <p className="text-ivory-300/35 text-sm mt-1">
                                Qty: {item.qty || item.quantity || 1}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-white font-semibold">
                                {formatPeso(
                                  item.total ||
                                    item.subtotal ||
                                    item.price ||
                                    (item.unit_price || 0) * (item.qty || 1)
                                )}
                              </p>
                              <p className="text-ivory-300/30 text-xs mt-1">
                                {item.unit_price ? `${formatPeso(item.unit_price)} / unit` : ''}
                              </p>
                            </div>
                          </div>

                          {(item.delivery_method || item.design_option) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.design_option && (
                                <span
                                  className="px-2.5 py-1 rounded-full text-[11px]"
                                  style={{
                                    background: 'rgba(22,163,74,0.12)',
                                    color: COLORS.green,
                                  }}
                                >
                                  Design:{' '}
                                  {item.design_option === 'upload'
                                    ? 'Uploaded'
                                    : item.design_option === 'email'
                                    ? 'Will Email'
                                    : 'Needs Layout'}
                                </span>
                              )}

                              {item.delivery_method && (
                                <span
                                  className="px-2.5 py-1 rounded-full text-[11px]"
                                  style={{
                                    background: 'rgba(139,92,246,0.12)',
                                    color: COLORS.violet,
                                  }}
                                >
                                  {item.delivery_method === 'deliver'
                                    ? `Delivery (+${formatPeso(item.delivery_fee || 0)})`
                                    : 'Pickup'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}