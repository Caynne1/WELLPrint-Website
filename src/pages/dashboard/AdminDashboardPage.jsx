import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/DashboardThemeContext'
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Printer,
  Loader2,
  Inbox,
  ArrowUpRight,
  Mail,
} from 'lucide-react'

function formatPHP(n) {
  return '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0 })
}

function timeAgo(iso) {
  if (!iso) return '—'
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

const STATUS_STYLES = {
  pending: { bg: 'rgba(25,147,210,0.10)', border: 'rgba(25,147,210,0.22)', color: '#1993D2', label: 'Pending' },
  processing: { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)', color: '#f59e0b', label: 'Processing' },
  printing: { bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.22)', color: '#8b5cf6', label: 'Printing' },
  ready: { bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)', color: '#10b981', label: 'Ready' },
  completed: { bg: 'rgba(22,163,74,0.10)', border: 'rgba(22,163,74,0.22)', color: '#16a34a', label: 'Completed' },
  cancelled: { bg: 'rgba(220,38,38,0.10)', border: 'rgba(220,38,38,0.22)', color: '#dc2626', label: 'Cancelled' },
  new: { bg: 'rgba(205,27,110,0.10)', border: 'rgba(205,27,110,0.22)', color: '#CD1B6E', label: 'New' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span
      className="text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap"
      style={{ background: s.bg, borderColor: s.border, color: s.color }}
    >
      {s.label}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, color, sub, loading, href, isLight }) {
  const cardBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const cardBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const cardShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const textMain = isLight ? '#0f172a' : '#f8fafc'
  const textSub = isLight ? '#64748b' : 'rgba(226,232,240,0.82)'
  const textMuted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.88)'
  const arrowColor = isLight ? 'rgba(15,23,42,0.25)' : 'rgba(226,232,240,0.28)'

  const inner = (
    <div
      className="rounded-[22px] p-6 border transition-all hover:-translate-y-1 h-full"
      style={{
        background: cardBg,
        borderColor: cardBorder,
        boxShadow: cardShadow,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {href && <ArrowUpRight size={14} style={{ color: arrowColor }} />}
      </div>

      <div className="text-3xl font-black mb-0.5" style={{ color: textMain }}>
        {loading ? '—' : value}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: textSub }}>
        {label}
      </div>
      {sub && <div className="text-[10px] mt-1" style={{ color: textMuted }}>{sub}</div>}
    </div>
  )

  if (href) return <Link to={href} className="block h-full">{inner}</Link>
  return inner
}

function RevenueCard({ label, value, color, loading, isLight }) {
  return (
    <div
      className="rounded-[20px] p-5 border"
      style={{
        background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
        borderColor: isLight ? 'rgba(15,23,42,0.07)' : 'rgba(255,255,255,0.06)',
        boxShadow: isLight ? '0 6px 20px rgba(15,23,42,0.04)' : '0 10px 30px rgba(0,0,0,0.24)',
      }}
    >
      <div
        className="text-[10px] uppercase tracking-widest mb-2"
        style={{ color: isLight ? '#94a3b8' : 'rgba(148,163,184,0.90)' }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-black"
        style={{ color: loading ? (isLight ? '#ccc' : 'rgba(148,163,184,0.55)') : (isLight ? '#0f172a' : '#f8fafc') }}
      >
        {loading ? '—' : formatPHP(value)}
      </div>
      <div className="mt-2 h-1 rounded-full" style={{ background: `${color}20` }}>
        <div
          className="h-1 rounded-full transition-all duration-700"
          style={{ background: color, width: loading ? '0%' : '60%' }}
        />
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    staff: 0,
    pendingCount: 0,
    revenueToday: 0,
    revenueWeek: 0,
    revenueMonth: 0,
    inboxCount: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoadingStats(true)
    setLoadingOrders(true)

    const [products, allOrders, staff, inbox] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('staff_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
    ])

    const { count: pendingCount } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'new'])

    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)

    const startOfMonth = new Date(now)
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [dayRev, weekRev, monthRev] = await Promise.all([
      supabase.from('orders').select('estimated_total').gte('created_at', startOfDay.toISOString()).not('status', 'eq', 'cancelled'),
      supabase.from('orders').select('estimated_total').gte('created_at', startOfWeek.toISOString()).not('status', 'eq', 'cancelled'),
      supabase.from('orders').select('estimated_total').gte('created_at', startOfMonth.toISOString()).not('status', 'eq', 'cancelled'),
    ])

    const sum = (r) => (r.data || []).reduce((acc, row) => acc + (row.estimated_total || 0), 0)

    setStats({
      products: products.count || 0,
      orders: allOrders.count || 0,
      staff: staff.count || 0,
      pendingCount: pendingCount || 0,
      revenueToday: sum(dayRev),
      revenueWeek: sum(weekRev),
      revenueMonth: sum(monthRev),
      inboxCount: inbox.count || 0,
    })
    setLoadingStats(false)

    const { data: recent } = await supabase
      .from('orders')
      .select('id, created_at, status, customer_name, customer_email, estimated_total, order_type')
      .order('created_at', { ascending: false })
      .limit(8)

    setRecentOrders(recent || [])
    setLoadingOrders(false)
    setLastRefreshed(new Date())
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const ordersChannel = supabase
      .channel('dashboard-orders-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAll)
      .subscribe()

    const inboxChannel = supabase
      .channel('dashboard-inbox-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchAll)
      .subscribe()

    return () => {
      supabase.removeChannel(ordersChannel)
      supabase.removeChannel(inboxChannel)
    }
  }, [fetchAll])

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  const panelBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const panelBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const panelShadow = isLight ? '0 10px 30px rgba(15,23,42,0.05)' : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const rowBorder = isLight ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)'
  const topBarBg = isLight ? '#FFFFFF' : '#021022'

  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase mb-2" style={{ color: muted }}>
            Dashboard
          </p>
          <h1 className="text-3xl font-bold" style={{ color: heading }}>
            {greeting}
            {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: subText }}>
            Here's what's happening with WELLPrint today.
          </p>
        </div>

        <button
          onClick={fetchAll}
          className="flex items-center gap-2 text-xs rounded-xl px-3 py-2 transition-colors border"
          style={{
            color: subText,
            borderColor: isLight ? 'rgba(15,23,42,0.12)' : 'rgba(255,255,255,0.12)',
            background: topBarBg,
          }}
        >
          <RefreshCw size={12} />
          {lastRefreshed ? `Updated ${timeAgo(lastRefreshed)}` : 'Refresh'}
        </button>
      </div>

      {!loadingStats && stats.pendingCount > 0 && (
        <Link
          to="/dashboard/orders"
          className="flex items-center gap-3 mb-8 px-5 py-4 rounded-[18px] border transition-all hover:-translate-y-0.5"
          style={{
            background: isLight ? 'rgba(205,27,110,0.06)' : 'rgba(205,27,110,0.08)',
            borderColor: 'rgba(205,27,110,0.20)',
            boxShadow: isLight ? '0 4px 20px rgba(205,27,110,0.06)' : '0 4px 20px rgba(205,27,110,0.10)',
          }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(205,27,110,0.12)', border: '1px solid rgba(205,27,110,0.25)' }}
          >
            <AlertCircle size={15} style={{ color: '#CD1B6E' }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold" style={{ color: isLight ? '#1f2937' : '#f8fafc' }}>
              {stats.pendingCount} order{stats.pendingCount !== 1 ? 's' : ''} need{stats.pendingCount === 1 ? 's' : ''} attention
            </span>
            <span className="text-xs ml-2" style={{ color: subText }}>
              — tap to review pending orders
            </span>
          </div>
          <ArrowRight size={15} style={{ color: '#CD1B6E', flexShrink: 0 }} />
        </Link>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Total Orders"
          value={stats.orders}
          icon={ShoppingCart}
          color="#1993D2"
          sub={stats.pendingCount > 0 ? `${stats.pendingCount} pending` : 'All caught up'}
          loading={loadingStats}
          href="/dashboard/orders"
          isLight={isLight}
        />
        <StatCard
          label="Products"
          value={stats.products}
          icon={Package}
          color="#13A150"
          loading={loadingStats}
          href="/dashboard/products"
          isLight={isLight}
        />
        <StatCard
          label="Staff Members"
          value={stats.staff}
          icon={Users}
          color="#8b5cf6"
          loading={loadingStats}
          href="/dashboard/staff"
          isLight={isLight}
        />
        <StatCard
          label="This Month"
          value={loadingStats ? '—' : formatPHP(stats.revenueMonth)}
          icon={TrendingUp}
          color="#FDC010"
          sub={loadingStats ? '' : `Today: ${formatPHP(stats.revenueToday)}`}
          loading={false}
          isLight={isLight}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <RevenueCard label="Today's Revenue" value={stats.revenueToday} color="#13A150" loading={loadingStats} isLight={isLight} />
        <RevenueCard label="Last 7 Days" value={stats.revenueWeek} color="#1993D2" loading={loadingStats} isLight={isLight} />
        <RevenueCard label="This Month" value={stats.revenueMonth} color="#8b5cf6" loading={loadingStats} isLight={isLight} />
      </div>

      <div
        className="rounded-[22px] border overflow-hidden mb-10"
        style={{
          background: panelBg,
          borderColor: panelBorder,
          boxShadow: panelShadow,
        }}
      >
        <div
          className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: rowBorder }}
        >
          <div>
            <h2 className="text-2xl font-bold" style={{ color: heading }}>
              Recent Orders
            </h2>
            <p className="text-sm mt-1" style={{ color: subText }}>
              Latest customer orders and current progress
            </p>
          </div>

          <Link
            to="/dashboard/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: '#1993D2' }}
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-2" style={{ color: subText }}>
              <Loader2 size={16} className="animate-spin" />
              Loading recent orders...
            </div>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-20 text-center">
            <Inbox size={30} className="mx-auto mb-3" style={{ color: muted }} />
            <p className="text-sm" style={{ color: subText }}>No orders yet.</p>
          </div>
        ) : (
          <div>
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/dashboard/orders/${order.id}`}
                className="grid md:grid-cols-[1.6fr_1fr_auto_auto] gap-4 items-center px-6 py-5 transition-colors"
                style={{
                  borderTop: `1px solid ${rowBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isLight ? 'rgba(248,250,252,0.70)' : 'rgba(255,255,255,0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: heading }}>
                    {order.customer_name || 'Unknown Customer'}
                  </p>
                  <p className="text-sm truncate mt-0.5" style={{ color: subText }}>
                    {order.order_type || 'Order'}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: heading }}>
                    {order.id}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: muted }}>
                    {timeAgo(order.created_at)}
                  </p>
                </div>

                <div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="text-right">
                  <p className="font-bold" style={{ color: heading }}>
                    {formatPHP(order.estimated_total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div
          className="rounded-[22px] border p-6"
          style={{
            background: panelBg,
            borderColor: panelBorder,
            boxShadow: panelShadow,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(25,147,210,0.15)', border: '1px solid rgba(25,147,210,0.26)' }}
            >
              <Mail size={18} style={{ color: '#1993D2' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: heading }}>
                Inbox Overview
              </h3>
              <p className="text-sm" style={{ color: subText }}>
                Customer inquiries, requests, and follow-ups
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-3xl font-black" style={{ color: heading }}>
                {loadingStats ? '—' : stats.inboxCount}
              </div>
              <div className="text-xs uppercase tracking-[0.18em] mt-1" style={{ color: muted }}>
                Total Messages
              </div>
            </div>

            <Link
              to="/dashboard/inbox"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border"
              style={{
                background: isLight ? 'rgba(25,147,210,0.08)' : 'rgba(25,147,210,0.14)',
                color: '#1993D2',
                borderColor: 'rgba(25,147,210,0.18)',
              }}
            >
              Open Inbox
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div
          className="rounded-[22px] border p-6"
          style={{
            background: panelBg,
            borderColor: panelBorder,
            boxShadow: panelShadow,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.26)' }}
            >
              <Clock size={18} style={{ color: '#f59e0b' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: heading }}>
                Production Snapshot
              </h3>
              <p className="text-sm" style={{ color: subText }}>
                Quick glance at active workflow
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Pending', value: recentOrders.filter((o) => o.status === 'pending').length, color: '#1993D2' },
              { label: 'Processing', value: recentOrders.filter((o) => o.status === 'processing').length, color: '#f59e0b' },
              { label: 'Printing', value: recentOrders.filter((o) => o.status === 'printing').length, color: '#8b5cf6' },
              { label: 'Ready', value: recentOrders.filter((o) => o.status === 'ready').length, color: '#10b981' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[16px] p-4 border"
                style={{
                  background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                  borderColor: isLight ? 'rgba(15,23,42,0.07)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="text-2xl font-black" style={{ color: item.color }}>
                  {item.value}
                </div>
                <div className="text-[11px] mt-1 font-semibold uppercase tracking-[0.16em]" style={{ color: muted }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}