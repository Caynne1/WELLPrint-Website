import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, ORDER_STATUSES } from '../../context/OrdersContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Search, ArrowRight, Filter, Loader2, RefreshCw } from 'lucide-react'

function formatPHP(n) { return '\u20B1' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 0 }) }
function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

const ALL_STATUSES = ['all', ...Object.keys(ORDER_STATUSES)]

export default function AdminOrdersPage() {
  const { orders, loading, error, refetch } = useOrders()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => {
      if (!search) return true
      const q = search.toLowerCase()
      return o.id.toLowerCase().includes(q)
        || o.customer.name.toLowerCase().includes(q)
        || o.customer.email.toLowerCase().includes(q)
    })

  return (
    <AdminLayout>
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "'Lora', serif" }}>Orders</h1>
          <p className="text-ivory-300/40 text-sm">
            {loading ? 'Loading…' : `${orders.length} total · ${orders.filter(o => o.status === 'new').length} new`}
          </p>
        </div>
        <button onClick={refetch} className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-body border border-white/[0.08] text-ivory-300/40 hover:text-white transition-all">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory-300/25 pointer-events-none" />
          <input type="text" placeholder="Search by ID, name, email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-ink-800 border border-white/[0.10] rounded-sm pl-9 pr-4 py-2.5 text-sm text-ivory-200 placeholder-ivory-300/20 outline-none focus:border-wp-green/60 transition-all" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-ivory-300/30" />
          {ALL_STATUSES.map(s => {
            const st = ORDER_STATUSES[s]
            const active = filter === s
            return (
              <button key={s} onClick={() => setFilter(s)}
                className="text-[10px] font-body px-3 py-1.5 rounded-sm border transition-all capitalize"
                style={{
                  background: active ? (st ? st.bg : 'rgba(19,161,80,0.1)') : 'transparent',
                  color: active ? (st ? st.color : 'var(--wp-green)') : 'rgba(216,216,216,0.35)',
                  borderColor: active ? (st ? st.color + '40' : 'rgba(19,161,80,0.3)') : 'rgba(255,255,255,0.08)',
                }}>
                {st ? st.label : 'All'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-ink-800 border border-white/[0.07] rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-ivory-300/30">
            <Loader2 size={16} className="animate-spin" /> Loading orders…
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-ivory-300/30 font-body text-sm mb-3">{error}</p>
            <button onClick={refetch} className="text-xs font-body text-wp-green hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-ivory-300/30 font-body text-sm">
            {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(order => {
              const st = ORDER_STATUSES[order.status] ?? ORDER_STATUSES.new
              const unreplied = order.status === 'new' || (order.status === 'quoted' && order.emailThread.length === 0)
              return (
                <Link key={order.id} to={`/dashboard/orders/${order.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: st.color }} />
                  <div className="min-w-0 flex-1 grid sm:grid-cols-3 gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white text-xs font-body font-bold">{order.id}</span>
                        {unreplied && <span className="text-[8px] font-body px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(236,0,140,0.15)', color: '#CD1B6E' }}>NEW</span>}
                      </div>
                      <span className="text-[9px] font-body px-2 py-0.5 rounded-sm mt-1 inline-block"
                        style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-white text-xs font-semibold truncate">{order.customer.name}</div>
                      <div className="text-ivory-300/35 text-[10px] font-body truncate">{order.customer.email}</div>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-white text-xs font-body font-bold">{formatPHP(order.estimatedTotal)}</div>
                      <div className="text-ivory-300/25 text-[10px] font-body">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {timeAgo(order.createdAt)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-ivory-300/20 group-hover:text-wp-green transition-colors shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}