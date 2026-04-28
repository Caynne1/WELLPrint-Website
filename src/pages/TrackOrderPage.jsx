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
  MessageSquare,
  Send,
  ChevronDown,
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

const CONCERN_TYPES = [
  'General Inquiry',
  'Order Follow-up',
  'Cancel Order Request',
  'Change Layout Request',
  'Change Delivery / Pickup Request',
  'Billing Concern',
  'Other',
]

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
    case 'pending': return COLORS.cyan
    case 'processing': return COLORS.amber
    case 'printing': return COLORS.violet
    case 'ready': return COLORS.cyan
    case 'completed': return COLORS.green
    default: return COLORS.slate
  }
}

function getFulfillmentInfo(items) {
  const item = items?.find((x) => x?.delivery_method)
  if (!item) return { method: null, label: '—', fee: 0 }
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
    if (order.status === 'ready') return { title: 'Your order is ready for pickup!', description: 'Please visit the store and present your Order ID when claiming your printed materials.', color: 'green', icon: CheckCircle }
    if (order.status === 'completed') return { title: 'Your order has been completed.', description: 'This order has already been marked as completed. If you have not claimed it yet, please contact WELLPrint.', color: 'cyan', icon: CheckCircle }
  }
  if (fulfillment.method === 'deliver') {
    if (order.status === 'ready') return { title: 'Your order is ready for delivery!', description: 'Your printed materials are prepared and awaiting delivery dispatch.', color: 'cyan', icon: Truck }
    if (order.status === 'completed') return { title: 'Your order has been delivered!', description: 'This delivery order has already been completed. Thank you for choosing WELLPrint.', color: 'green', icon: CheckCircle }
    if (['pending', 'processing', 'printing'].includes(order.status)) return { title: 'Your order is being prepared for delivery.', description: 'Our team is currently processing your order before dispatching it to your address.', color: 'amber', icon: Truck }
  }
  return null
}

function drawWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

// ─── Enhanced PDF Receipt with WELLPrint logo ─────────────────────────────
function generateReceiptPDF(order, items, fulfillment) {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 18
  let y = 0

  // ── Background ──
  doc.setFillColor(244, 247, 252)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // ── Header band ──
  doc.setFillColor(8, 18, 42)
  doc.rect(0, 0, pageWidth, 52, 'F')

  // Colored accent bar at the very top
  const barW = pageWidth / 4
  doc.setFillColor(14, 147, 210)   // blue
  doc.rect(0, 0, barW, 4, 'F')
  doc.setFillColor(204, 27, 110)   // pink
  doc.rect(barW, 0, barW, 4, 'F')
  doc.setFillColor(252, 192, 18)   // yellow
  doc.rect(barW * 2, 0, barW, 4, 'F')
  doc.setFillColor(7, 160, 78)     // green
  doc.rect(barW * 3, 0, barW, 4, 'F')

  // ── Logo text in header ──
  y = 22
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.setTextColor(255, 255, 255)
  doc.text('WELL', margin, y)

  // Measure WELL width and place Print right after
  const wellWidth = doc.getTextWidth('WELL')
  doc.setTextColor(7, 160, 78)
  doc.text('Print', margin + wellWidth + 1, y)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(156, 183, 214)
  doc.text('Premium Printing Services', margin, y + 7)

  // Header right: receipt type + date
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(255, 255, 255)
  doc.text('OFFICIAL RECEIPT', pageWidth - margin, y - 6, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(156, 183, 214)
  doc.text(`Generated: ${formatDateTime(new Date())}`, pageWidth - margin, y + 0, { align: 'right' })

  // ── Divider under header ──
  y = 58

  // ── Receipt info boxes ──
  const boxW = (pageWidth - margin * 2 - 8) / 2
  const boxH = 22

  const drawInfoBox = (x, boxY, label, value, accentColor) => {
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(221, 228, 240)
    doc.roundedRect(x, boxY, boxW, boxH, 3, 3, 'FD')

    // Left accent stripe
    if (accentColor) {
      const [r, g, b] = accentColor
      doc.setFillColor(r, g, b)
      doc.roundedRect(x, boxY, 3, boxH, 1.5, 1.5, 'F')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(120, 140, 170)
    doc.text(String(label).toUpperCase(), x + 7, boxY + 7)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(15, 23, 42)
    drawWrappedText(doc, value || '—', x + 7, boxY + 15, boxW - 12, 4.5)
  }

  drawInfoBox(margin, y, 'Order ID', order.id, [14, 147, 210])
  drawInfoBox(margin + boxW + 8, y, 'Status', STATUS_LABELS[order.status] || order.status || '—', [7, 160, 78])

  y += boxH + 5
  drawInfoBox(margin, y, 'Customer Name', order.customer_name || '—', [204, 27, 110])
  drawInfoBox(margin + boxW + 8, y, 'Date Placed', formatDateTime(order.created_at), [252, 192, 18])

  y += boxH + 5
  drawInfoBox(margin, y, 'Fulfillment', fulfillment.label, [14, 147, 210])
  drawInfoBox(margin + boxW + 8, y, 'Email', order.customer_email || '—', [7, 160, 78])

  y += boxH + 12

  // ── Order Items ──
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(15, 23, 42)
  doc.text('ORDER ITEMS', margin, y)

  // underline
  doc.setDrawColor(14, 147, 210)
  doc.setLineWidth(0.8)
  doc.line(margin, y + 2, margin + 32, y + 2)

  y += 7

  // Table header
  doc.setFillColor(8, 18, 42)
  doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(180, 200, 225)
  doc.text('ITEM', margin + 5, y + 6.5)
  doc.text('QTY', pageWidth - 72, y + 6.5, { align: 'center' })
  doc.text('UNIT PRICE', pageWidth - 48, y + 6.5, { align: 'right' })
  doc.text('TOTAL', pageWidth - margin, y + 6.5, { align: 'right' })

  y += 10

  const itemRows = items.length
    ? items
    : [{ product_name: 'No items available', qty: 0, unit_price: 0 }]

  let rowAlt = false
  itemRows.forEach((item) => {
    const itemName = item.name || item.product_name || 'Item'
    const qty = item.qty || item.quantity || 1
    const unitPrice = Number(item.unit_price || item.unitPrice || 0)
    const lineTotal = Number(item.total || item.subtotal || item.price || unitPrice * qty) || 0
    const nameLines = doc.splitTextToSize(itemName, pageWidth - 95)
    const rowHeight = Math.max(10, nameLines.length * 5 + 4)

    if (y + rowHeight > 260) { doc.addPage(); y = 20 }

    doc.setFillColor(rowAlt ? 248 : 255, rowAlt ? 250 : 255, rowAlt ? 252 : 255)
    doc.setDrawColor(221, 228, 240)
    doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'FD')
    rowAlt = !rowAlt

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(15, 23, 42)
    doc.text(nameLines, margin + 5, y + 6)

    doc.setFont('helvetica', 'bold')
    doc.text(String(qty), pageWidth - 72, y + rowHeight / 2 + 1.5, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.text(formatPeso(unitPrice), pageWidth - 48, y + rowHeight / 2 + 1.5, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(formatPeso(lineTotal), pageWidth - margin, y + rowHeight / 2 + 1.5, { align: 'right' })

    y += rowHeight
  })

  y += 8

  // ── Total box ──
  doc.setFillColor(8, 18, 42)
  doc.roundedRect(pageWidth - 82, y, 64, 22, 3, 3, 'F')

  doc.setFillColor(7, 160, 78)
  doc.roundedRect(pageWidth - 82, y, 4, 22, 1.5, 1.5, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(156, 183, 214)
  doc.text('TOTAL AMOUNT', pageWidth - 75, y + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text(
    formatPeso(order.total_amount || order.estimated_total || 0),
    pageWidth - margin,
    y + 16,
    { align: 'right' }
  )

  y += 32

  // ── Footer ──
  doc.setFillColor(8, 18, 42)
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(120, 150, 190)
  doc.text(
    'Thank you for choosing WELLPrint. Please keep this receipt and present your Order ID when needed.',
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center', maxWidth: pageWidth - 40 }
  )

  doc.setTextColor(14, 147, 210)
  doc.text('wellprint.ph', pageWidth / 2, pageHeight - 6, { align: 'center' })

  doc.save(`${order.id}-wellprint-receipt.pdf`)
}

// ─── Message Panel component ───────────────────────────────────────────────
function MessagePanel({ orderId, customerName }) {
  const [name, setName] = useState(customerName || '')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [concernType, setConcernType] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [msgError, setMsgError] = useState('')

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !concernType || !message.trim()) {
      setMsgError('Please fill in all required fields.')
      return
    }
    setSending(true)
    setMsgError('')

    const { error } = await supabase.from('contact_messages').insert([{
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      concern_type: concernType,
      order_id: orderId || null,
      message: message.trim(),
      is_read: false,
      is_resolved: false,
    }])

    if (error) {
      setMsgError('Failed to send message. Please try again.')
      setSending(false)
      return
    }

    setSent(true)
    setSending(false)
  }

  if (sent) {
    return (
      <div className="rounded-[28px] border p-8 text-center" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(19,161,80,0.12)', border: '1px solid rgba(19,161,80,0.25)' }}>
          <CheckCircle size={28} style={{ color: COLORS.green }} />
        </div>
        <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: "'Lora', serif" }}>Message Sent!</h3>
        <p className="text-ivory-300/45 text-sm">Our team will get back to you shortly. Reference your Order ID <span className="text-white font-semibold">{orderId}</span> in any follow-up.</p>
        <button
          onClick={() => { setSent(false); setMessage(''); setConcernType(''); setMsgError('') }}
          className="mt-5 text-sm px-5 py-2 rounded-full border"
          style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)' }}
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border p-6" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(19,161,80,0.10)', border: '1px solid rgba(19,161,80,0.20)' }}>
          <MessageSquare size={17} style={{ color: COLORS.green }} />
        </div>
        <div>
          <h2 className="text-white text-lg font-semibold">Message Admin</h2>
          <p className="text-ivory-300/35 text-xs">Send a message directly to our team about this order</p>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
              style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
            />
          </div>
          <div>
            <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
              style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Phone (optional)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
              style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
            />
          </div>
          <div>
            <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Concern Type <span className="text-red-400">*</span></label>
            <div className="relative">
              <select
                value={concernType}
                onChange={(e) => setConcernType(e.target.value)}
                className="w-full rounded-[18px] border px-4 py-3 text-sm outline-none appearance-none"
                style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)', color: concernType ? '#fff' : 'rgba(255,255,255,0.35)' }}
              >
                <option value="" disabled>Select type...</option>
                {CONCERN_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: '#081225', color: '#fff' }}>{t}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.30)' }} />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Message <span className="text-red-400">*</span></label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your concern or inquiry in detail..."
            className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none resize-none"
            style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
          />
        </div>

        {orderId && (
          <div className="rounded-[14px] border px-4 py-3 flex items-center gap-2" style={{ background: 'rgba(25,147,210,0.06)', borderColor: 'rgba(25,147,210,0.18)' }}>
            <FileText size={13} style={{ color: COLORS.cyan }} />
            <span className="text-xs text-ivory-300/55">This message will be linked to Order ID: <span className="text-white font-semibold">{orderId}</span></span>
          </div>
        )}

        {msgError && (
          <div className="flex items-start gap-2 rounded-[18px] px-4 py-3 text-sm" style={{ background: 'rgba(205,27,110,0.10)', border: '1px solid rgba(205,27,110,0.20)', color: '#f9a8d4' }}>
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{msgError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn-press w-full flex items-center justify-center gap-2 text-sm py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? (
            <><Loader2 size={15} className="animate-spin" />Sending...</>
          ) : (
            <><Send size={14} />Send Message to Admin</>
          )}
        </button>
      </form>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)
  const [showMessagePanel, setShowMessagePanel] = useState(false)

  const items = useMemo(() => {
    if (!order?.items) return []
    if (Array.isArray(order.items)) return order.items
    try { return typeof order.items === 'string' ? JSON.parse(order.items) : [] }
    catch { return [] }
  }, [order?.items])

  const currentIndex = useMemo(() => {
    if (!order?.status) return -1
    return STATUS_FLOW.indexOf(order.status)
  }, [order?.status])

  const fulfillment = useMemo(() => getFulfillmentInfo(items), [items])
  const highlight = useMemo(() => getStatusHighlight(order, fulfillment), [order, fulfillment])

  async function handleTrackOrder(e) {
    e.preventDefault()
    if (!orderId.trim()) { setError('Please enter your Order ID.'); setOrder(null); setSearched(true); return }
    if (!customerName.trim()) { setError('Please enter the customer name used in the order.'); setOrder(null); setSearched(true); return }
    setLoading(true); setError(''); setOrder(null); setSearched(true)

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
    setShowMessagePanel(false)
    setLoading(false)
  }

  function handleDownloadReceipt() {
    if (!order) return
    generateReceiptPDF(order, items, fulfillment)
  }

  return (
    <section className="min-h-screen bg-ink-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-wp-green" />
            <span className="font-body text-[10px] tracking-[0.25em] uppercase text-wp-green">Track Order</span>
            <div className="h-px w-8 bg-wp-green" />
          </div>

          <h1 className="text-white text-[clamp(2rem,4vw,3.5rem)] font-bold leading-none mb-3" style={{ fontFamily: "'Lora', serif" }}>
            Track Your <span style={{ color: 'var(--wp-green)' }}>Order</span>
          </h1>

          <p className="text-ivory-300/45 text-sm max-w-2xl mx-auto leading-relaxed">
            Enter your Order ID and customer name to check the latest status of your print order.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Search + Message Toggle */}
          <div className="lg:col-span-4 space-y-5">
            <div className="rounded-[28px] border p-6" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(25,147,210,0.12)', border: '1px solid rgba(25,147,210,0.20)' }}>
                  <Search size={17} style={{ color: 'var(--wp-cyan)' }} />
                </div>
                <div>
                  <h2 className="text-white text-lg font-semibold">Find Order</h2>
                  <p className="text-ivory-300/35 text-xs">Use the details from your order confirmation</p>
                </div>
              </div>

              <form onSubmit={handleTrackOrder} className="space-y-5">
                <div>
                  <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Order ID</label>
                  <input
                    type="text"
                    placeholder="ORD-12345678"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                    className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
                    style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                <div>
                  <label className="block font-body text-[10px] tracking-widest uppercase text-ivory-300/40 mb-2">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-[18px] border px-4 py-3 text-sm text-white outline-none"
                    style={{ background: '#081225', borderColor: 'rgba(255,255,255,0.10)' }}
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-[18px] px-4 py-3 text-sm" style={{ background: 'rgba(205,27,110,0.10)', border: '1px solid rgba(205,27,110,0.20)', color: '#f9a8d4' }}>
                    <AlertCircle size={15} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-press w-full flex items-center justify-center gap-2 text-sm py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 size={15} className="animate-spin" />Tracking...</> : <><Search size={14} />Track Order</>}
                </button>
              </form>

              <div className="mt-6 rounded-[18px] border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="text-ivory-300/45 text-xs leading-relaxed">Your Order ID is shown after checkout. Please enter the same name used when placing the order.</p>
              </div>
            </div>

            {/* Message Admin button — always visible */}
            <button
              onClick={() => setShowMessagePanel((v) => !v)}
              className="w-full flex items-center justify-center gap-2 rounded-[20px] border py-4 text-sm font-semibold transition-all"
              style={{
                background: showMessagePanel ? 'rgba(19,161,80,0.10)' : 'rgba(255,255,255,0.03)',
                borderColor: showMessagePanel ? 'rgba(19,161,80,0.25)' : 'rgba(255,255,255,0.10)',
                color: showMessagePanel ? COLORS.green : 'rgba(255,255,255,0.60)',
              }}
            >
              <MessageSquare size={15} />
              {showMessagePanel ? 'Hide Message Form' : 'Message Admin About Order'}
            </button>
          </div>

          {/* Right: Order results or message panel */}
          <div className="lg:col-span-8">
            {/* Message panel */}
            {showMessagePanel && (
              <div className="mb-6">
                <MessagePanel orderId={orderId || order?.id} customerName={customerName || order?.customer_name} />
              </div>
            )}

            {!searched && !showMessagePanel && (
              <div className="rounded-[28px] border p-10 text-center" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(25,147,210,0.10)', border: '1px solid rgba(25,147,210,0.18)' }}>
                  <Package size={28} style={{ color: 'var(--wp-cyan)' }} />
                </div>
                <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "'Lora', serif" }}>Your order status will appear here</h3>
                <p className="text-ivory-300/40 text-sm max-w-md mx-auto leading-relaxed">Once you search for your order, you'll see the current status, timeline, and order summary.</p>
              </div>
            )}

            {searched && order && (
              <div className="space-y-6">
                {highlight && (
                  <div className="rounded-[28px] border p-6 flex items-center gap-4" style={{
                    background: highlight.color === 'green' ? 'rgba(22,163,74,0.10)' : highlight.color === 'cyan' ? 'rgba(25,147,210,0.10)' : 'rgba(245,158,11,0.10)',
                    borderColor: highlight.color === 'green' ? 'rgba(22,163,74,0.25)' : highlight.color === 'cyan' ? 'rgba(25,147,210,0.25)' : 'rgba(245,158,11,0.25)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
                  }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{
                      background: highlight.color === 'green' ? 'rgba(22,163,74,0.18)' : highlight.color === 'cyan' ? 'rgba(25,147,210,0.18)' : 'rgba(245,158,11,0.18)',
                      border: highlight.color === 'green' ? '1px solid rgba(22,163,74,0.35)' : highlight.color === 'cyan' ? '1px solid rgba(25,147,210,0.35)' : '1px solid rgba(245,158,11,0.35)',
                    }}>
                      <highlight.icon size={26} style={{ color: highlight.color === 'green' ? COLORS.green : highlight.color === 'cyan' ? COLORS.cyan : COLORS.amber }} />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-semibold">{highlight.title}</h3>
                      <p className="text-ivory-300/45 text-sm mt-1">{highlight.description}</p>
                    </div>
                  </div>
                )}

                <div className="rounded-[28px] border p-6" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                    <div>
                      <div className="text-[10px] tracking-[0.25em] uppercase text-ivory-300/35 mb-2">Order Found</div>
                      <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "'Lora', serif" }}>{order.id}</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{
                        background: order.status === 'completed' ? 'rgba(22,163,74,0.12)' : order.status === 'processing' ? 'rgba(245,158,11,0.12)' : order.status === 'printing' ? 'rgba(139,92,246,0.12)' : 'rgba(25,147,210,0.12)',
                        color: order.status === 'completed' ? COLORS.green : order.status === 'processing' ? COLORS.amber : order.status === 'printing' ? COLORS.violet : COLORS.cyan,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}>
                        {STATUS_LABELS[order.status] || order.status}
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadReceipt}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(19,161,80,0.10)', color: COLORS.green, borderColor: 'rgba(19,161,80,0.25)' }}
                      >
                        <Download size={14} />
                        Download Receipt
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMessagePanel((v) => !v)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:scale-[1.02]"
                        style={{ background: 'rgba(25,147,210,0.08)', color: COLORS.cyan, borderColor: 'rgba(25,147,210,0.22)' }}
                      >
                        <MessageSquare size={14} />
                        Message Admin
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {[
                      { label: 'Customer', value: order.customer_name || '—', icon: <User size={14} className="text-ivory-300/40" /> },
                      { label: 'Placed On', value: formatDate(order.created_at), icon: null },
                      { label: 'Fulfillment', value: fulfillment.label, icon: fulfillment.method === 'deliver' ? <Truck size={14} className="text-ivory-300/40" /> : <Store size={14} className="text-ivory-300/40" /> },
                      { label: 'Estimated Total', value: formatPeso(order.total_amount || order.estimated_total), icon: null, bold: true },
                    ].map((card, i) => (
                      <div key={i} className="rounded-[18px] border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="text-ivory-300/35 text-xs mb-2">{card.label}</div>
                        <div className={`text-white ${card.bold ? 'font-semibold' : 'font-medium'} flex items-center gap-2`}>
                          {card.icon}{card.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="rounded-[28px] border p-6" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Clock3 size={16} style={{ color: 'var(--wp-cyan)' }} />
                    <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-ivory-300/35">Progress Timeline</span>
                  </div>

                  <div className="relative overflow-x-auto">
                    <div className="min-w-[700px] relative px-2 pt-1">
                      <div className="absolute top-4 left-4 right-4 h-[3px] bg-white/10 rounded-full" />
                      <div className="absolute top-4 left-4 h-[3px] rounded-full transition-all duration-700" style={{ background: COLORS.green, width: `${currentIndex <= 0 ? 0 : (currentIndex / (STATUS_FLOW.length - 1)) * 100}%` }} />

                      <div className="grid grid-cols-5 gap-4 relative z-10">
                        {STATUS_FLOW.map((status, index) => {
                          const active = index <= currentIndex
                          const color = getStepColor(status, active)
                          const time = order.status_timestamps?.[status]
                          return (
                            <div key={status} className="text-center">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto border transition-all duration-500" style={{ background: active ? color : '#081225', borderColor: active ? color : 'rgba(255,255,255,0.12)', color: active ? '#FFFFFF' : '#94a3b8' }}>
                                {active ? <CheckCircle size={14} /> : <Circle size={12} />}
                              </div>
                              <p className="text-xs text-white mt-3 font-medium">{STATUS_LABELS[status]}</p>
                              <p className="text-[10px] text-ivory-300/35 mt-1 min-h-[28px]">{time ? formatDateTime(time) : '—'}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="rounded-[28px] border p-6" style={{ background: '#0b1730', borderColor: 'rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.22)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <Receipt size={16} style={{ color: 'var(--wp-cyan)' }} />
                    <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-ivory-300/35">Order Items</span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-ivory-300/35 text-sm">No order items available.</p>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="rounded-[20px] border p-4" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}>
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <p className="text-white font-medium">{item.name || item.product_name || `Item ${index + 1}`}</p>
                              <p className="text-ivory-300/35 text-sm mt-1">Qty: {item.qty || item.quantity || 1}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">{formatPeso(item.total || item.subtotal || item.price || (item.unit_price || 0) * (item.qty || 1))}</p>
                              <p className="text-ivory-300/30 text-xs mt-1">{item.unit_price ? `${formatPeso(item.unit_price)} / unit` : ''}</p>
                            </div>
                          </div>

                          {(item.delivery_method || item.design_option) && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.design_option && (
                                <span className="px-2.5 py-1 rounded-full text-[11px]" style={{ background: 'rgba(22,163,74,0.12)', color: COLORS.green }}>
                                  Design: {item.design_option === 'upload' ? 'Uploaded' : item.design_option === 'email' ? 'Will Email' : 'Needs Layout'}
                                </span>
                              )}
                              {item.delivery_method && (
                                <span className="px-2.5 py-1 rounded-full text-[11px]" style={{ background: 'rgba(139,92,246,0.12)', color: COLORS.violet }}>
                                  {item.delivery_method === 'deliver' ? `Delivery (+${formatPeso(item.delivery_fee || 0)})` : 'Pickup'}
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