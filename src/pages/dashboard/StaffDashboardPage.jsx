import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  Package, Clock, CheckCircle, ArrowRight, Inbox,
  RefreshCw, AlertCircle, Zap, Star, ClipboardList,
  Eye, Edit3, TrendingUp, User, Calendar, Bell,
  ShoppingBag, BarChart2, Lock, CheckSquare
} from 'lucide-react'

function formatPHP(n) { return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 }) }
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function PermissionBadge({ label, granted }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-sm"
      style={{
        background: granted ? 'rgba(45,176,75,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${granted ? 'rgba(45,176,75,0.2)' : 'rgba(255,255,255,0.06)'}`,
      }}>
      <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0"
        style={{ background: granted ? 'rgba(45,176,75,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${granted ? 'rgba(45,176,75,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
        {granted
          ? <CheckCircle size={9} style={{ color: '#2DB04B' }} />
          : <Lock size={9} className="text-ivory-300/25" />}
      </div>
      <span className="font-mono text-[10px]"
        style={{ color: granted ? 'rgba(216,216,216,0.7)' : 'rgba(216,216,216,0.2)' }}>
        {label}
      </span>
    </div>
  )
}

function TaskItem({ text, done = false, urgent = false }) {
  const [checked, setChecked] = useState(done)
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
      <button
        onClick={() => setChecked(v => !v)}
        className="w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center transition-all"
        style={{
          background: checked ? 'rgba(45,176,75,0.2)' : 'transparent',
          borderColor: checked ? 'var(--wp-green)' : 'rgba(255,255,255,0.15)',
        }}>
        {checked && <CheckSquare size={10} style={{ color: '#2DB04B' }} />}
      </button>
      <span className="flex-1 text-xs font-mono"
        style={{
          color: checked ? 'rgba(216,216,216,0.25)' : urgent ? '#FBB03B' : 'rgba(216,216,216,0.6)',
          textDecoration: checked ? 'line-through' : 'none',
        }}>
        {text}
      </span>
      {urgent && !checked && (
        <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
          style={{ background: 'rgba(251,176,59,0.12)', color: '#FBB03B' }}>URGENT</span>
      )}
    </div>
  )
}

export default function StaffDashboardPage() {
  const { orders, refetch } = useOrders()
  const { user, hasPermission } = useAuth()
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t) }, [])

  const greeting = () => { const h = now.getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening' }

  const newOrders    = orders.filter(o => o.status === 'new')
  const activeOrders = orders.filter(o => !['completed','cancelled'].includes(o.status))
  const todayOrders  = orders.filter(o => new Date(o.createdAt).toDateString() === now.toDateString())

  // Staff's personal stats (orders they may have touched — simulated via recency)
  const handledOrders    = orders.filter(o => o.status !== 'new').length
  const completedToday   = orders.filter(o => o.status === 'completed' && new Date(o.createdAt).toDateString() === now.toDateString()).length

  const urgentOrders     = newOrders.slice(0, 5)
  const recentActivity   = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  const PERMISSION_LABELS_MAP = {
    view_orders:     'View Orders',
    manage_orders:   'Manage Orders',
    view_products:   'View Products',
    manage_products: 'Manage Products',
    view_analytics:  'View Analytics',
  }

  const TASKS = [
    { text: `Review ${newOrders.length} new order${newOrders.length !== 1 ? 's' : ''}`, urgent: newOrders.length > 0 },
    { text: 'Update printing status for active jobs', urgent: false },
    { text: 'Follow up on quoted orders > 48h', urgent: false },
    { text: 'Check artwork submissions', urgent: false },
  ]

  const canViewOrders     = hasPermission('view_orders')
  const canManageOrders   = hasPermission('manage_orders')
  const canViewProducts   = hasPermission('view_products')
  const canViewAnalytics  = hasPermission('view_analytics')

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-ivory-300/30">
            {now.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <h1 className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {greeting()}, <span style={{ color: 'var(--wp-green)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-ivory-300/40 text-sm mt-0.5">
            {todayOrders.length > 0
              ? `${todayOrders.length} order${todayOrders.length > 1 ? 's' : ''} came in today.`
              : 'No new orders today yet.'}
            {activeOrders.length > 0 && (
              <span className="ml-2 text-ivory-300/30">· {activeOrders.length} active</span>
            )}
          </p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-mono border border-white/[0.08] text-ivory-300/40 hover:text-white hover:border-wp-green/40 transition-all">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Urgent alert */}
      {newOrders.length > 0 && canViewOrders && (
        <div className="mb-6 flex items-center justify-between px-5 py-3.5 rounded-sm border"
          style={{ background: 'rgba(236,0,140,0.07)', borderColor: 'rgba(236,0,140,0.25)' }}>
          <div className="flex items-center gap-3">
            <AlertCircle size={15} style={{ color: '#EC008C' }} />
            <span className="text-sm font-semibold" style={{ color: '#EC008C' }}>
              {newOrders.length} new order {newOrders.length > 1 ? 'inquiries need' : 'inquiry needs'} attention
            </span>
          </div>
          <Link to="/dashboard/orders?filter=new" className="flex items-center gap-1 text-xs font-mono hover:underline" style={{ color: '#EC008C' }}>
            Review <ArrowRight size={11} />
          </Link>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Awaiting',   value: newOrders.length,    icon: Inbox,       color: '#EC008C', sub: 'New inquiries' },
          { label: 'In Progress',value: activeOrders.length, icon: Clock,       color: '#FBB03B', sub: 'Active orders' },
          { label: 'Handled',    value: handledOrders,       icon: CheckCircle, color: '#2DB04B', sub: 'Processed' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-5 hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="text-white text-2xl font-black leading-none mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-ivory-300/55 text-xs font-semibold">{label}</div>
            <div className="text-ivory-300/25 text-[10px] font-mono">{sub}</div>
          </div>
        ))}
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-5 gap-4 mb-4">

        {/* Orders queue — col-span 3 */}
        <div className="lg:col-span-3 bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between"
            style={{ background: 'rgba(45,176,75,0.04)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-wp-green" style={{ animation: 'pulse 2s infinite' }} />
              <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">Your Queue</span>
            </div>
            {canViewOrders && (
              <Link to="/dashboard/orders" className="text-[10px] font-mono text-ivory-300/30 hover:text-wp-green transition-colors flex items-center gap-1">
                All orders <ArrowRight size={10} />
              </Link>
            )}
          </div>

          {!canViewOrders ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Lock size={20} className="text-ivory-300/15" />
              <p className="text-ivory-300/25 text-xs font-mono">You don't have permission to view orders</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3">
              <Inbox size={22} style={{ color: 'var(--wp-green)', opacity: 0.3 }} />
              <p className="text-ivory-300/30 text-xs font-mono">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentActivity.map(order => {
                const st = ORDER_STATUSES[order.status] ?? ORDER_STATUSES.new
                return (
                  <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: st.color, boxShadow: order.status === 'new' ? `0 0 6px ${st.color}` : 'none' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-xs font-mono font-bold">{order.id}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm"
                          style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        {order.status === 'new' && (
                          <span className="text-[8px] font-mono px-1 py-0.5 rounded-sm" style={{ background: 'rgba(236,0,140,0.15)', color: '#EC008C' }}>NEW</span>
                        )}
                      </div>
                      <div className="text-ivory-300/40 text-[10px] font-mono truncate">{order.customer.name} · {timeAgo(order.createdAt)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-white text-xs font-mono font-bold">{formatPHP(order.estimatedTotal)}</span>
                      {canManageOrders ? (
                        <Link to={`/dashboard/orders/${order.id}`}
                          className="w-7 h-7 rounded-sm flex items-center justify-center border border-white/[0.08] text-ivory-300/30 hover:text-wp-green hover:border-wp-green/30 transition-all">
                          <Edit3 size={11} />
                        </Link>
                      ) : canViewOrders ? (
                        <Link to={`/dashboard/orders/${order.id}`}
                          className="w-7 h-7 rounded-sm flex items-center justify-center border border-white/[0.08] text-ivory-300/30 hover:text-white transition-all">
                          <Eye size={11} />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right col — col-span 2 */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Today's checklist */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
              style={{ background: 'rgba(251,176,59,0.04)' }}>
              <ClipboardList size={11} style={{ color: '#FBB03B' }} />
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#FBB03B' }}>Today's Tasks</span>
            </div>
            <div className="px-4 py-2">
              {TASKS.map((t, i) => <TaskItem key={i} {...t} />)}
            </div>
          </div>

          {/* Quick access (permission-gated) */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
              style={{ background: 'rgba(45,176,75,0.04)' }}>
              <Zap size={11} style={{ color: 'var(--wp-green)' }} />
              <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">Quick Access</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Orders',    to: '/dashboard/orders',    icon: Package,    color: '#EC008C', perm: 'view_orders' },
                { label: 'Products',  to: '/dashboard/products',  icon: ShoppingBag,color: '#FBB03B', perm: 'view_products' },
                { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart2,  color: '#29ABE2', perm: 'view_analytics' },
              ].map(({ label, to, icon: Icon, color, perm }) => {
                const allowed = hasPermission(perm)
                return allowed ? (
                  <Link key={to} to={to}
                    className="flex flex-col items-center gap-2 p-3 rounded-sm border border-transparent hover:border-white/[0.07] hover:bg-white/[0.03] transition-all group">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <span className="text-[10px] font-mono text-ivory-300/40 group-hover:text-white transition-colors text-center">{label}</span>
                  </Link>
                ) : (
                  <div key={to}
                    className="flex flex-col items-center gap-2 p-3 rounded-sm border border-white/[0.04] opacity-30 cursor-not-allowed">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Lock size={13} className="text-ivory-300/30" />
                    </div>
                    <span className="text-[10px] font-mono text-ivory-300/25 text-center">{label}</span>
                  </div>
                )
              })}
              <div className="flex flex-col items-center gap-2 p-3 rounded-sm border border-white/[0.04] opacity-30 cursor-not-allowed"
                title="Admin only">
                <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'rgba(236,0,140,0.06)', border: '1px solid rgba(236,0,140,0.12)' }}>
                  <Lock size={13} style={{ color: 'rgba(236,0,140,0.4)' }} />
                </div>
                <span className="text-[10px] font-mono text-ivory-300/20 text-center">Staff Mgmt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Permissions */}
      <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2"
          style={{ background: 'rgba(41,171,226,0.04)' }}>
          <User size={11} style={{ color: '#29ABE2' }} />
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#29ABE2' }}>My Access Permissions</span>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.entries(PERMISSION_LABELS_MAP).map(([key, label]) => (
            <PermissionBadge key={key} label={label} granted={hasPermission(key)} />
          ))}
        </div>
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <p className="text-[10px] font-mono text-ivory-300/25">
            Permissions are managed by your Admin. Contact them to request access changes.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
