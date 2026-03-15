import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  ArrowLeft, Mail, Send, ChevronDown, CheckCircle,
  Phone, User, Building2, Package, AlertCircle, Loader2
} from 'lucide-react'

function formatPHP(n) { return '\u20B1' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }
function formatDate(iso) {
  return new Date(iso).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

const EMAIL_TEMPLATES = {
  quote: (order) => ({
    subject: `Quote for your WELLPrint order ${order.id}`,
    body: `Hi ${order.customer.name.split(' ')[0]},\n\nThank you for your inquiry! We're happy to help with your printing needs.\n\nHere is your quote for order ${order.id}:\n\n${order.items.map(i => `• ${i.name} — ${i.qty} ${i.unit} @ ${formatPHP(i.unitPrice)} each = ${formatPHP(i.qty * i.unitPrice)}`).join('\n')}\n\nEstimated Total: ${formatPHP(order.estimatedTotal)}\n(Final price may vary based on artwork and specifications)\n\nTo proceed, please:\n1. Reply to confirm you'd like to move forward\n2. Send your print-ready artwork files (PDF/AI/EPS, 300dpi, CMYK, 3mm bleed)\n3. We will then confirm payment details\n\nBest regards,\nWELLPrint Team\nhello@wellprint.com.ph`,
  }),
  artwork: (order) => ({
    subject: `Artwork needed — WELLPrint order ${order.id}`,
    body: `Hi ${order.customer.name.split(' ')[0]},\n\nThank you for confirming your order ${order.id}!\n\nTo get started on printing, we need your print-ready artwork files:\n\n• File types: PDF, AI, or EPS (preferred)\n• Resolution: 300dpi minimum\n• Color mode: CMYK\n• Bleed: 3mm on all sides\n• Fonts: Outlined/embedded\n\nYou can reply to this email with your files attached, or use a file-sharing link (WeTransfer, Google Drive, Dropbox).\n\nBest regards,\nWELLPrint Team`,
  }),
  printing: (order) => ({
    subject: `Your order ${order.id} is now printing!`,
    body: `Hi ${order.customer.name.split(' ')[0]},\n\nGreat news! Your artwork has been approved and your order ${order.id} is now in production.\n\nOrder details:\n${order.items.map(i => `• ${i.name} — ${i.qty} ${i.unit}`).join('\n')}\n\nWe'll notify you as soon as your order is ready.\n\nBest regards,\nWELLPrint Team`,
  }),
  completed: (order) => ({
    subject: `Your order ${order.id} is ready! 🎉`,
    body: `Hi ${order.customer.name.split(' ')[0]},\n\nYour order ${order.id} is complete and ready for pickup!\n\n${order.items.map(i => `• ${i.name} — ${i.qty} ${i.unit}`).join('\n')}\n\nThank you for choosing WELLPrint!\n\nBest regards,\nWELLPrint Team\nhello@wellprint.com.ph`,
  }),
  custom: () => ({ subject: '', body: '' }),
}

const STATUS_ACTIONS = [
  { key: 'quoted',          label: 'Mark as Quoted',    template: 'quote',    color: '#FBB03B' },
  { key: 'artwork_pending', label: 'Request Artwork',   template: 'artwork',  color: '#29ABE2' },
  { key: 'printing',        label: 'Mark as Printing',  template: 'printing', color: '#2DB04B' },
  { key: 'completed',       label: 'Mark as Completed', template: 'completed',color: '#2DB04B' },
  { key: 'cancelled',       label: 'Cancel Order',      template: 'custom',   color: '#666'   },
]

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const { orders, loading, updateStatus, addEmailToThread } = useOrders()
  const { user } = useAuth()

  const order = orders.find(o => o.id === id)

  const [composing, setComposing] = useState(false)
  const [subject,   setSubject]   = useState('')
  const [body,      setBody]      = useState('')
  const [sending,   setSending]   = useState(false)
  const [sent,      setSent]      = useState(false)
  const [statusDD,  setStatusDD]  = useState(false)

  if (loading) return (
    <AdminLayout>
      <div className="py-20 flex items-center justify-center gap-2 text-ivory-300/30">
        <Loader2 size={20} className="animate-spin" /> Loading order…
      </div>
    </AdminLayout>
  )

  if (!order) return (
    <AdminLayout>
      <div className="text-center py-20 text-ivory-300/40">
        <AlertCircle size={32} className="mx-auto mb-4" />
        <p>Order not found.</p>
        <Link to="/admin/orders" className="text-wp-green mt-4 inline-block text-sm">← Back to orders</Link>
      </div>
    </AdminLayout>
  )

  const st = ORDER_STATUSES[order.status] ?? ORDER_STATUSES.new

  function openTemplate(templateKey) {
    const tmpl = EMAIL_TEMPLATES[templateKey]?.(order) ?? { subject: '', body: '' }
    setSubject(tmpl.subject)
    setBody(tmpl.body)
    setComposing(true)
    setSent(false)
  }

  function handleStatusChange(action) {
    setStatusDD(false)
    updateStatus(order.id, action.key)
    openTemplate(action.template)
  }

  async function handleSendEmail(e) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return
    setSending(true)
    await addEmailToThread(order.id, {
      from:    'staff',
      by:      user?.name ?? user?.email,
      at:      new Date().toISOString(),
      subject,
      body,
    })
    setSending(false)
    setSent(true)
    setComposing(false)
    setSubject('')
    setBody('')
  }

  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
        <div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-mono text-ivory-300/35 hover:text-white transition-colors mb-3">
            <ArrowLeft size={12} /> All Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-white text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', serif" }}>{order.id}</h1>
            <span className="text-xs font-mono px-3 py-1 rounded-sm"
              style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
              {st.label}
            </span>
          </div>
          <p className="text-ivory-300/35 text-xs font-mono mt-1">{formatDate(order.createdAt)}</p>
        </div>

        <div className="relative">
          <button onClick={() => setStatusDD(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-mono border transition-all"
            style={{ background: 'rgba(45,176,75,0.08)', borderColor: 'rgba(45,176,75,0.25)', color: 'var(--wp-green)' }}>
            Update Status <ChevronDown size={13} style={{ transform: statusDD ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {statusDD && (
            <div className="absolute right-0 top-full mt-1 z-20 w-56 bg-ink-800 border border-white/[0.1] rounded-sm shadow-xl overflow-hidden">
              {STATUS_ACTIONS.map(action => (
                <button key={action.key} onClick={() => handleStatusChange(action)}
                  className="w-full text-left px-4 py-3 text-xs font-mono hover:bg-white/[0.04] transition-colors flex items-center gap-2"
                  style={{ color: action.color }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: action.color }} />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
            <div className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 mb-4">Customer</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--wp-green)' }} />
                <div>
                  <div className="text-white text-sm font-semibold">{order.customer.name}</div>
                  {order.customer.company && <div className="text-ivory-300/40 text-xs">{order.customer.company}</div>}
                </div>
              </div>
              <a href={`mailto:${order.customer.email}`}
                className="flex items-center gap-3 text-xs hover:text-wp-cyan transition-colors"
                style={{ color: 'var(--wp-cyan)' }}>
                <Mail size={13} className="shrink-0" /> {order.customer.email}
              </a>
              {order.customer.phone && (
                <a href={`tel:${order.customer.phone}`}
                  className="flex items-center gap-3 text-xs text-ivory-300/50 hover:text-white transition-colors">
                  <Phone size={13} className="shrink-0" /> {order.customer.phone}
                </a>
              )}
            </div>
          </div>

          <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
            <div className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 mb-4">Items Ordered</div>
            <div className="space-y-3">
              {order.items.length === 0 ? (
                <p className="text-ivory-300/25 text-xs font-mono">No items recorded</p>
              ) : order.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-xs pb-3 border-b border-white/[0.05] last:border-0 last:pb-0">
                  <div>
                    <div className="text-white font-semibold">{item.name}</div>
                    <div className="text-ivory-300/35 font-mono">{item.qty} {item.unit} × {formatPHP(item.unitPrice)}</div>
                  </div>
                  <div className="text-ivory-300/70 font-mono shrink-0">{formatPHP(item.qty * item.unitPrice)}</div>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="text-ivory-300/40 text-xs font-mono">Est. Total</span>
                <span className="text-white font-black text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {formatPHP(order.estimatedTotal)}
                </span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 mb-3">Customer Notes</div>
              <p className="text-ivory-300/60 text-xs leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-5">
          {sent && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm"
              style={{ background: 'rgba(45,176,75,0.08)', border: '1px solid rgba(45,176,75,0.25)', color: 'var(--wp-green)' }}>
              <CheckCircle size={15} /> Email saved to thread for {order.customer.email}
            </div>
          )}

          {!composing && (
            <div className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
              <div className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 mb-4">Quick Email Actions</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Send Quote',      template: 'quote',    color: '#FBB03B' },
                  { label: 'Request Artwork', template: 'artwork',  color: '#29ABE2' },
                  { label: 'Order Printing',  template: 'printing', color: '#2DB04B' },
                  { label: 'Order Complete',  template: 'completed',color: '#2DB04B' },
                  { label: 'Custom Email',    template: 'custom',   color: '#888'    },
                ].map(btn => (
                  <button key={btn.template} onClick={() => openTemplate(btn.template)}
                    className="flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono border transition-all hover:opacity-90"
                    style={{ background: `${btn.color}10`, borderColor: `${btn.color}30`, color: btn.color }}>
                    <Mail size={11} /> {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {composing && (
            <form onSubmit={handleSendEmail}
              className="bg-ink-800 border border-wp-green/20 rounded-sm overflow-hidden"
              style={{ boxShadow: '0 0 0 1px rgba(45,176,75,0.1)' }}>
              <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between"
                style={{ background: 'rgba(45,176,75,0.06)' }}>
                <div className="flex items-center gap-2">
                  <Mail size={13} style={{ color: 'var(--wp-green)' }} />
                  <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">New Email</span>
                </div>
                <button type="button" onClick={() => setComposing(false)}
                  className="text-[10px] font-mono text-ivory-300/30 hover:text-white transition-colors">
                  Discard
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 w-12">To</span>
                  <span className="text-ivory-300/70 text-sm">{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30 w-12">Subject</span>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required
                    className="flex-1 bg-transparent text-sm text-white placeholder-ivory-300/20 outline-none"
                    placeholder="Email subject…" />
                </div>
                <textarea value={body} onChange={e => setBody(e.target.value)} required rows={16}
                  className="w-full bg-transparent text-sm text-ivory-200 placeholder-ivory-300/20 outline-none resize-none font-mono leading-relaxed"
                  placeholder="Write your message…" />
              </div>
              <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-[10px] font-mono text-ivory-300/25">From: hello@wellprint.com.ph</p>
                <button type="submit" disabled={sending}
                  className="btn-press flex items-center gap-2 text-sm disabled:opacity-60">
                  {sending
                    ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                    : <><Send size={13} /> Save to Thread</>}
                </button>
              </div>
            </form>
          )}

          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(41,171,226,0.04)' }}>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--wp-cyan)' }}>
                Email Thread ({order.emailThread.length})
              </span>
            </div>
            {order.emailThread.length === 0 ? (
              <div className="py-12 text-center">
                <Mail size={24} className="mx-auto mb-3 text-ivory-300/15" />
                <p className="text-ivory-300/30 text-xs font-mono">No emails sent yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {[...order.emailThread].reverse().map((email, i) => (
                  <div key={i} className="p-5">
                    <div className="flex items-center justify-between mb-3 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-sm flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(41,171,226,0.1)', border: '1px solid rgba(41,171,226,0.2)' }}>
                          <Mail size={11} style={{ color: 'var(--wp-cyan)' }} />
                        </div>
                        <span className="text-white text-xs font-semibold">{email.subject}</span>
                      </div>
                      <span className="text-ivory-300/25 text-[10px] font-mono shrink-0">{formatDate(email.at)}</span>
                    </div>
                    {email.by && <p className="text-ivory-300/30 text-[10px] font-mono mb-2">Sent by {email.by}</p>}
                    <pre className="text-ivory-300/50 text-xs leading-relaxed whitespace-pre-wrap font-mono bg-ink-900 rounded-sm p-4 border border-white/[0.05] overflow-auto max-h-48">
                      {email.body}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}