import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import jsPDF from 'jspdf'
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
  Download,
  Receipt,
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
  green: '#13A150',
  cyan: '#1993D2',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  red: '#dc2626',
  slate: '#94a3b8',
}

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
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

function getFulfillmentInfo(items) {
  const item = items?.find((x) => x?.delivery_method)
  if (!item) {
    return {
      method: null,
      label: '—',
      fee: 0,
    }
  }

  return {
    method: item.delivery_method,
    label:
      item.delivery_method === 'deliver'
        ? `Delivery (+${formatPeso(item.delivery_fee || 0)})`
        : 'Pickup',
    fee: item.delivery_fee || 0,
  }
}

function getStatusHighlight(order, fulfillment) {
  if (!order) return null

  if (fulfillment.method === 'pickup') {
    if (order.status === 'ready') {
      return {
        title: 'Your order is ready for pickup!',
        description:
          'Please visit the store and present your Order ID when claiming your printed materials.',
        color: 'green',
        icon: CheckCircle,
      }
    }

    if (order.status === 'completed') {
      return {
        title: 'Your order has been completed.',
        description:
          'This order has already been marked as completed. If you have not claimed it yet, please contact WELLPrint.',
        color: 'cyan',
        icon: CheckCircle,
      }
    }
  }

  if (fulfillment.method === 'deliver') {
    if (order.status === 'ready') {
      return {
        title: 'Your order is ready for delivery!',
        description:
          'Your printed materials are prepared and awaiting delivery dispatch.',
        color: 'cyan',
        icon: Truck,
      }
    }

    if (order.status === 'completed') {
      return {
        title: 'Your order has been delivered!',
        description:
          'This delivery order has already been completed. Thank you for choosing WELLPrint.',
        color: 'green',
        icon: CheckCircle,
      }
    }

    if (['pending', 'processing', 'printing'].includes(order.status)) {
      return {
        title: 'Your order is being prepared for delivery.',
        description:
          'Our team is currently processing your order before dispatching it to your address.',
        color: 'amber',
        icon: Truck,
      }
    }
  }

  return null
}

function drawWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
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

  const fulfillment = useMemo(() => getFulfillmentInfo(items), [items])
  const highlight = useMemo(
    () => getStatusHighlight(order, fulfillment),
    [order, fulfillment]
  )

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

    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId.trim().toUpperCase())
      .ilike('customer_name', `%${customerName.trim()}%`)
      .limit(1)

    if (fetchError || !data || data.length === 0) {
      setError('No matching order found. Please check the Order ID and customer name.')
      setLoading(false)
      return
    }

    setOrder(data[0])
    setLoading(false)
  }

  function handleDownloadReceipt() {
    if (!order) return

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 16
    let y = 18

    // Background
    doc.setFillColor(248, 250, 252)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Card
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 6, 6, 'F')

    // Header
    doc.setFillColor(8, 18, 37)
    doc.roundedRect(10, 10, pageWidth - 20, 34, 6, 6, 'F')
    doc.rect(10, 38, pageWidth - 20, 6, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.text('WELL', 18, 24)
    doc.setTextColor(22, 163, 74)
    doc.text('Print', 38, 24)

    doc.setTextColor(226, 232, 240)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Official Customer Receipt', 18, 31)
    doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth - 18, 31, {
      align: 'right',
    })

    y = 54

    // Receipt title
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text('ORDER RECEIPT', margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    y += 6
    doc.text('Please keep this receipt for reference and order tracking.', margin, y)

    // Info boxes
    y += 10

    const boxW = (pageWidth - margin * 2 - 8) / 2
    const boxH = 22

    const drawInfoBox = (x, boxY, label, value) => {
      doc.setFillColor(248, 250, 252)
      doc.setDrawColor(226, 232, 240)
      doc.roundedRect(x, boxY, boxW, boxH, 3, 3, 'FD')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      doc.text(String(label).toUpperCase(), x + 4, boxY + 6)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(15, 23, 42)
      drawWrappedText(doc, value || '—', x + 4, boxY + 13, boxW - 8, 4.5)
    }

    drawInfoBox(margin, y, 'Order ID', order.id)
    drawInfoBox(margin + boxW + 8, y, 'Status', STATUS_LABELS[order.status] || order.status || '—')

    y += boxH + 6
    drawInfoBox(margin, y, 'Customer Name', order.customer_name || '—')
    drawInfoBox(margin + boxW + 8, y, 'Date', formatDateTime(order.created_at))

    y += boxH + 6
    drawInfoBox(margin, y, 'Fulfillment', fulfillment.label)
    drawInfoBox(
      margin + boxW + 8,
      y,
      'Email',
      order.customer_email || '—'
    )

    y += boxH + 10

    // Items heading
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(15, 23, 42)
    doc.text('ORDER ITEMS', margin, y)

    y += 6

    // Table header
    doc.setFillColor(241, 245, 249)
    doc.setDrawColor(226, 232, 240)
    doc.rect(margin, y, pageWidth - margin * 2, 10, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(71, 85, 105)
    doc.text('Item', margin + 4, y + 6.5)
    doc.text('Qty', pageWidth - 70, y + 6.5, { align: 'center' })
    doc.text('Unit Price', pageWidth - 46, y + 6.5, { align: 'right' })
    doc.text('Total', pageWidth - 18, y + 6.5, { align: 'right' })

    y += 10

    const itemRows = items.length
      ? items
      : [{ product_name: 'No items available', qty: 0, unit_price: 0 }]

    itemRows.forEach((item) => {
      const itemName = item.name || item.product_name || 'Item'
      const qty = item.qty || item.quantity || 1
      const unitPrice = Number(item.unit_price || item.unitPrice || 0)
      const lineTotal =
        Number(item.total || item.subtotal || item.price || unitPrice * qty) || 0

      const nameLines = doc.splitTextToSize(itemName, pageWidth - 90)
      const rowHeight = Math.max(10, nameLines.length * 5 + 4)

      if (y + rowHeight > 255) {
        doc.addPage()
        y = 20
      }

      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(226, 232, 240)
      doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'FD')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(15, 23, 42)
      doc.text(nameLines, margin + 4, y + 6)

      doc.text(String(qty), pageWidth - 70, y + rowHeight / 2 + 1, {
        align: 'center',
      })
      doc.text(formatPeso(unitPrice), pageWidth - 46, y + rowHeight / 2 + 1, {
        align: 'right',
      })
      doc.text(formatPeso(lineTotal), pageWidth - 18, y + rowHeight / 2 + 1, {
        align: 'right',
      })

      y += rowHeight
    })

    y += 8

    // Total box
    doc.setFillColor(248, 250, 252)
    doc.setDrawColor(226, 232, 240)
    doc.roundedRect(pageWidth - 82, y, 66, 20, 3, 3, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('TOTAL AMOUNT', pageWidth - 78, y + 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text(
      formatPeso(order.total_amount || order.estimated_total || 0),
      pageWidth - 20,
      y + 14,
      { align: 'right' }
    )

    y += 30

    // Notes / footer
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    const footerText =
      'Thank you for choosing WELLPrint. Please keep this receipt and present your Order ID if verification is needed.'
    drawWrappedText(doc, footerText, margin, y, pageWidth - margin * 2, 4.5)

    doc.save(`${order.id}-receipt.pdf`)
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
                {highlight && (
                  <div
                    className="rounded-[28px] border p-6 flex items-center gap-4"
                    style={{
                      background:
                        highlight.color === 'green'
                          ? 'rgba(22,163,74,0.10)'
                          : highlight.color === 'cyan'
                          ? 'rgba(25,147,210,0.10)'
                          : 'rgba(245,158,11,0.10)',
                      borderColor:
                        highlight.color === 'green'
                          ? 'rgba(22,163,74,0.25)'
                          : highlight.color === 'cyan'
                          ? 'rgba(25,147,210,0.25)'
                          : 'rgba(245,158,11,0.25)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background:
                          highlight.color === 'green'
                            ? 'rgba(22,163,74,0.18)'
                            : highlight.color === 'cyan'
                            ? 'rgba(25,147,210,0.18)'
                            : 'rgba(245,158,11,0.18)',
                        border:
                          highlight.color === 'green'
                            ? '1px solid rgba(22,163,74,0.35)'
                            : highlight.color === 'cyan'
                            ? '1px solid rgba(25,147,210,0.35)'
                            : '1px solid rgba(245,158,11,0.35)',
                      }}
                    >
                      <highlight.icon
                        size={26}
                        style={{
                          color:
                            highlight.color === 'green'
                              ? COLORS.green
                              : highlight.color === 'cyan'
                              ? COLORS.cyan
                              : COLORS.amber,
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-white text-lg font-semibold">
                        {highlight.title}
                      </h3>
                      <p className="text-ivory-300/45 text-sm mt-1">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                )}

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

                    <div className="flex flex-wrap gap-3">
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

                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          color: '#ffffff',
                          borderColor: 'rgba(255,255,255,0.10)',
                        }}
                      >
                        <Download size={14} />
                        Download Receipt
                      </button>
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
                        {fulfillment.method === 'deliver' ? (
                          <Truck size={14} className="text-ivory-300/40" />
                        ) : (
                          <Store size={14} className="text-ivory-300/40" />
                        )}
                        {fulfillment.label}
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
                    <Receipt size={16} style={{ color: 'var(--wp-cyan)' }} />
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