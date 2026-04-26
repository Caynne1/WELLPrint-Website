import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const OrdersContext = createContext(null)

// ─── Normalizer ────────────────────────────────────────────────
function normalizeOrder(o) {
  return {
    id:             o.id,
    createdAt:      o.created_at,
    status:         o.status,
    orderType:      o.order_type,
    notes:          o.notes ?? '',
    estimatedTotal: o.estimated_total ?? 0,
    customer: {
      name:    o.customer_name,
      email:   o.customer_email,
      phone:   o.customer_phone ?? '',
      company: o.customer_company ?? '',
    },
    items: (o.order_items ?? []).map(i => ({
      name:      i.name,
      qty:       i.qty,
      unit:      i.unit,
      unitPrice: i.unit_price,
    })),
    emailThread: (o.email_threads ?? [])
      .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
      .map(e => ({
        from:    e.from_role,
        by:      e.sent_by,
        at:      e.sent_at,
        subject: e.subject,
        body:    e.body,
      })),
  }
}

const ORDER_SELECT = `
  id, created_at, status, order_type, notes, estimated_total,
  customer_name, customer_email, customer_phone, customer_company,
  order_items ( id, name, qty, unit, unit_price ),
  email_threads ( id, from_role, sent_by, sent_at, subject, body )
`

export function OrdersProvider({ children }) {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const fetchIdRef = useRef(0)

  // ── Full fetch (initial load or forced refresh) ─────────────
  const fetchOrders = useCallback(async () => {
    const id = ++fetchIdRef.current
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .order('created_at', { ascending: false })

      if (id !== fetchIdRef.current) return // stale
      if (err) throw err

      setOrders((data ?? []).map(normalizeOrder))
    } catch (e) {
      if (id === fetchIdRef.current) setError(e.message)
    } finally {
      if (id === fetchIdRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // ── Incremental realtime updates ────────────────────────────
  // Instead of re-fetching ALL orders on every change, we handle
  // INSERT/UPDATE/DELETE individually and only fetch the single
  // changed record when needed.

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime-v2')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        async (payload) => {
          // Fetch the full record with joins
          const { data } = await supabase
            .from('orders')
            .select(ORDER_SELECT)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            setOrders(prev => [normalizeOrder(data), ...prev])
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        async (payload) => {
          const { data } = await supabase
            .from('orders')
            .select(ORDER_SELECT)
            .eq('id', payload.new.id)
            .single()

          if (data) {
            const updated = normalizeOrder(data)
            setOrders(prev =>
              prev.map(o => o.id === updated.id ? updated : o)
            )
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // ── Mutations ───────────────────────────────────────────────

  async function updateStatus(id, status) {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Failed to update status:', error.message)
      // Revert just this order, not a full refetch
      const { data } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('id', id)
        .single()

      if (data) {
        const reverted = normalizeOrder(data)
        setOrders(prev => prev.map(o => o.id === id ? reverted : o))
      }
    }
  }

  async function addEmailToThread(id, emailEntry) {
    // Optimistic update
    setOrders(prev => prev.map(o =>
      o.id === id ? { ...o, emailThread: [...o.emailThread, emailEntry] } : o
    ))

    const { error } = await supabase
      .from('email_threads')
      .insert({
        order_id:  id,
        from_role: emailEntry.from,
        sent_by:   emailEntry.by ?? null,
        sent_at:   emailEntry.at,
        subject:   emailEntry.subject,
        body:      emailEntry.body,
      })

    if (error) {
      console.error('Failed to save email thread:', error.message)
      // Revert
      const { data } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .eq('id', id)
        .single()

      if (data) {
        const reverted = normalizeOrder(data)
        setOrders(prev => prev.map(o => o.id === id ? reverted : o))
      }
    }
  }

  return (
    <OrdersContext.Provider value={{
      orders, loading, error,
      updateStatus, addEmailToThread,
      refetch: fetchOrders,
    }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be inside OrdersProvider')
  return ctx
}
