import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

const NotificationContext = createContext(null)

const STORAGE_KEY = 'wellprint_notif_read'
const FETCH_LIMIT  = 50

function loadReadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

function orderToNotif(order, readIds) {
  const subtype = order.order_type || 'New Print Order'
  let title = 'New Order'
  if (subtype === 'Request a Quote')          title = 'Quote Request'
  else if (subtype === 'Rush Order')          title = 'Rush Order'
  else if (subtype === 'Bulk / Corporate Order') title = 'Bulk Order'
  else if (subtype === 'Follow Up on an Order')  title = 'Order Follow-up'
  else if (subtype === 'General Question')    title = 'General Question'

  const id = `order_${order.id}`
  return {
    id,
    type: 'order',
    subtype,
    title,
    body: `${order.customer_name || 'A customer'} — ${subtype}`,
    link: `/dashboard/orders/${order.id}`,
    createdAt: order.created_at,
    isRead: readIds.has(id),
    entityId: order.id,
  }
}

function messageToNotif(msg, readIds) {
  const subtype = msg.concern_type || 'General Inquiry'
  let title = 'New Inquiry'
  if (subtype === 'Request Quote')                        title = 'Quote Request'
  else if (subtype === 'Order Follow-up')                 title = 'Order Follow-up'
  else if (subtype === 'Cancel Order Request')            title = 'Cancel Order'
  else if (subtype === 'Billing Concern')                 title = 'Billing Concern'
  else if (subtype === 'Change Layout Request')           title = 'Layout Change'
  else if (subtype === 'Change Delivery / Pickup Request') title = 'Delivery Change'

  const id = `msg_${msg.id}`
  return {
    id,
    type: 'message',
    subtype,
    title,
    body: `${msg.full_name || 'A visitor'} — ${subtype}`,
    link: '/dashboard/inbox',
    createdAt: msg.created_at,
    // treat as read if already marked read in the DB OR dismissed locally
    isRead: !!msg.is_read || readIds.has(id),
    entityId: msg.id,
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const readIdsRef = useRef(loadReadIds())

  useEffect(() => {
    async function fetchAll() {
      const [ordersRes, msgsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id, created_at, order_type, customer_name, status')
          .order('created_at', { ascending: false })
          .limit(FETCH_LIMIT),
        supabase
          .from('contact_messages')
          .select('id, created_at, concern_type, full_name, is_read')
          .order('created_at', { ascending: false })
          .limit(FETCH_LIMIT),
      ])

      const readIds = readIdsRef.current
      const orderNotifs = (ordersRes.data ?? []).map(o => orderToNotif(o, readIds))
      const msgNotifs   = (msgsRes.data   ?? []).map(m => messageToNotif(m, readIds))

      setNotifications(
        [...orderNotifs, ...msgNotifs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )
      setLoading(false)
    }

    fetchAll()

    const orderCh = supabase
      .channel('notif_orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, ({ new: row }) => {
        setNotifications(prev => [orderToNotif(row, readIdsRef.current), ...prev])
      })
      .subscribe()

    const msgCh = supabase
      .channel('notif_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, ({ new: row }) => {
        setNotifications(prev => [messageToNotif(row, readIdsRef.current), ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(orderCh)
      supabase.removeChannel(msgCh)
    }
  }, [])

  const markRead = useCallback((id) => {
    readIdsRef.current.add(id)
    saveReadIds(readIdsRef.current)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => {
      prev.forEach(n => readIdsRef.current.add(n.id))
      saveReadIds(readIdsRef.current)
      return prev.map(n => ({ ...n, isRead: true }))
    })
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, loading }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
