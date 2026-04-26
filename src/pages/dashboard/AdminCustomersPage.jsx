import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/DashboardThemeContext'
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  ShoppingBag,
  CalendarDays,
  TrendingUp,
  UserCheck,
  Package,
} from 'lucide-react'

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

function timeAgo(value) {
  if (!value) return '—'
  try {
    const diff = Date.now() - new Date(value).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 30) return `${days}d ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    return `${Math.floor(days / 365)}y ago`
  } catch {
    return '—'
  }
}

function groupOrdersByCustomer(orders) {
  const map = new Map()

  for (const order of orders) {
    const email = (order.customer_email || '').toLowerCase().trim()
    const key = email || (order.customer_name || '').toLowerCase().trim()
    if (!key) continue

    if (!map.has(key)) {
      map.set(key, {
        email: order.customer_email || '',
        name: order.customer_name || '—',
        phone: order.customer_phone || '',
        orderCount: 0,
        totalSpent: 0,
        firstOrderAt: order.created_at,
        lastOrderAt: order.created_at,
        orders: [],
      })
    }

    const c = map.get(key)
    c.orderCount += 1
    c.totalSpent += Number(order.total_amount || order.estimated_total || 0)
    c.orders.push(order.id)

    if (order.created_at && order.created_at < c.firstOrderAt) {
      c.firstOrderAt = order.created_at
    }
    if (order.created_at && order.created_at > c.lastOrderAt) {
      c.lastOrderAt = order.created_at
    }
    if (!c.phone && order.customer_phone) {
      c.phone = order.customer_phone
    }
    if (c.name === '—' && order.customer_name) {
      c.name = order.customer_name
    }
  }

  return Array.from(map.values())
}

function SummaryCard({ title, value, icon: Icon, color, isLight }) {
  return (
    <div
      className="rounded-[24px] border p-5"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
        borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
        boxShadow: isLight ? '0 10px 30px rgba(15,23,42,0.05)' : '0 10px 30px rgba(0,0,0,0.24)',
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
          <h3 className="text-2xl font-bold" style={{ color: isLight ? '#0f172a' : '#f8fafc' }}>
            {value}
          </h3>
        </div>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${color}14`, border: `1px solid ${color}24`, color }}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

const SORT_FIELDS = [
  { key: 'orderCount', label: 'Most Orders' },
  { key: 'totalSpent', label: 'Highest Spend' },
  { key: 'lastOrderAt', label: 'Recent Activity' },
  { key: 'firstOrderAt', label: 'Oldest Customer' },
  { key: 'name', label: 'Name A–Z' },
]

export default function AdminCustomersPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('lastOrderAt')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('id, customer_name, customer_email, customer_phone, total_amount, estimated_total, created_at, status')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  const customers = useMemo(() => groupOrdersByCustomer(orders), [orders])

  const filtered = useMemo(() => {
    let result = [...customers]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let av = a[sortKey]
      let bv = b[sortKey]

      if (sortKey === 'name') {
        av = av.toLowerCase()
        bv = bv.toLowerCase()
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }

      if (sortKey === 'firstOrderAt' || sortKey === 'lastOrderAt') {
        av = av ? new Date(av).getTime() : 0
        bv = bv ? new Date(bv).getTime() : 0
      }

      return sortDir === 'asc' ? av - bv : bv - av
    })

    return result
  }, [customers, search, sortKey, sortDir])

  const summary = useMemo(() => {
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const returning = customers.filter((c) => c.orderCount > 1).length
    return { total: customers.length, totalSpent, returning }
  }, [customers])

  const sectionBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const sectionBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const sectionShadow = isLight ? '0 10px 30px rgba(15,23,42,0.05)' : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const tableHeadBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)'
  const tableRowBorder = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)'

  function SortIcon({ field }) {
    if (sortKey !== field) return <ChevronDown size={12} style={{ color: muted, opacity: 0.4 }} />
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: '#1993D2' }} />
      : <ChevronDown size={12} style={{ color: '#1993D2' }} />
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}
            >
              <Users size={15} style={{ color: '#10b981' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Customer Management
            </span>
          </div>
          <h1 className="text-[2rem] font-bold mb-1 leading-none" style={{ color: heading }}>
            Customers
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            View all customers, their order history, and contact details
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{ background: sectionBg, border: `1px solid ${sectionBorder}`, color: subText, boxShadow: sectionShadow }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-7">
        <SummaryCard
          title="Total Customers"
          value={summary.total}
          icon={Users}
          color="#10b981"
          isLight={isLight}
        />
        <SummaryCard
          title="Returning Customers"
          value={summary.returning}
          icon={UserCheck}
          color="#1993D2"
          isLight={isLight}
        />
        <SummaryCard
          title="Total Revenue"
          value={formatPeso(summary.totalSpent)}
          icon={TrendingUp}
          color="#f59e0b"
          isLight={isLight}
        />
      </div>

      {/* Search + sort bar */}
      <div
        className="rounded-[24px] border p-5 mb-7"
        style={{ background: sectionBg, borderColor: sectionBorder, boxShadow: sectionShadow }}
      >
        <div className="flex gap-3 flex-wrap items-end">
          <div className="relative min-w-[280px] flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: muted }} />
            <input
              type="text"
              placeholder="Search by name, email, or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-[16px] border pl-9 pr-4 py-3 text-sm outline-none"
              style={{ background: softBg, borderColor: softBorder, color: heading }}
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold mb-2" style={{ color: muted }}>
              Sort By
            </label>
            <div className="relative min-w-[200px]">
              <select
                value={sortKey}
                onChange={(e) => { setSortKey(e.target.value); setSortDir(e.target.value === 'name' ? 'asc' : 'desc') }}
                className="appearance-none rounded-[16px] border pl-4 pr-10 py-3 text-sm outline-none w-full"
                style={{ background: isLight ? '#f8fafc' : '#1a2744', borderColor: softBorder, color: heading }}
              >
                {SORT_FIELDS.map((f) => (
                  <option
                    key={f.key}
                    value={f.key}
                    style={{ background: isLight ? '#ffffff' : '#1a2744', color: isLight ? '#0f172a' : '#f8fafc' }}
                  >
                    {f.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: muted }} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-[24px] border overflow-hidden"
        style={{ background: sectionBg, borderColor: sectionBorder, boxShadow: sectionShadow }}
      >
        <div className="px-6 py-5 border-b flex items-center gap-2" style={{ borderColor: tableRowBorder }}>
          <Users size={15} style={{ color: muted }} />
          <span className="text-sm font-semibold" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
            Customers ({filtered.length})
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-2" style={{ color: subText }}>
              <Loader2 size={16} className="animate-spin" />
              Loading customers…
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={32} className="mx-auto mb-3" style={{ color: muted }} />
            <p className="text-sm" style={{ color: subText }}>No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr style={{ background: tableHeadBg }}>
                  {[
                    { key: 'name', label: 'Customer' },
                    { key: null, label: 'Contact' },
                    { key: 'orderCount', label: 'Orders' },
                    { key: 'totalSpent', label: 'Total Spent' },
                    { key: 'firstOrderAt', label: 'First Order' },
                    { key: 'lastOrderAt', label: 'Last Order' },
                    { key: null, label: 'View Orders' },
                  ].map(({ key, label }) => (
                    <th
                      key={label}
                      className={`text-left px-6 py-4 text-[11px] uppercase tracking-[0.18em] font-semibold select-none ${key ? 'cursor-pointer' : ''}`}
                      style={{ color: muted }}
                      onClick={key ? () => handleSort(key) : undefined}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {label}
                        {key && <SortIcon field={key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((customer, i) => (
                  <tr
                    key={customer.email || customer.name + i}
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
                    {/* Customer name + email */}
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm"
                          style={{
                            background: isLight ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.14)',
                            border: '1px solid rgba(16,185,129,0.18)',
                            color: '#10b981',
                          }}
                        >
                          {(customer.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: heading }}>
                            {customer.name}
                          </p>
                          {customer.email && (
                            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: muted }}>
                              <Mail size={10} />
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 align-top">
                      {customer.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: subText }}>
                          <Phone size={12} style={{ color: muted }} />
                          {customer.phone}
                        </span>
                      ) : (
                        <span className="text-sm" style={{ color: muted }}>—</span>
                      )}
                    </td>

                    {/* Order count */}
                    <td className="px-6 py-5 align-top">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                        style={{
                          background: customer.orderCount > 1
                            ? 'rgba(25,147,210,0.10)'
                            : isLight ? 'rgba(15,23,42,0.04)' : 'rgba(255,255,255,0.04)',
                          borderColor: customer.orderCount > 1
                            ? 'rgba(25,147,210,0.20)'
                            : isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.08)',
                          color: customer.orderCount > 1 ? '#1993D2' : subText,
                        }}
                      >
                        <Package size={11} />
                        {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Total spent */}
                    <td className="px-6 py-5 align-top">
                      <p className="font-semibold text-sm" style={{ color: heading }}>
                        {formatPeso(customer.totalSpent)}
                      </p>
                    </td>

                    {/* First order */}
                    <td className="px-6 py-5 align-top">
                      <div>
                        <p className="text-sm" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
                          {formatDate(customer.firstOrderAt)}
                        </p>
                      </div>
                    </td>

                    {/* Last order */}
                    <td className="px-6 py-5 align-top">
                      <div>
                        <p className="text-sm" style={{ color: isLight ? '#334155' : '#e2e8f0' }}>
                          {formatDate(customer.lastOrderAt)}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: muted }}>
                          {timeAgo(customer.lastOrderAt)}
                        </p>
                      </div>
                    </td>

                    {/* View orders link */}
                    <td className="px-6 py-5 align-top">
                      <Link
                        to={`/dashboard/orders?search=${encodeURIComponent(customer.email || customer.name)}`}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                        style={{
                          background: isLight ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.14)',
                          color: '#10b981',
                          borderColor: 'rgba(16,185,129,0.18)',
                        }}
                      >
                        <ShoppingBag size={13} />
                        Orders
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
