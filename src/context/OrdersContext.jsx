import { createContext, useContext, useState } from 'react'

const OrdersContext = createContext(null)

// Simulate orders that come from the cart inquiry form
const MOCK_ORDERS = [
  {
    id: 'WP-2025-0041',
    createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    status: 'new',
    customer: { name: 'Reginald Cruz', email: 'reginald@example.com', phone: '+63 917 123 4567', company: 'Cruz Events' },
    orderType: 'New Print Order',
    notes: 'Need rush delivery before Friday. Double-sided, glossy.',
    items: [
      { name: 'Flyers A5',      qty: 500,  unit: 'pcs', unitPrice: 3.50 },
      { name: 'Business Cards', qty: 1000, unit: 'pcs', unitPrice: 1.20 },
    ],
    estimatedTotal: 1950,
    emailThread: [],
  },
  {
    id: 'WP-2025-0040',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'quoted',
    customer: { name: 'Maria Santos', email: 'maria.santos@blooms.ph', phone: '+63 918 555 9900', company: 'Blooms PH' },
    orderType: 'Bulk / Corporate Order',
    notes: 'Annual company calendar printing. 4 design variants.',
    items: [
      { name: 'Wall Calendar A2', qty: 200, unit: 'pcs', unitPrice: 85 },
    ],
    estimatedTotal: 17000,
    emailThread: [
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), subject: 'Quote for your WELLPrint order WP-2025-0040', body: 'Hi Maria, thank you for your order...' },
    ],
  },
  {
    id: 'WP-2025-0039',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'artwork_pending',
    customer: { name: 'Jun dela Rosa', email: 'jun@delrosa.ph', phone: '+63 920 111 2222', company: '' },
    orderType: 'New Print Order',
    notes: '',
    items: [
      { name: 'Tarpaulin 4x8ft', qty: 3, unit: 'pcs', unitPrice: 450 },
    ],
    estimatedTotal: 1350,
    emailThread: [
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), subject: 'Quote for your WELLPrint order WP-2025-0039', body: 'Hi Jun, here is your quote...' },
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), subject: 'Artwork needed — WP-2025-0039', body: 'Hi Jun, please send your artwork files...' },
    ],
  },
  {
    id: 'WP-2025-0038',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'printing',
    customer: { name: 'Arlene Reyes', email: 'arlene@sunrisecafe.ph', phone: '+63 915 888 7766', company: 'Sunrise Cafe' },
    orderType: 'New Print Order',
    notes: 'Menu cards — matte laminated.',
    items: [
      { name: 'Menu Cards A4', qty: 100, unit: 'pcs', unitPrice: 28 },
    ],
    estimatedTotal: 2800,
    emailThread: [
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), subject: 'Quote for WP-2025-0038', body: 'Hi Arlene...' },
    ],
  },
  {
    id: 'WP-2025-0037',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'completed',
    customer: { name: 'Paolo Tan', email: 'paolo@tangroup.ph', phone: '+63 917 333 4455', company: 'Tan Group' },
    orderType: 'Bulk / Corporate Order',
    notes: '',
    items: [
      { name: 'Stickers (die-cut)', qty: 2000, unit: 'pcs', unitPrice: 0.95 },
    ],
    estimatedTotal: 1900,
    emailThread: [
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), subject: 'Quote for WP-2025-0037', body: '...' },
      { from: 'staff', at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), subject: 'Order Complete — WP-2025-0037', body: '...' },
    ],
  },
]

export const ORDER_STATUSES = {
  new:             { label: 'New',              color: '#EC008C', bg: 'rgba(236,0,140,0.12)' },
  quoted:          { label: 'Quoted',           color: '#FBB03B', bg: 'rgba(251,176,59,0.12)' },
  artwork_pending: { label: 'Artwork Needed',   color: '#29ABE2', bg: 'rgba(41,171,226,0.12)' },
  printing:        { label: 'Printing',         color: '#2DB04B', bg: 'rgba(45,176,75,0.12)'  },
  completed:       { label: 'Completed',        color: '#888',    bg: 'rgba(136,136,136,0.10)' },
  cancelled:       { label: 'Cancelled',        color: '#555',    bg: 'rgba(85,85,85,0.10)'   },
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(MOCK_ORDERS)

  function updateStatus(id, status) {
    setOrders(os => os.map(o => o.id === id ? { ...o, status } : o))
  }

  function addEmailToThread(id, emailEntry) {
    setOrders(os => os.map(o =>
      o.id === id ? { ...o, emailThread: [...o.emailThread, emailEntry] } : o
    ))
  }

  return (
    <OrdersContext.Provider value={{ orders, updateStatus, addEmailToThread }}>
      {children}
    </OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be inside OrdersProvider')
  return ctx
}
