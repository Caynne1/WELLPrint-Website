import { Link } from 'react-router-dom'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Package, Clock, CheckCircle, ArrowRight, TrendingUp, Users, ShoppingBag, BarChart2, Zap } from 'lucide-react'

function formatPHP(n) { return '\u20B1' + n.toLocaleString('en-PH', { minimumFractionDigits: 0 }) }
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export default function AdminDashboardPage() {
  const { orders } = useOrders()
  const { user }   = useAuth()

  const newOrders       = orders.filter(o => o.status === 'new').length
  const activeOrders    = orders.filter(o => !['completed','cancelled'].includes(o.status)).length
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const totalRevenue    = orders.filter(o => o.status === 'completed').reduce((s,o) => s + o.estimatedTotal, 0)

  const STATS = [
    { label: 'New Inquiries',  value: newOrders,              icon: Package,    color: '#EC008C', note: 'Awaiting response' },
    { label: 'Active Orders',  value: activeOrders,           icon: Clock,      color: '#FBB03B', note: 'In progress' },
    { label: 'Completed',      value: completedOrders,        icon: CheckCircle,color: '#2DB04B', note: 'This week' },
    { label: 'Revenue (est.)', value: formatPHP(totalRevenue),icon: TrendingUp, color: '#29ABE2', note: 'Completed orders' },
  ]

  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  const QUICK_ACTIONS = [
    { label: 'View All Orders', to: '/admin/orders',    icon: Package,    color: '#EC008C' },
    { label: 'Manage Products', to: '/admin/products',  icon: ShoppingBag,color: '#FBB03B' },
    { label: 'Analytics',       to: '/admin/analytics', icon: BarChart2,  color: '#29ABE2' },
    ...(user?.role === 'admin' ? [{ label: 'Staff Accounts', to: '/admin/staff', icon: Users, color: '#2DB04B' }] : []),
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Good day, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-ivory-300/40 text-sm">Here's what's happening with your orders today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, icon: Icon, color, note }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center"
                style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-white text-2xl font-black mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-ivory-300/60 text-xs font-semibold mb-0.5">{label}</div>
            <div className="text-ivory-300/30 text-[10px] font-mono">{note}</div>
          </div>
        ))}
      </div>

      {newOrders > 0 && (
        <div className="mb-6 flex items-center justify-between px-5 py-4 rounded-sm border"
          style={{ background: 'rgba(236,0,140,0.06)', borderColor: 'rgba(236,0,140,0.2)' }}>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#EC008C' }} />
            <span className="text-sm font-semibold" style={{ color: '#EC008C' }}>
              {newOrders} new order {newOrders > 1 ? 'inquiries' : 'inquiry'} need{newOrders === 1 ? 's' : ''} a response
            </span>
          </div>
          <Link to="/admin/orders?filter=new" className="text-xs font-mono flex items-center gap-1" style={{ color: '#EC008C' }}>
            View all <ArrowRight size={11} />
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between"
            style={{ background: 'rgba(45,176,75,0.04)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">Recent Orders</span>
            <Link to="/admin/orders" className="text-[10px] font-mono text-ivory-300/30 hover:text-wp-green transition-colors flex items-center gap-1">
              View all <ArrowRight size={10} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentOrders.map(order => {
              const st = ORDER_STATUSES[order.status]
              return (
                <Link key={order.id} to={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white text-xs font-mono font-bold">{order.id}</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-sm" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="text-ivory-300/50 text-xs truncate">{order.customer.name} · {order.orderType}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white text-xs font-mono font-bold">{formatPHP(order.estimatedTotal)}</div>
                    <div className="text-ivory-300/25 text-[10px] font-mono">{timeAgo(order.createdAt)}</div>
                  </div>
                  <ArrowRight size={13} className="text-ivory-300/20 group-hover:text-wp-green transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2"
              style={{ background: 'rgba(251,176,59,0.04)' }}>
              <Zap size={11} style={{ color: '#FBB03B' }} />
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#FBB03B' }}>Quick Actions</span>
            </div>
            <div className="p-3 space-y-1">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, color }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm border border-transparent hover:border-white/[0.07] hover:bg-white/[0.03] transition-all group">
                  <div className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                  <span className="text-ivory-300/45 group-hover:text-white text-xs font-mono transition-colors flex-1">{label}</span>
                  <ArrowRight size={10} className="text-ivory-300/15 group-hover:text-ivory-300/40 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Status overview */}
          <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(41,171,226,0.04)' }}>
              <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#29ABE2' }}>Status Overview</span>
            </div>
            <div className="p-4 space-y-2.5">
              {Object.entries(ORDER_STATUSES).map(([key, st]) => {
                const count = orders.filter(o => o.status === key).length
                if (count === 0) return null
                const pct = Math.round((count / orders.length) * 100)
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono" style={{ color: st.color }}>{st.label}</span>
                      <span className="text-[10px] font-mono text-ivory-300/35">{count}</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: st.color, opacity: 0.65 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}