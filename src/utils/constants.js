// ─── Order Statuses ────────────────────────────────────────────
export const ORDER_STATUSES = {
  new:             { label: 'New',            color: '#CD1B6E', bg: 'rgba(236,0,140,0.12)' },
  pending:         { label: 'Pending',        color: '#1993D2', bg: 'rgba(25,147,210,0.10)' },
  processing:      { label: 'Processing',     color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  quoted:          { label: 'Quoted',         color: '#FDC010', bg: 'rgba(251,176,59,0.12)' },
  artwork_pending: { label: 'Artwork Needed', color: '#1993D2', bg: 'rgba(25,147,210,0.12)' },
  printing:        { label: 'Printing',       color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
  ready:           { label: 'Ready',          color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  completed:       { label: 'Completed',      color: '#16a34a', bg: 'rgba(22,163,74,0.10)' },
  cancelled:       { label: 'Cancelled',      color: '#dc2626', bg: 'rgba(220,38,38,0.10)' },
}

export const STATUS_FLOW = ['pending', 'processing', 'printing', 'ready', 'completed']

// ─── Order Types ───────────────────────────────────────────────
export const ORDER_TYPES = [
  'New Print Order',
  'Request a Quote',
  'Bulk / Corporate Order',
  'Rush Order',
  'Follow Up on an Order',
  'General Question',
]

// ─── File Upload ───────────────────────────────────────────────
export const ACCEPTED_FILE_TYPES = ['pdf', 'ai', 'eps', 'jpg', 'jpeg', 'png', 'tiff', 'zip']
export const ACCEPTED_FILE_MIME = '.pdf,.ai,.eps,.jpg,.jpeg,.png,.tiff,.zip'
export const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

// ─── Concern Types (Contact Page) ──────────────────────────────
export const CONCERN_TYPES = [
  'General Inquiry',
  'Order Follow-up',
  'Cancel Order Request',
  'Change Layout Request',
  'Change Delivery / Pickup Request',
  'Billing Concern',
  'Other',
]
