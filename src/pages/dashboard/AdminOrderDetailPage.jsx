import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import {
  CheckCircle,
  Circle,
  Loader2,
  Clock3,
  Package,
  FileText,
  Save,
  Printer,
  User,
  MapPin,
  Phone,
  Mail,
  StickyNote,
  Link as LinkIcon,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Download,
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
  magenta: '#CD1B6E',
  slate: '#64748b',
  violet: '#8b5cf6',
  red: '#dc2626',
}

function getStepColor(status, isActive) {
  if (!isActive) return '#cbd5e1'

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

function isImageFile(url = '') {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
}

function SectionCard({ title, icon: Icon, children, subtitle, isLight }) {
  return (
    <div
      className="rounded-[24px] border p-6"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
        borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
        boxShadow: isLight
          ? '0 10px 30px rgba(15,23,42,0.05)'
          : '0 10px 30px rgba(0,0,0,0.24)',
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(25,147,210,0.10)',
            border: '1px solid rgba(25,147,210,0.18)',
          }}
        >
          <Icon size={16} style={{ color: COLORS.cyan }} />
        </div>

        <div>
          <div
            className="text-base font-semibold"
            style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              className="text-sm mt-0.5"
              style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)' }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  )
}

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [toast, setToast] = useState(null)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [id])

  function showToast(msg, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2500)
  }

  async function fetchOrder() {
    setLoading(true)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (!error && data) {
      setOrder(data)
      setNotes(data.notes || '')
    }

    setLoading(false)
  }

  async function updateStatus(newStatus) {
    if (!order) return

    setUpdating(true)

    try {
      const timestamps = order.status_timestamps || {}
      timestamps[newStatus] = new Date().toISOString()

      const { data, error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          status_timestamps: timestamps,
        })
        .eq('id', order.id)
        .select()
        .single()

      if (error) {
        console.error('Update status error:', error)
        showToast(error.message || 'Failed to update status.', false)
        setUpdating(false)
        return
      }

      setOrder(data)
      showToast(`Order marked as ${STATUS_LABELS[newStatus]}.`)
    } catch (err) {
      console.error('Unexpected update error:', err)
      showToast('Something went wrong while updating status.', false)
    }

    setUpdating(false)
  }

  async function saveNotes() {
    if (!order) return

    setSavingNotes(true)

    const { error } = await supabase
      .from('orders')
      .update({ notes })
      .eq('id', order.id)

    if (!error) {
      setOrder((prev) => ({ ...prev, notes }))
      showToast('Notes saved')
    } else {
      showToast('Failed to save notes', false)
    }

    setSavingNotes(false)
  }

  function printInvoice() {
    window.print()
  }

  const currentIndex = useMemo(
    () => STATUS_FLOW.indexOf(order?.status),
    [order?.status]
  )

  const items = useMemo(() => {
    if (!order?.items) return []
    if (Array.isArray(order.items)) return order.items
    try {
      return typeof order.items === 'string' ? JSON.parse(order.items) : []
    } catch {
      return []
    }
  }, [order?.items])

  const designInfo = useMemo(() => {
    const firstItemWithDesign = items.find(
      (item) => item?.design_option || item?.design_file_name || item?.layout_request
    )

    return {
      option: firstItemWithDesign?.design_option || null,
      fileName: firstItemWithDesign?.design_file_name || null,
      layoutRequest: !!firstItemWithDesign?.layout_request,
      deliveryMethod: firstItemWithDesign?.delivery_method || null,
      deliveryFee: firstItemWithDesign?.delivery_fee || 0,
    }
  }, [items])

  const panelBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const panelBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const panelShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'

  if (loading) {
    return (
      <AdminLayout>
        <div
          className="py-20 text-center rounded-[24px] border"
          style={{
            background: panelBg,
            borderColor: panelBorder,
            boxShadow: panelShadow,
          }}
        >
          <div className="inline-flex items-center gap-2" style={{ color: subText }}>
            <Loader2 size={16} className="animate-spin" />
            Loading order...
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout>
        <div
          className="py-20 text-center rounded-[24px] border"
          style={{
            background: panelBg,
            borderColor: panelBorder,
            boxShadow: panelShadow,
          }}
        >
          <p style={{ color: subText }}>Order not found</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(25,147,210,0.10)',
                border: '1px solid rgba(25,147,210,0.20)',
              }}
            >
              <Package size={15} style={{ color: COLORS.cyan }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Order Detail
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Order #{String(order.id)}
          </h1>

          <p className="text-sm" style={{ color: subText }}>
            Track and manage order progress
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchOrder}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{
              background: panelBg,
              border: `1px solid ${panelBorder}`,
              color: subText,
              boxShadow: panelShadow,
            }}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            onClick={printInvoice}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{
              background: 'rgba(25,147,210,0.10)',
              border: '1px solid rgba(25,147,210,0.20)',
              color: COLORS.cyan,
            }}
          >
            <Printer size={14} />
            Print Invoice
          </button>
        </div>
      </div>

      <div
        className="rounded-[24px] border p-6 mb-7"
        style={{
          background: panelBg,
          borderColor: panelBorder,
          boxShadow: panelShadow,
        }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock3 size={16} style={{ color: COLORS.cyan }} />
          <span
            className="text-[10px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: muted }}
          >
            Order Progress
          </span>
        </div>

        <div className="relative overflow-x-auto">
          <div className="min-w-[720px] relative px-2 pt-1">
            <div
              className="absolute top-4 left-4 right-4 h-[3px] rounded-full"
              style={{ background: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.10)' }}
            />

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
                        background: active ? color : (isLight ? '#FFFFFF' : '#081225'),
                        borderColor: active ? color : (isLight ? '#cbd5e1' : 'rgba(255,255,255,0.12)'),
                        color: active ? '#FFFFFF' : '#94a3b8',
                      }}
                    >
                      {active ? <CheckCircle size={14} /> : <Circle size={12} />}
                    </div>

                    <p className="text-xs mt-3 font-medium" style={{ color: isLight ? '#334155' : '#f8fafc' }}>
                      {STATUS_LABELS[status]}
                    </p>

                    <p className="text-[10px] mt-1 min-h-[28px]" style={{ color: muted }}>
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
        className="rounded-[24px] border p-6 mb-7"
        style={{
          background: panelBg,
          borderColor: panelBorder,
          boxShadow: panelShadow,
        }}
      >
        <div
          className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-4"
          style={{ color: muted }}
        >
          Update Status
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((status) => {
            const isCurrent = order.status === status

            return (
              <button
                key={status}
                disabled={isCurrent || updating}
                onClick={() => updateStatus(status)}
                className="px-4 py-2 rounded-[14px] text-xs font-semibold border transition-all disabled:opacity-60"
                style={{
                  background: isCurrent ? 'rgba(22,163,74,0.10)' : (isLight ? '#FFFFFF' : softBg),
                  color: isCurrent ? COLORS.green : subText,
                  borderColor: isCurrent ? 'rgba(22,163,74,0.22)' : softBorder,
                }}
              >
                {updating && isCurrent ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 size={12} className="animate-spin" />
                    {STATUS_LABELS[status]}
                  </span>
                ) : (
                  STATUS_LABELS[status]
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <SectionCard
            title="Order Details"
            icon={FileText}
            subtitle="Basic information about this order"
            isLight={isLight}
          >
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-1" style={{ color: muted }}>Order ID</p>
                <p className="font-medium" style={{ color: heading }}>{String(order.id)}</p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Status</p>
                <p className="font-medium capitalize" style={{ color: heading }}>{order.status || '—'}</p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Created</p>
                <p className="font-medium" style={{ color: heading }}>{formatDateTime(order.created_at)}</p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Total Amount</p>
                <p className="font-semibold" style={{ color: heading }}>
                  {formatPeso(order.total_amount || order.estimated_total)}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Customer Information"
            icon={User}
            subtitle="Customer contact and address"
            isLight={isLight}
          >
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-1" style={{ color: muted }}>Name</p>
                <p className="font-medium flex items-center gap-2" style={{ color: heading }}>
                  <User size={13} style={{ color: muted }} />
                  {order.customer_name || '—'}
                </p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Phone</p>
                <p className="font-medium flex items-center gap-2" style={{ color: heading }}>
                  <Phone size={13} style={{ color: muted }} />
                  {order.customer_phone || '—'}
                </p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Email</p>
                <p className="font-medium flex items-center gap-2" style={{ color: heading }}>
                  <Mail size={13} style={{ color: muted }} />
                  {order.customer_email || '—'}
                </p>
              </div>

              <div>
                <p className="mb-1" style={{ color: muted }}>Address</p>
                <p className="font-medium flex items-start gap-2" style={{ color: heading }}>
                  <MapPin size={13} style={{ color: muted, marginTop: '2px' }} />
                  <span>{order.customer_address || '—'}</span>
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Order Items"
            icon={Package}
            subtitle="Products included in this order"
            isLight={isLight}
          >
            {items.length === 0 ? (
              <p className="text-sm" style={{ color: muted }}>No structured order items saved.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-[18px] border p-4"
                    style={{
                      borderColor: softBorder,
                      background: softBg,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-medium" style={{ color: heading }}>
                          {item.name || item.product_name || `Item ${index + 1}`}
                        </p>
                        <p className="text-sm mt-1" style={{ color: muted }}>
                          Qty: {item.qty || item.quantity || 1}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold" style={{ color: heading }}>
                          {formatPeso(
                            item.total ||
                              item.subtotal ||
                              item.price ||
                              (item.unit_price || 0) * (item.qty || 1)
                          )}
                        </p>
                        <p className="text-xs mt-1" style={{ color: muted }}>
                          {item.unitPrice
                            ? `${formatPeso(item.unitPrice)} / unit`
                            : item.unit_price
                            ? `${formatPeso(item.unit_price)} / unit`
                            : ''}
                        </p>
                      </div>
                    </div>

                    {item.selections && Object.keys(item.selections).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(item.selections).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'rgba(25,147,210,0.08)',
                              color: COLORS.cyan,
                              border: '1px solid rgba(25,147,210,0.14)',
                            }}
                          >
                            <strong>{key}:</strong> {String(value)}
                          </span>
                        ))}
                      </div>
                    )}

                    {(item.design_option || item.design_file_name || item.layout_request || item.delivery_method) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.design_option && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'rgba(22,163,74,0.08)',
                              color: COLORS.green,
                              border: '1px solid rgba(22,163,74,0.14)',
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

                        {item.design_file_name && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'rgba(100,116,139,0.08)',
                              color: isLight ? COLORS.slate : '#cbd5e1',
                              border: '1px solid rgba(100,116,139,0.14)',
                            }}
                          >
                            File: {item.design_file_name}
                          </span>
                        )}

                        {item.layout_request && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'rgba(245,158,11,0.08)',
                              color: COLORS.amber,
                              border: '1px solid rgba(245,158,11,0.14)',
                            }}
                          >
                            Layout Assistance Requested
                          </span>
                        )}

                        {item.delivery_method && (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              background: 'rgba(139,92,246,0.08)',
                              color: COLORS.violet,
                              border: '1px solid rgba(139,92,246,0.14)',
                            }}
                          >
                            {item.delivery_method === 'deliver'
                              ? `Delivery (+${formatPeso(item.delivery_fee || 0)})`
                              : 'Pickup'}
                          </span>
                        )}
                      </div>
                    )}

                    {order.design_file_url && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={order.design_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(25,147,210,0.08)',
                            color: COLORS.cyan,
                            borderColor: 'rgba(25,147,210,0.16)',
                          }}
                        >
                          <ExternalLink size={14} />
                          View File
                        </a>

                        <a
                          href={order.design_file_url}
                          download={item.design_file_name || designInfo.fileName || 'customer-file'}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(22,163,74,0.08)',
                            color: COLORS.green,
                            borderColor: 'rgba(22,163,74,0.16)',
                          }}
                        >
                          <Download size={14} />
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <SectionCard
            title="Design Submission"
            icon={ImageIcon}
            subtitle="Customer-uploaded or referenced design file"
            isLight={isLight}
          >
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-1" style={{ color: muted }}>Design Method</p>
                  <p className="font-medium" style={{ color: heading }}>
                    {designInfo.option === 'upload'
                      ? 'Uploaded Design'
                      : designInfo.option === 'email'
                      ? 'Will Email Design'
                      : designInfo.layoutRequest
                      ? 'Needs Layout Assistance'
                      : '—'}
                  </p>
                </div>

                <div>
                  <p className="mb-1" style={{ color: muted }}>Reference File Name</p>
                  <p className="font-medium break-all" style={{ color: heading }}>
                    {designInfo.fileName || '—'}
                  </p>
                </div>
              </div>

              {!order.design_file_url ? (
                <div
                  className="rounded-[18px] border p-4 text-sm"
                  style={{
                    borderColor: softBorder,
                    background: softBg,
                  }}
                >
                  <p style={{ color: subText }}>No uploaded file URL saved for this order yet.</p>
                </div>
              ) : (
                <div
                  className="rounded-[18px] border p-4"
                  style={{
                    borderColor: softBorder,
                    background: softBg,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <LinkIcon size={14} style={{ color: muted }} />
                    <span className="text-sm font-medium" style={{ color: heading }}>
                      Uploaded Design File
                    </span>
                  </div>

                  {isImageFile(order.design_file_url) ? (
                    <div className="space-y-4">
                      <div
                        className="rounded-[16px] overflow-hidden border"
                        style={{
                          borderColor: softBorder,
                          background: isLight ? '#ffffff' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <img
                          src={order.design_file_url}
                          alt="Customer design"
                          className="w-full max-h-[360px] object-contain"
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={order.design_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(25,147,210,0.08)',
                            color: COLORS.cyan,
                            borderColor: 'rgba(25,147,210,0.16)',
                          }}
                        >
                          <ExternalLink size={14} />
                          View Full Image
                        </a>

                        <a
                          href={order.design_file_url}
                          download={designInfo.fileName || 'customer-design'}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(22,163,74,0.08)',
                            color: COLORS.green,
                            borderColor: 'rgba(22,163,74,0.16)',
                          }}
                        >
                          <Download size={14} />
                          Download File
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm break-all" style={{ color: subText }}>
                        {order.design_file_url}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={order.design_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(25,147,210,0.08)',
                            color: COLORS.cyan,
                            borderColor: 'rgba(25,147,210,0.16)',
                          }}
                        >
                          <ExternalLink size={14} />
                          View File
                        </a>

                        <a
                          href={order.design_file_url}
                          download={designInfo.fileName || 'customer-file'}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                          style={{
                            background: 'rgba(22,163,74,0.08)',
                            color: COLORS.green,
                            borderColor: 'rgba(22,163,74,0.16)',
                          }}
                        >
                          <Download size={14} />
                          Download File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Admin Notes"
            icon={StickyNote}
            subtitle="Internal notes for this order"
            isLight={isLight}
          >
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={7}
              placeholder="Add admin comments here..."
              className="w-full rounded-[18px] border px-4 py-3 text-sm outline-none resize-none"
              style={{
                background: softBg,
                borderColor: softBorder,
                color: heading,
              }}
            />

            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold transition-all"
              style={{
                background: 'rgba(22,163,74,0.10)',
                border: '1px solid rgba(22,163,74,0.22)',
                color: COLORS.green,
              }}
            >
              {savingNotes ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Notes
            </button>
          </SectionCard>

          <SectionCard
            title="Customer Receipt View"
            icon={FileText}
            subtitle="Simple receipt-style preview"
            isLight={isLight}
          >
            <div
              className="rounded-[18px] border p-4"
              style={{ borderColor: softBorder, background: softBg }}
            >
              <div
                className="text-center pb-4 border-b"
                style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}
              >
                <p className="font-semibold" style={{ color: heading }}>WELLPrint</p>
                <p className="text-xs mt-1" style={{ color: muted }}>Customer Receipt Preview</p>
              </div>

              <div className="py-4 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span style={{ color: muted }}>Order No.</span>
                  <span className="font-medium" style={{ color: heading }}>{String(order.id)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: muted }}>Customer</span>
                  <span className="font-medium text-right" style={{ color: heading }}>
                    {order.customer_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: muted }}>Date</span>
                  <span className="font-medium" style={{ color: heading }}>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: muted }}>Status</span>
                  <span className="font-medium capitalize" style={{ color: heading }}>{order.status || '—'}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: muted }}>Fulfillment</span>
                  <span className="font-medium capitalize" style={{ color: heading }}>
                    {designInfo.deliveryMethod === 'deliver'
                      ? `Deliver (+${formatPeso(designInfo.deliveryFee || 0)})`
                      : designInfo.deliveryMethod === 'pickup'
                      ? 'Pickup'
                      : '—'}
                  </span>
                </div>
              </div>

              <div
                className="pt-4 border-t"
                style={{ borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)' }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium" style={{ color: subText }}>Total</span>
                  <span className="font-bold text-lg" style={{ color: heading }}>
                    {formatPeso(order.total_amount || order.estimated_total)}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-[16px] border text-sm"
          style={{
            background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.98)',
            borderColor: toast.ok ? 'rgba(22,163,74,0.22)' : 'rgba(220,38,38,0.22)',
            color: toast.ok ? COLORS.green : COLORS.red,
            boxShadow: isLight
              ? '0 20px 60px rgba(15,23,42,0.14)'
              : '0 20px 60px rgba(0,0,0,0.30)',
          }}
        >
          {toast.ok ? <CheckCircle size={14} /> : <Circle size={14} />}
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  )
}