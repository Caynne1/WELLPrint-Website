import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import { TrendingUp, TrendingDown, BarChart2, PieChart, ArrowUpRight, Loader2 } from 'lucide-react'

function formatPHP(n) { return '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0 }) }

export default function AdminAnalyticsPage() {
  const { orders } = useOrders()
  const [categoryStats, setCategoryStats] = useState([])
  const [productStats, setProductStats] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    async function fetchStats() {
      setLoadingStats(true)
      // Top products by order item count (requires order_items table if it exists)
      // Fall back to products table with sort_order as a proxy
      const { data: prods } = await supabase
        .from('products')
        .select('id, name, base_price, status, categories(name)')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .limit(5)

      const { data: cats } = await supabase
        .from('categories')
        .select('id, name')
        .order('sort_order', { ascending: true })

      setProductStats(prods ?? [])
      setCategoryStats(cats ?? [])
      setLoadingStats(false)
    }
    fetchStats()
  }, [])

  // Derive stats from real orders
  const totalOrders    = orders.length
  const completedOrders = orders.filter(o => o.status === 'completed')
  const completedRev   = completedOrders.reduce((s, o) => s + (o.estimatedTotal ?? 0), 0)
  const avgOrder       = completedOrders.length ? completedRev / completedOrders.length : 0
  const convRate       = totalOrders ? Math.round((completedOrders.length / totalOrders) * 100) : 0

  // Group orders by month for the bar chart
  const monthlyMap = {}
  orders.forEach(o => {
    const d = new Date(o.createdAt)
    const key = d.toLocaleString('en-US', { month: 'short' })
    if (!monthlyMap[key]) monthlyMap[key] = { orders: 0, revenue: 0 }
    monthlyMap[key].orders += 1
    if (o.status === 'completed') monthlyMap[key].revenue += o.estimatedTotal ?? 0
  })

  // Keep last 6 months in order
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return d.toLocaleString('en-US', { month: 'short' })
  })
  const monthlyData = last6.map(m => ({ month: m, ...(monthlyMap[m] ?? { orders: 0, revenue: 0 }) }))

  const maxRev = Math.max(...monthlyData.map(d => d.revenue), 1)
  const maxOrd = Math.max(...monthlyData.map(d => d.orders), 1)

  const totalStatusCount = orders.length || 1

  return (
    <AdminLayout>
      <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Analytics</h1>
          <p className="text-ivory-300/40 text-sm">Overview based on your live order data.</p>
        </div>
        <div className="flex items-center gap-2">
          {['week', 'month', 'quarter'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="text-[10px] font-mono px-3 py-1.5 rounded-sm border transition-all capitalize"
              style={{ background: period === p ? 'rgba(45,176,75,0.1)' : 'transparent', color: period === p ? 'var(--wp-green)' : 'rgba(216,216,216,0.35)', borderColor: period === p ? 'rgba(45,176,75,0.3)' : 'rgba(255,255,255,0.08)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders',   value: totalOrders,        icon: BarChart2,    color: '#29ABE2' },
          { label: 'Est. Revenue',   value: formatPHP(completedRev), icon: TrendingUp, color: '#2DB04B' },
          { label: 'Avg. Order',     value: formatPHP(avgOrder), icon: ArrowUpRight, color: '#FBB03B' },
          { label: 'Conversion',     value: `${convRate}%`,     icon: PieChart,     color: '#EC008C' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-ink-800 border border-white/[0.07] rounded-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: `${color}14`, border: `1px solid ${color}30` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-white text-2xl font-black mb-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</div>
            <div className="text-ivory-300/60 text-xs font-semibold mb-0.5">{label}</div>
            <div className="text-ivory-300/25 text-[10px] font-mono">From {orders.length} total orders</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(41,171,226,0.04)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#29ABE2' }}>Monthly Revenue (Completed Orders)</span>
          </div>
          <div className="p-5">
            {totalOrders === 0 ? (
              <div className="h-40 flex items-center justify-center text-ivory-300/25 font-mono text-xs">No order data yet</div>
            ) : (
              <div className="flex items-end gap-2 h-40">
                {monthlyData.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[8px] font-mono text-ivory-300/25">{d.revenue > 0 ? formatPHP(d.revenue / 1000) + 'k' : ''}</div>
                    <div className="w-full rounded-sm relative group"
                      style={{ height: `${Math.max((d.revenue / maxRev) * 100, d.revenue > 0 ? 4 : 0)}%`, minHeight: 4, background: d.revenue > 0 ? 'rgba(41,171,226,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${d.revenue > 0 ? 'rgba(41,171,226,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                      <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-all" style={{ background: 'rgba(41,171,226,0.4)' }} />
                    </div>
                    <div className="text-[8px] font-mono text-ivory-300/35">{d.month}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(236,0,140,0.04)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#EC008C' }}>Order Status</span>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(ORDER_STATUSES).map(([key, st]) => {
              const count = orders.filter(o => o.status === key).length
              const pct = Math.round((count / totalStatusCount) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono" style={{ color: st.color }}>{st.label}</span>
                    <span className="text-[10px] font-mono text-ivory-300/40">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: st.color, opacity: 0.7 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Orders trend + catalog overview */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Orders per month */}
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(45,176,75,0.04)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase text-wp-green">Monthly Orders</span>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-2 h-28">
              {monthlyData.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[8px] font-mono text-ivory-300/25">{d.orders || ''}</div>
                  <div className="w-full rounded-sm"
                    style={{ height: `${Math.max((d.orders / maxOrd) * 100, d.orders > 0 ? 4 : 0)}%`, minHeight: 4, background: d.orders > 0 ? 'rgba(45,176,75,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${d.orders > 0 ? 'rgba(45,176,75,0.2)' : 'rgba(255,255,255,0.06)'}` }} />
                  <div className="text-[8px] font-mono text-ivory-300/35">{d.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products from Supabase */}
        <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]" style={{ background: 'rgba(251,176,59,0.04)' }}>
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: '#FBB03B' }}>Active Products</span>
          </div>
          {loadingStats ? (
            <div className="py-10 flex items-center justify-center gap-2 text-ivory-300/25">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          ) : productStats.length === 0 ? (
            <div className="py-10 text-center text-ivory-300/25 font-mono text-xs">No products yet</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {productStats.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-[10px] font-mono text-ivory-300/20 w-4 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">{p.name}</div>
                    <div className="text-ivory-300/30 text-[10px] font-mono">{p.categories?.name ?? 'Uncategorized'}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white text-xs font-mono font-bold">{formatPHP(p.base_price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}