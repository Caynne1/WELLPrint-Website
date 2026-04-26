import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/DashboardThemeContext'
import {
  BarChart2,
  RefreshCw,
  Loader2,
  Package,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Clock3,
  Printer,
  Mail,
  Truck,
  Store,
} from 'lucide-react'

function formatPeso(value) {
  return `₱${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function SummaryCard({ title, value, icon: Icon, color, isLight, subtitle }) {
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
          {subtitle && (
            <p
              className="text-xs mt-2"
              style={{ color: isLight ? '#64748b' : 'rgba(226,232,240,0.78)' }}
            >
              {subtitle}
            </p>
          )}
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

function ChartCard({ title, children, isLight }) {
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
      <h3
        className="text-lg font-bold mb-5"
        style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}

export default function AdminAnalyticsPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    setLoading(true)

    const [
      { data: ordersData, error: ordersError },
      { data: productsData, error: productsError },
      { data: messagesData, error: messagesError },
    ] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*'),
      supabase.from('contact_messages').select('*'),
    ])

    if (ordersError) console.error('Orders analytics error:', ordersError)
    if (productsError) console.error('Products analytics error:', productsError)
    if (messagesError) console.error('Messages analytics error:', messagesError)

    setOrders(ordersData || [])
    setProducts(productsData || [])
    setMessages(messagesData || [])
    setLoading(false)
  }

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount || o.estimated_total || 0), 0)

    const completedRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_amount || o.estimated_total || 0), 0)

    return {
      totalOrders: orders.length,
      totalRevenue: revenue,
      completedRevenue,
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.is_active).length,
      totalMessages: messages.length,
    }
  }, [orders, products, messages])

  const statusBreakdown = useMemo(() => {
    const map = {
      pending: 0,
      processing: 0,
      printing: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    }

    orders.forEach((order) => {
      if (map[order.status] !== undefined) {
        map[order.status] += 1
      }
    })

    return map
  }, [orders])

  const concernBreakdown = useMemo(() => {
    const map = {}
    messages.forEach((message) => {
      const key = message.concern_type || 'Other'
      map[key] = (map[key] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [messages])

  const fulfillmentBreakdown = useMemo(() => {
    const result = { pickup: 0, deliver: 0 }

    orders.forEach((order) => {
      const items = Array.isArray(order.items)
        ? order.items
        : typeof order.items === 'string'
        ? JSON.parse(order.items || '[]')
        : []

      const item = items.find((x) => x?.delivery_method)
      if (item?.delivery_method === 'deliver') result.deliver += 1
      else result.pickup += 1
    })

    return result
  }, [orders])

  const monthlyRevenue = useMemo(() => {
    const map = {}

    orders
      .filter((o) => o.status !== 'cancelled')
      .forEach((order) => {
        const date = new Date(order.created_at)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        map[key] = (map[key] || 0) + Number(order.total_amount || order.estimated_total || 0)
      })

    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
  }, [orders])

  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(([, value]) => value), 1)
  const maxConcernCount = Math.max(...concernBreakdown.map(([, value]) => value), 1)
  const maxStatusCount = Math.max(...Object.values(statusBreakdown), 1)

  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(139,92,246,0.10)',
                border: '1px solid rgba(139,92,246,0.20)',
              }}
            >
              <BarChart2 size={15} style={{ color: '#8b5cf6' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Analytics Overview
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Analytics
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            Monitor your orders, products, revenue, and inbox activity
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
            border: isLight
              ? '1px solid rgba(15,23,42,0.08)'
              : '1px solid rgba(255,255,255,0.06)',
            color: subText,
            boxShadow: isLight
              ? '0 10px 30px rgba(15,23,42,0.05)'
              : '0 10px 30px rgba(0,0,0,0.24)',
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div
          className="rounded-[24px] border py-20 text-center"
          style={{
            background: isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)',
            borderColor: isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)',
            boxShadow: isLight
              ? '0 10px 30px rgba(15,23,42,0.05)'
              : '0 10px 30px rgba(0,0,0,0.24)',
          }}
        >
          <div className="inline-flex items-center gap-2" style={{ color: subText }}>
            <Loader2 size={16} className="animate-spin" />
            Loading analytics...
          </div>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            <SummaryCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="#1993D2"
              isLight={isLight}
            />
            <SummaryCard
              title="Total Revenue"
              value={formatPeso(stats.totalRevenue)}
              icon={TrendingUp}
              color="#13A150"
              isLight={isLight}
              subtitle={`Completed Revenue: ${formatPeso(stats.completedRevenue)}`}
            />
            <SummaryCard
              title="Products"
              value={stats.totalProducts}
              icon={Package}
              color="#8b5cf6"
              isLight={isLight}
              subtitle={`${stats.activeProducts} active`}
            />
            <SummaryCard
              title="Inbox Messages"
              value={stats.totalMessages}
              icon={Mail}
              color="#f59e0b"
              isLight={isLight}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-7">
            <ChartCard title="Order Status Breakdown" isLight={isLight}>
              <div className="space-y-4">
                {[
                  { key: 'pending', label: 'Pending', color: '#1993D2', icon: Clock3 },
                  { key: 'processing', label: 'Processing', color: '#f59e0b', icon: TrendingUp },
                  { key: 'printing', label: 'Printing', color: '#8b5cf6', icon: Printer },
                  { key: 'ready', label: 'Ready', color: '#10b981', icon: CheckCircle2 },
                  { key: 'completed', label: 'Completed', color: '#16a34a', icon: CheckCircle2 },
                  { key: 'cancelled', label: 'Cancelled', color: '#dc2626', icon: Clock3 },
                ].map((item) => {
                  const value = statusBreakdown[item.key] || 0
                  const width = `${(value / maxStatusCount) * 100}%`
                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <item.icon size={14} style={{ color: item.color }} />
                          <span style={{ color: heading }}>{item.label}</span>
                        </div>
                        <span style={{ color: subText }}>{value}</span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: softBg, border: `1px solid ${softBorder}` }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width, background: item.color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </ChartCard>

            <ChartCard title="Fulfillment Breakdown" isLight={isLight}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  className="rounded-[20px] border p-5"
                  style={{ background: softBg, borderColor: softBorder }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Store size={16} style={{ color: '#10b981' }} />
                    <span style={{ color: heading }}>Pickup Orders</span>
                  </div>
                  <div
                    className="text-3xl font-black"
                    style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                  >
                    {fulfillmentBreakdown.pickup}
                  </div>
                </div>

                <div
                  className="rounded-[20px] border p-5"
                  style={{ background: softBg, borderColor: softBorder }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Truck size={16} style={{ color: '#8b5cf6' }} />
                    <span style={{ color: heading }}>Delivery Orders</span>
                  </div>
                  <div
                    className="text-3xl font-black"
                    style={{ color: isLight ? '#0f172a' : '#f8fafc' }}
                  >
                    {fulfillmentBreakdown.deliver}
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue by Month" isLight={isLight}>
              <div className="space-y-4">
                {monthlyRevenue.length === 0 ? (
                  <p style={{ color: subText }}>No revenue data available yet.</p>
                ) : (
                  monthlyRevenue.map(([month, value]) => (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: heading }}>{month}</span>
                        <span style={{ color: subText }}>{formatPeso(value)}</span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: softBg, border: `1px solid ${softBorder}` }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(value / maxMonthlyRevenue) * 100}%`,
                            background: '#13A150',
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ChartCard>

            <ChartCard title="Message Concern Types" isLight={isLight}>
              <div className="space-y-4">
                {concernBreakdown.length === 0 ? (
                  <p style={{ color: subText }}>No message data available yet.</p>
                ) : (
                  concernBreakdown.map(([type, count]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: heading }}>{type}</span>
                        <span style={{ color: subText }}>{count}</span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: softBg, border: `1px solid ${softBorder}` }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / maxConcernCount) * 100}%`,
                            background: '#f59e0b',
                          }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </AdminLayout>
  )
}