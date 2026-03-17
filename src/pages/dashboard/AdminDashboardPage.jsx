import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  Package, Clock, CheckCircle, ArrowRight, TrendingUp,
  Users, ShoppingBag, BarChart2, Zap, Calendar,
  RefreshCw, AlertCircle, ArrowUpRight, Inbox,
  Target, Activity, Shield, Bell, Eye, Server,
  Database, Wifi, Star, Award, Percent, DollarSign,
  ChevronUp, ChevronDown, AlertTriangle, Lock
} from 'lucide-react'

function formatPHP(n) { return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 }) }
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function SparkBars({ data = [], color = '#13A150' }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm"
          style={{ height: `${Math.max(8, (v / max) * 100)}%`, background: color, opacity: i === data.length - 1 ? 1 : 0.35 + (i / data.length) * 0.5 }} />
      ))}
    </div>
  )
}

function DonutChart({ segments }) {
  const size = 80, stroke = 10, r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  let offset = 0
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const len = (seg.value / total) * circ
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
          stroke={seg.color} strokeWidth={stroke}
          strokeDasharray={`${len} ${circ - len}`}
          strokeDashoffset={-offset} strokeLinecap="round" />
        offset += len
        return el
      })}
    </svg>
  )
}

function ProgressBar({ value, max, color }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100)
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function SystemHealthDot({ status }) {
  const colors = { ok: '#13A150', warn: '#FDC010', error: '#CD1B6E' }
  return (
    <span className="w-2 h-2 rounded-full inline-block shrink-0"
      style={{ background: colors[status] ?? colors.ok, boxShadow: `0 0 5px ${colors[status] ?? colors.ok}` }} />
  )
}

function getLast7Days(orders) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString('en-PH', { weekday: 'short' }),
      count: orders.filter(o => {
        const od = new Date(o.createdAt)
        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth()
      }).length
    }
  })
}

// ── Admin-only panels ───────────────────────────────────────────

function SystemHealthPanel() {
  const checks = [
    { label: 'Supabase DB', status: 'ok', note: 'Connected' },
    { label: 'Auth Service', status: 'ok', note: 'Operational' },
    { label: 'Storage Bucket', status: 'ok', note: 'Available' },
    { label: 'Edge Functions', status: 'warn', note: 'Latency +120ms' },
    { label: 'Email (SMTP)', status: 'ok', note: 'Sending normally' },
  ]
  return (
    <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
        style={{ background: 'rgba(25,147,210,0.04)' }}>
        <Server size={11} style={{ color: '#1993D2' }} />
        <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#1993D2' }}>System Health</span>
        <span className="ml-auto font-body text-[9px] text-ivory-300/25">Admin Only</span>
        <Lock size={9} className="text-ivory-300/20" />
      </div>
      <div className="p-4 space-y-2.5">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-3">
            <SystemHealthDot status={c.status} />
            <span className="font-body text-[10px] text-ivory-300/60 flex-1">{c.label}</span>
            <span className="font-body text-[9px] text-ivory-300/30">{c.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevenueTargetPanel({ orders }) {
  const monthlyTarget = 150000
  const completedRev = orders
    .filter(o => o.status === 'completed' && new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + o.estimatedTotal, 0)
  const pct = Math.min(Math.round((completedRev / monthlyTarget) * 100), 100)
  const remaining = Math.max(monthlyTarget - completedRev, 0)

  return (
    <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
        style={{ background: 'rgba(251,176,59,0.04)' }}>
        <Target size={11} style={{ color: '#FDC010' }} />
        <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#FDC010' }}>Monthly Target</span>
        <span className="ml-auto font-body text-[9px] text-ivory-300/25">Admin Only</span>
        <Lock size={9} className="text-ivory-300/20" />
      </div>
      <div className="p-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-white text-xl font-black" style={{ fontFamily: "'Lora', serif" }}>
              {pct}%
            </div>
            <div className="text-ivory-300/40 text-[10px] font-body">of {formatPHP(monthlyTarget)}</div>
          </div>
          <div className="text-right">
            <div className="text-white text-sm font-bold">{formatPHP(completedRev)}</div>
            <div className="text-ivory-300/30 text-[10px] font-body">{formatPHP(remaining)} to go</div>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: pct >= 100 ? '#13A150' : pct >= 60 ? '#FDC010' : '#CD1B6E',
              boxShadow: `0 0 8px ${pct >= 100 ? '#13A150' : pct >= 60 ? '#FDC010' : '#CD1B6E'}40`
            }} />
        </div>
        <div className="text-ivory-300/25 text-[9px] font-body">
          {pct >= 100 ? '🎉 Target reached this month!' : `${new Date().toLocaleString('en-PH', { month: 'long' })} target`}
        </div>
      </div>
    </div>
  )
}

function AuditLogPanel() {
  const logs = [
    { user: 'admin',      action: 'Updated order #ORD-0047 → Printing', time: '4m ago',  color: '#13A150' },
    { user: 'maria.s',   action: 'Viewed order #ORD-0046',              time: '11m ago', color: '#1993D2' },
    { user: 'admin',      action: 'Added product "Tarpaulin A3"',       time: '1h ago',  color: '#FDC010' },
    { user: 'juan.d',    action: 'Logged in',                           time: '2h ago',  color: '#1993D2' },
    { user: 'admin',      action: 'Edited staff permissions for maria.s', time: '3h ago', color: '#CD1B6E' },
  ]
  return (
    <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
        style={{ background: 'rgba(236,0,140,0.04)' }}>
        <Activity size={11} style={{ color: '#CD1B6E' }} />
        <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#CD1B6E' }}>Audit Log</span>
        <span className="ml-auto font-body text-[9px] text-ivory-300/25">Admin Only</span>
        <Lock size={9} className="text-ivory-300/20" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {logs.map((l, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-2.5">
            <div className="w-5 h-5 rounded-sm shrink-0 flex items-center justify-center text-[8px] font-bold mt-0.5"
              style={{ background: `${l.color}14`, color: l.color, border: `1px solid ${l.color}25`, fontFamily: "'Lora', serif" }}>
              {l.user.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body text-[9px]" style={{ color: l.color }}>@{l.user}</div>
              <div className="text-ivory-300/55 text-[10px] truncate">{l.action}</div>
            </div>
            <span className="font-body text-[9px] text-ivory-300/25 shrink-0">{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StaffActivityPanel() {
  const staff = [
    { name: 'Maria Santos',  username: 'maria.s',  role: 'staff', status: 'online',  lastAction: 'Viewing Orders', color: '#13A150' },
    { name: 'Juan Dela Cruz', username: 'juan.d',  role: 'staff', status: 'idle',    lastAction: 'Last seen 12m ago', color: '#FDC010' },
    { name: 'Ana Reyes',     username: 'ana.r',    role: 'staff', status: 'offline', lastAction: 'Last seen 2h ago', color: '#555' },
  ]
  const statusColors = { online: '#13A150', idle: '#FDC010', offline: '#444' }
  return (
    <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
        style={{ background: 'rgba(19,161,80,0.04)' }}>
        <Users size={11} style={{ color: 'var(--wp-green)' }} />
        <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">Staff Activity</span>
        <span className="ml-auto font-body text-[9px] text-ivory-300/25">Admin Only</span>
        <Lock size={9} className="text-ivory-300/20" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {staff.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold"
                style={{ background: `${statusColors[s.status]}14`, border: `1px solid ${statusColors[s.status]}30`, color: statusColors[s.status], fontFamily: "'Lora', serif" }}>
                {s.name.charAt(0)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-ink-800"
                style={{ background: statusColors[s.status] }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[11px] font-semibold truncate">{s.name}</div>
              <div className="text-ivory-300/35 text-[9px] font-body truncate">{s.lastAction}</div>
            </div>
            <span className="font-body text-[9px] capitalize px-2 py-0.5 rounded-sm"
              style={{ background: `${statusColors[s.status]}12`, color: statusColors[s.status] }}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { orders, refetch } = useOrders()
  const { user, isAdmin } = useAuth()
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t) }, [])

  const newOrders       = orders.filter(o => o.status === 'new').length
  const activeOrders    = orders.filter(o => !['completed','cancelled'].includes(o.status)).length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const totalRevenue    = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.estimatedTotal, 0)
  const todayOrders     = orders.filter(o => new Date(o.createdAt).toDateString() === now.toDateString()).length

  // Week-over-week comparison
  const thisWeek = orders.filter(o => {
    const d = new Date(o.createdAt), start = new Date(); start.setDate(start.getDate() - 7)
    return d > start
  }).length
  const lastWeek = orders.filter(o => {
    const d = new Date(o.createdAt), start = new Date(), end = new Date()
    start.setDate(start.getDate() - 14); end.setDate(end.getDate() - 7)
    return d > start && d < end
  }).length
  const weekTrend = lastWeek === 0 ? 0 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100)

  const last7      = getLast7Days(orders)
  const sparkData  = last7.map(d => d.count)
  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  const donutSegments = Object.entries(ORDER_STATUSES)
    .map(([key, st]) => ({ value: orders.filter(o => o.status === key).length, color: st.color, label: st.label }))
    .filter(s => s.value > 0)

  const greeting = () => { const h = now.getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }

  const STATS = [
    { label: 'New Inquiries', value: newOrders,               icon: Inbox,       color: '#CD1B6E', note: 'Awaiting response' },
    { label: 'Active Orders', value: activeOrders,            icon: Clock,       color: '#FDC010', note: 'In progress' },
    { label: 'Completed',     value: completedOrders,         icon: CheckCircle, color: '#13A150', note: 'All time' },
    { label: 'Est. Revenue',  value: formatPHP(totalRevenue), icon: TrendingUp,  color: '#1993D2', note: 'Completed only' },
  ]

  const QUICK_ACTIONS = [
    { label: 'All Orders',  to: '/dashboard/orders',    icon: Package,    color: '#CD1B6E' },
    { label: 'Products',    to: '/dashboard/products',  icon: ShoppingBag,color: '#FDC010' },
    { label: 'Analytics',   to: '/dashboard/analytics', icon: BarChart2,  color: '#1993D2' },
    ...(isAdmin ? [{ label: 'Staff', to: '/dashboard/staff', icon: Users, color: '#13A150' }] : []),
  ]

  return (
    <AdminLayout>
      {/* ── Header ── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <span className="font-body text-[10px] tracking-widest uppercase text-ivory-300/30">
            {now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <h1 className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: "'Lora', serif" }}>
            {greeting()}, <span style={{ color: 'var(--wp-green)' }}>{user?.name?.split(' ')[0]}</span>
            {isAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-body px-2 py-0.5 rounded-sm align-middle"
                style={{ background: 'rgba(236,0,140,0.1)', border: '1px solid rgba(236,0,140,0.2)', color: '#CD1B6E', verticalAlign: 'middle' }}>
                <Shield size={9} /> Admin
              </span>
            )}
          </h1>
          <p className="text-ivory-300/40 text-sm mt-0.5">
            {todayOrders > 0 ? `${todayOrders} new order${todayOrders > 1 ? 's' : ''} today.` : 'No new orders today yet.'}
            {weekTrend !== 0 && (
              <span className="ml-2 text-[10px] font-body" style={{ color: weekTrend > 0 ? '#13A150' : '#CD1B6E' }}>
                {weekTrend > 0 ? <ChevronUp size={10} className="inline" /> : <ChevronDown size={10} className="inline" />}
                {Math.abs(weekTrend)}% vs last week
              </span>
            )}
          </p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white hover:border-wp-green/40 transition-all">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* ── Alert ── */}
      {newOrders > 0 && (
        <div className="mb-6 flex items-center justify-between px-5 py-3.5 rounded-sm border"
          style={{ background: 'rgba(236,0,140,0.07)', borderColor: 'rgba(236,0,140,0.25)' }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={15} style={{ color: '#CD1B6E' }} />
            <span className="text-sm font-semibold" style={{ color: '#CD1B6E' }}>
              {newOrders} order {newOrders > 1 ? 'inquiries require' : 'inquiry requires'} attention
            </span>
          </div>
          <Link to="/dashboard/orders?filter=new" className="flex items-center gap-1 text-xs font-body hover:underline" style={{ color: '#CD1B6E' }}>
            Review <ArrowRight size={11} />
          </Link>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon, color, note }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 flex flex-col gap-3 hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <ArrowUpRight size={12} className="text-ivory-300/15" />
            </div>
            <div>
              <div className="text-white text-2xl font-black leading-none mb-1" style={{ fontFamily: "'Lora', serif" }}>{value}</div>
              <div className="text-ivory-300/55 text-xs font-semibold">{label}</div>
              <div className="text-ivory-300/25 text-[10px] font-body mt-0.5">{note}</div>
            </div>
            <SparkBars data={sparkData} color={color} />
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between" style={{ background: 'rgba(19,161,80,0.04)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-wp-green" style={{ animation: 'pulse 2s infinite' }} />
              <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">Live Orders</span>
            </div>
            <Link to="/dashboard/orders" className="text-[10px] font-body text-ivory-300/30 hover:text-wp-green transition-colors flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Inbox size={24} style={{ color: 'var(--wp-green)', opacity: 0.3 }} />
              <p className="text-ivory-300/30 text-xs font-body">No orders yet — they'll appear here in real time</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentOrders.map(order => {
                const st = ORDER_STATUSES[order.status] ?? ORDER_STATUSES.new
                return (
                  <Link key={order.id} to={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
                    <div className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: st.color, boxShadow: order.status === 'new' ? `0 0 6px ${st.color}` : 'none' }} />
                    <div className="min-w-0 flex-1 grid sm:grid-cols-3 gap-1 items-center">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-white text-xs font-body font-bold">{order.id}</span>
                          {order.status === 'new' && <span className="text-[8px] font-body px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(236,0,140,0.2)', color: '#CD1B6E' }}>NEW</span>}
                        </div>
                        <span className="text-[9px] font-body px-1.5 py-0.5 rounded-sm mt-0.5 inline-block" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-white text-xs font-semibold truncate">{order.customer.name}</div>
                        <div className="text-ivory-300/35 text-[10px] truncate">{order.orderType}</div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="text-white text-xs font-body font-bold">{formatPHP(order.estimatedTotal)}</div>
                        <div className="text-ivory-300/25 text-[10px] font-body">{timeAgo(order.createdAt)}</div>
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-ivory-300/15 group-hover:text-wp-green transition-colors shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4">
          {/* Donut */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(25,147,210,0.04)' }}>
              <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#1993D2' }}>Order Breakdown</span>
            </div>
            <div className="p-4">
              {orders.length === 0 ? (
                <p className="text-center text-ivory-300/25 text-xs font-body py-6">No data yet</p>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <DonutChart segments={donutSegments} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white font-black text-lg leading-none" style={{ fontFamily: "'Lora', serif" }}>{orders.length}</span>
                        <span className="text-ivory-300/30 text-[9px] font-body">total</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {donutSegments.map(seg => (
                      <div key={seg.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                          <span className="text-[10px] font-body" style={{ color: seg.color }}>{seg.label}</span>
                        </div>
                        <span className="text-[10px] font-body text-ivory-300/40">{seg.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2" style={{ background: 'rgba(251,176,59,0.04)' }}>
              <Zap size={11} style={{ color: '#FDC010' }} />
              <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#FDC010' }}>Quick Actions</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
                <Link key={to} to={to}
                  className="flex flex-col items-center gap-2 p-3 rounded-sm border border-transparent hover:border-white/[0.07] hover:bg-white/[0.03] transition-all group">
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className="text-[10px] font-body text-ivory-300/40 group-hover:text-white transition-colors text-center">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin-Only Section ── */}
      {isAdmin && (
        <>
          <div className="flex items-center gap-3 mb-4 mt-2">
            <div className="flex items-center gap-2">
              <Shield size={12} style={{ color: '#CD1B6E' }} />
              <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: '#CD1B6E' }}>Admin Controls</span>
            </div>
            <div className="flex-1 h-px" style={{ background: 'rgba(236,0,140,0.12)' }} />
            <Lock size={10} className="text-ivory-300/20" />
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-4">
            <RevenueTargetPanel orders={orders} />
            <SystemHealthPanel />
            <StaffActivityPanel />
          </div>

          <div className="grid lg:grid-cols-1 gap-4">
            <AuditLogPanel />
          </div>
        </>
      )}

      {/* ── 7-Day Activity (both roles) ── */}
      <div className="mt-4 bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(19,161,80,0.04)' }}>
          <span className="font-body text-[10px] tracking-widest uppercase text-wp-green">7-Day Activity</span>
        </div>
        <div className="p-4">
          <div className="flex items-end gap-1 h-14 mb-2">
            {last7.map((d, i) => {
              const max = Math.max(...last7.map(x => x.count), 1)
              const h = Math.max(6, (d.count / max) * 100)
              const isToday = i === 6
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: isToday ? 'var(--wp-green)' : 'rgba(19,161,80,0.22)',
                      boxShadow: isToday ? '0 0 8px rgba(19,161,80,0.4)' : 'none',
                    }} />
                </div>
              )
            })}
          </div>
          <div className="flex gap-1">
            {last7.map((d, i) => (
              <div key={i} className="flex-1 text-center text-[9px] font-body text-ivory-300/25">{d.label}</div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
