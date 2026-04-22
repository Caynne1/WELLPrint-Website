import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import {
  Package,
  Search,
  Filter,
  Loader2,
  Eye,
  Clock3,
  CheckCircle2,
  Printer,
  Truck,
  Store,
  RefreshCw,
  ShoppingBag,
  CalendarDays,
  Trash2,
  ChevronDown,
} from 'lucide-react'

const STATUS_OPTIONS = [
  { key: 'all', label: 'All Status' },
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'printing', label: 'Printing' },
  { key: 'ready', label: 'Ready' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const QUICK_STATUS_OPTIONS = [
  'pending',
  'processing',
  'printing',
  'ready',
  'completed',
  'cancelled',
]

const STATUS_STYLES = {
  pending: {
    bg: 'rgba(25,147,210,0.10)',
    border: 'rgba(25,147,210,0.20)',
    color: '#1993D2',
    icon: Clock3,
    label: 'Pending',
  },
  processing: {
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.20)',
    color: '#f59e0b',
    icon: ShoppingBag,
    label: 'Processing',
  },
  printing: {
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.20)',
    color: '#8b5cf6',
    icon: Printer,
    label: 'Printing',
  },
  ready: {
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.20)',
    color: '#10b981',
    icon: CheckCircle2,
    label: 'Ready',
  },
  completed: {
    bg: 'rgba(22,163,74,0.10)',
    border: 'rgba(22,163,74,0.20)',
    color: '#16a34a',
    icon: CheckCircle2,
    label: 'Completed',
  },
  cancelled: {
    bg: 'rgba(220,38,38,0.10)',
    border: 'rgba(220,38,38,0.20)',
    color: '#dc2626',
    icon: Clock3,
    label: 'Cancelled',
  },
}

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

function getItemsArray(order) {
  if (!order?.items) return []
  if (Array.isArray(order.items)) return order.items
  try {
    return typeof order.items === 'string' ? JSON.parse(order.items) : []
  } catch {
    return []
  }
}

function getFulfillmentInfo(order) {
  const items = getItemsArray(order)
  const item = items.find((x) => x?.delivery_method)
  if (!item) return { label: '—', method: null, fee: 0 }

  return {
    method: item.delivery_method,
    fee: item.delivery_fee || 0,
    label:
      item.delivery_method === 'deliver'
        ? `Delivery (+${formatPeso(item.delivery_fee || 0)})`
        : 'Pickup',
  }
}

function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.pending
  const Icon = config.icon

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{
        background: config.bg,
        borderColor: config.border,
        color: config.color,
      }}
    >
      <Icon size={12} />
      {config.label}
    </span>
  )
}

function SummaryCard({ title, value, icon: Icon, color, isLight }) {
  return (
    <div
      className="rounded-[24px] border p-5"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
        borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
        boxShadow: isLight
          ? '0 10px 30px rgba(15,23,42,0.05)'
          : '0 10px 30px rgba(0,0,0,0.24)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-xs uppercase tracking-[0.18em] mb-2"
            style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)' }}
          >
            {title}
          </p>
          <h3
            className="text-2xl font-bold"
            style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
          >
            {value}
          </h3>
        </div>

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}24`,
            color,
          }}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [changingStatusId, setChangingStatusId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } else {
      setOrders(data || [])
    }

    setLoading(false)
  }

  async function updateOrderStatus(orderId, nextStatus) {
    setChangingStatusId(orderId)

    try {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return

      const timestamps = order.status_timestamps || {}
      timestamps[nextStatus] = new Date().toISOString()

      const { data, error } = await supabase
        .from('orders')
        .update({
          status: nextStatus,
          status_timestamps: timestamps,
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        console.error('Failed to update status:', error)
        return
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? data : o)))
    } finally {
      setChangingStatusId(null)
    }
  }

  async function deleteCancelledOrder(orderId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this cancelled order? This cannot be undone.'
    )
    if (!confirmed) return

    setDeletingId(orderId)

    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId)
      if (error) {
        console.error('Failed to delete order:', error)
        return
      }

      setOrders((prev) => prev.filter((o) => o.id !== orderId))
    } finally {
      setDeletingId(null)
    }
  }

  const filteredOrders = useMemo(() => {
    let result = [...orders]

    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      result = result.filter((order) => {
        const name = (order.customer_name || '').toLowerCase()
        const orderId = (order.id || '').toLowerCase()
        const email = (order.customer_email || '').toLowerCase()
        return (
          name.includes(keyword) ||
          orderId.includes(keyword) ||
          email.includes(keyword)
        )
      })
    }

    if (selectedDate) {
      result = result.filter((order) => {
        if (!order.created_at) return false
        const orderDate = new Date(order.created_at)
        const yyyy = orderDate.getFullYear()
        const mm = String(orderDate.getMonth() + 1).padStart(2, '0')
        const dd = String(orderDate.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}` === selectedDate
      })
    }

    return result
  }, [orders, statusFilter, search, selectedDate])

  const summary = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      completed: orders.filter((o) => o.status === 'completed').length,
    }
  }, [orders])

  const sectionBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const sectionBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const sectionShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const tableHeadBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)'
  const tableRowBorder = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)'

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
              <Package size={15} style={{ color: '#1993D2' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Orders Management
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Orders
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            Monitor, filter, and review customer orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: sectionBg,
            border: `1px solid ${sectionBorder}`,
            color: subText,
            boxShadow: sectionShadow,
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-7">
        <SummaryCard title="Total Orders" value={summary.total} icon={Package} color="#1993D2" isLight={isLight} />
        <SummaryCard title="Pending" value={summary.pending} icon={Clock3} color="#1993D2" isLight={isLight} />
        <SummaryCard title="Processing" value={summary.processing} icon={ShoppingBag} color="#f59e0b" isLight={isLight} />
        <SummaryCard title="Ready" value={summary.ready} icon={CheckCircle2} color="#10b981" isLight={isLight} />
        <SummaryCard title="Completed" value={summary.completed} icon={CheckCircle2} color="#16a34a" isLight={isLight} />
      </div>

      <div
        className="rounded-[24px] border p-5 mb-7"
        style={{
          background: sectionBg,
          borderColor: sectionBorder,
          boxShadow: sectionShadow,
        }}
      >
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex gap-3 flex-wrap">
            <div className="relative min-w-[260px]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: muted }}
              />
              <input
                type="text"
                placeholder="Search by Order ID, customer, or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[16px] border pl-9 pr-4 py-3 text-sm outline-none"
                style={{
                  background: softBg,
                  borderColor: softBorder,
                  color: heading,
                }}
              />
            </div>

            <div>
              <label
                className="block text-[11px] uppercase tracking-[0.18em] font-semibold mb-2"
                style={{ color: muted }}
              >
                Select Date
              </label>
              <div className="relative">
                <CalendarDays
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: muted }}
                />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-[16px] border pl-9 pr-4 py-3 text-sm outline-none min-w-[190px]"
                  style={{
                    background: softBg,
                    borderColor: softBorder,
                    color: heading,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[11px] uppercase tracking-[0.18em] font-semibold mb-2"
                style={{ color: muted }}
              >
                Status
              </label>
              <div className="relative min-w-[190px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-[16px] border pl-4 pr-10 py-3 text-sm outline-none w-full"
                  style={{
                    background: softBg,
                    borderColor: softBorder,
                    color: heading,
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: muted }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-[24px] border overflow-hidden"
        style={{
          background: sectionBg,
          borderColor: sectionBorder,
          boxShadow: sectionShadow,
        }}
      >
        <div className="px-6 py-5 border-b flex items-center gap-2" style={{ borderColor: tableRowBorder }}>
          <Filter size={15} style={{ color: muted }} />
          <span className="text-sm font-semibold" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
            Orders ({filteredOrders.length})
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-2" style={{ color: subText }}>
              <Loader2 size={16} className="animate-spin" />
              Loading orders...
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={32} className="mx-auto mb-3" style={{ color: muted }} />
            <p className="text-sm" style={{ color: subText }}>No orders found for this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr style={{ background: tableHeadBg }}>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Order
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Fulfillment
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Quick Update
                  </th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: muted }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const fulfillment = getFulfillmentInfo(order)
                  const items = getItemsArray(order)
                  const canDelete = order.status === 'cancelled'

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors"
                      style={{ borderTop: `1px solid ${tableRowBorder}` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isLight
                          ? 'rgba(248,250,252,0.70)'
                          : 'rgba(255,255,255,0.03)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <td className="px-6 py-5 align-top">
                        <div>
                          <p className="font-semibold" style={{ color: heading }}>{order.id}</p>
                          <p className="text-xs mt-1" style={{ color: muted }}>
                            {items.length} item{items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div>
                          <p className="font-medium" style={{ color: heading }}>
                            {order.customer_name || '—'}
                          </p>
                          <p className="text-xs mt-1" style={{ color: muted }}>
                            {order.customer_email || '—'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                          style={{
                            background:
                              fulfillment.method === 'deliver'
                                ? 'rgba(139,92,246,0.10)'
                                : 'rgba(16,185,129,0.10)',
                            borderColor:
                              fulfillment.method === 'deliver'
                                ? 'rgba(139,92,246,0.18)'
                                : 'rgba(16,185,129,0.18)',
                            color:
                              fulfillment.method === 'deliver'
                                ? '#8b5cf6'
                                : '#10b981',
                          }}
                        >
                          {fulfillment.method === 'deliver' ? <Truck size={12} /> : <Store size={12} />}
                          {fulfillment.label}
                        </span>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <p className="font-semibold" style={{ color: heading }}>
                          {formatPeso(order.total_amount || order.estimated_total)}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-6 py-5 align-top">
                        <div className="relative min-w-[160px]">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={changingStatusId === order.id}
                            className="appearance-none rounded-[14px] border pl-3 pr-9 py-2.5 text-sm outline-none w-full"
                            style={{
                              background: softBg,
                              borderColor: softBorder,
                              color: heading,
                            }}
                          >
                            {QUICK_STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_STYLES[status]?.label || status}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: muted }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-5 align-top">
                        <p className="text-sm" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
                          {formatDate(order.created_at)}
                        </p>
                      </td>

                      <td className="px-6 py-5 align-top text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/dashboard/orders/${order.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                            style={{
                              background: isLight
                                ? 'rgba(25,147,210,0.08)'
                                : 'rgba(25,147,210,0.14)',
                              color: '#1993D2',
                              borderColor: 'rgba(25,147,210,0.16)',
                            }}
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          {canDelete && (
                            <button
                              onClick={() => deleteCancelledOrder(order.id)}
                              disabled={deletingId === order.id}
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                              style={{
                                background: 'rgba(220,38,38,0.10)',
                                color: '#dc2626',
                                borderColor: 'rgba(220,38,38,0.16)',
                              }}
                            >
                              {deletingId === order.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}