import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Fetches dashboard stats from the server-side get_dashboard_stats() function
 * instead of doing multiple client-side queries.
 *
 * Usage:
 *   const { stats, loading, refetch, lastRefreshed } = useDashboardStats()
 */

const EMPTY_STATS = {
  revenue_today: 0,
  revenue_week: 0,
  revenue_month: 0,
  total_orders: 0,
  pending_orders: 0,
  total_products: 0,
  total_staff: 0,
  total_inbox: 0,
}

export default function useDashboardStats() {
  const [stats, setStats]               = useState(EMPTY_STATS)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase.rpc('get_dashboard_stats')

      if (err) throw err

      setStats(data || EMPTY_STATS)
      setLastRefreshed(new Date())
    } catch (e) {
      console.error('Dashboard stats fetch failed:', e.message)
      setError(e.message)

      // Fallback: if the RPC doesn't exist yet, use legacy client-side approach
      if (e.message?.includes('function') || e.message?.includes('does not exist')) {
        await fetchStatsLegacy()
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Legacy fallback for when the migration hasn't been applied yet
  async function fetchStatsLegacy() {
    try {
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
      const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0)
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7)
      const startOfMonth = new Date(now); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0)

      const [dayRev, weekRev, monthRev] = await Promise.all([
        supabase.from('orders').select('estimated_total').gte('created_at', startOfDay.toISOString()).not('status', 'eq', 'cancelled'),
        supabase.from('orders').select('estimated_total').gte('created_at', startOfWeek.toISOString()).not('status', 'eq', 'cancelled'),
        supabase.from('orders').select('estimated_total').gte('created_at', startOfMonth.toISOString()).not('status', 'eq', 'cancelled'),
      ])

      const sum = (r) => (r.data || []).reduce((acc, row) => acc + (row.estimated_total || 0), 0)

      setStats({
        revenue_today: sum(dayRev),
        revenue_week: sum(weekRev),
        revenue_month: sum(monthRev),
        total_orders: allOrders.count || 0,
        pending_orders: pendingCount || 0,
        total_products: products.count || 0,
        total_staff: staff.count || 0,
        total_inbox: inbox.count || 0,
      })
      setLastRefreshed(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { fetchStats() }, [fetchStats])

  // Auto-refresh on realtime events
  useEffect(() => {
    const ordersChannel = supabase
      .channel('dashboard-stats-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchStats)
      .subscribe()

    return () => { supabase.removeChannel(ordersChannel) }
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats, lastRefreshed }
}
