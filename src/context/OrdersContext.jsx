import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const OrdersContext = createContext(null)

export const ORDER_STATUSES = {
  new:             { label: 'New',            color: '#EC008C', bg: 'rgba(236,0,140,0.12)' },
  quoted:          { label: 'Quoted',         color: '#FBB03B', bg: 'rgba(251,176,59,0.12)' },
  artwork_pending: { label: 'Artwork Needed', color: '#29ABE2', bg: 'rgba(41,171,226,0.12)' },
  printing:        { label: 'Printing',       color: '#2DB04B', bg: 'rgba(45,176,75,0.12)'  },
  completed:       { label: 'Completed',      color: '#888',    bg: 'rgba(136,136,136,0.10)' },
  cancelled:       { label: 'Cancelled',      color: '#555',    bg: 'rgba(85,85,85,0.10)'   },
}

export function OrdersProvider({ children }) {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          status,
          order_type,
          notes,
          estimated_total,
          customer_name,
          customer_email,
          customer_phone,
          customer_company,
          order_items ( id, name, qty, unit, unit_price ),
          email_threads ( id, from_role, sent_by, sent_at, subject, body )
        `)
        .order('created_at', { ascending: false })

      if (err) throw err

      // Normalize to the shape the UI expects
      const normalized = (data ?? []).map(o => ({
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
      }))

      setOrders(normalized)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Real-time: re-fetch whenever a new order is inserted or updated
  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => { fetchOrders() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [fetchOrders])

  async function updateStatus(id, status) {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
    if (error) {
      console.error('Failed to update status:', error.message)
      fetchOrders() // revert on failure
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
      fetchOrders() // revert on failure
    }
  }

  return (
    <OrdersContext.Provider value={{ orders, loading, error, updateStatus, addEmailToThread, refetch: fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be inside OrdersProvider')
  return ctx
}