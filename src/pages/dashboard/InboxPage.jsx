import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/DashboardThemeContext'
import {
  Mail,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  MessageSquare,
  FileText,
  User,
} from 'lucide-react'

const TYPE_COLORS = {
  'General Inquiry': {
    bg: 'rgba(25,147,210,0.10)',
    border: 'rgba(25,147,210,0.20)',
    color: '#1993D2',
  },
  'Request Quote': {
    bg: 'rgba(22,163,74,0.10)',
    border: 'rgba(22,163,74,0.20)',
    color: '#16a34a',
  },
  'Order Follow-up': {
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.20)',
    color: '#f59e0b',
  },
  'Cancel Order Request': {
    bg: 'rgba(220,38,38,0.10)',
    border: 'rgba(220,38,38,0.20)',
    color: '#dc2626',
  },
  'Change Layout Request': {
    bg: 'rgba(139,92,246,0.10)',
    border: 'rgba(139,92,246,0.20)',
    color: '#8b5cf6',
  },
  'Change Delivery / Pickup Request': {
    bg: 'rgba(16,185,129,0.10)',
    border: 'rgba(16,185,129,0.20)',
    color: '#10b981',
  },
  'Billing Concern': {
    bg: 'rgba(236,72,153,0.10)',
    border: 'rgba(236,72,153,0.20)',
    color: '#ec4899',
  },
  Other: {
    bg: 'rgba(100,116,139,0.10)',
    border: 'rgba(100,116,139,0.20)',
    color: '#64748b',
  },
}

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return '—'
  }
}

function TypeBadge({ type }) {
  const style = TYPE_COLORS[type] || TYPE_COLORS.Other

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{
        background: style.bg,
        borderColor: style.border,
        color: style.color,
      }}
    >
      <FileText size={12} />
      {type || 'Other'}
    </span>
  )
}

function SummaryCard({ title, value, icon: Icon, color, isLight }) {
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

export default function InboxPage() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('inbox-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'contact_messages' },
        (payload) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? payload.new : m))
          )
          setSelected((prev) =>
            prev?.id === payload.new.id ? payload.new : prev
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMessages() {
    setLoading(true)

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch messages:', error)
      setMessages([])
    } else {
      setMessages(data || [])
      if (data?.length && !selected) {
        setSelected(data[0])
      }
    }

    setLoading(false)
  }

  async function markAsRead(message) {
    if (!message || message.is_read) return
    setUpdatingId(message.id)

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', message.id)
      .select()
      .single()

    if (!error && data) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? data : m)))
      setSelected(data)
    }

    setUpdatingId(null)
  }

  async function toggleResolved(message) {
    if (!message) return
    setUpdatingId(message.id)

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_resolved: !message.is_resolved, is_read: true })
      .eq('id', message.id)
      .select()
      .single()

    if (!error && data) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? data : m)))
      setSelected(data)
    }

    setUpdatingId(null)
  }

  async function toggleRead(message) {
    if (!message) return
    setUpdatingId(message.id)

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_read: !message.is_read })
      .eq('id', message.id)
      .select()
      .single()

    if (!error && data) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? data : m)))
      setSelected(data)
    }

    setUpdatingId(null)
  }

  const filteredMessages = useMemo(() => {
    let result = [...messages]

    if (filter === 'new') {
      result = result.filter((m) => !m.is_read)
    } else if (filter === 'resolved') {
      result = result.filter((m) => m.is_resolved)
    } else if (filter === 'open') {
      result = result.filter((m) => !m.is_resolved)
    }

    if (search.trim()) {
      const keyword = search.trim().toLowerCase()
      result = result.filter((m) => {
        const name = (m.full_name || '').toLowerCase()
        const email = (m.email || '').toLowerCase()
        const type = (m.concern_type || '').toLowerCase()
        const orderId = (m.order_id || '').toLowerCase()
        const message = (m.message || '').toLowerCase()

        return (
          name.includes(keyword) ||
          email.includes(keyword) ||
          type.includes(keyword) ||
          orderId.includes(keyword) ||
          message.includes(keyword)
        )
      })
    }

    return result
  }, [messages, search, filter])

  const summary = useMemo(() => {
    return {
      total: messages.length,
      unread: messages.filter((m) => !m.is_read).length,
      open: messages.filter((m) => !m.is_resolved).length,
      resolved: messages.filter((m) => m.is_resolved).length,
    }
  }, [messages])

  const sectionBg = isLight ? '#FFFFFF' : 'rgba(9, 25, 53, 0.92)'
  const sectionBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const sectionShadow = isLight
    ? '0 10px 30px rgba(15,23,42,0.05)'
    : '0 10px 30px rgba(0,0,0,0.24)'
  const heading = isLight ? '#0f172a' : '#f8fafc'
  const subText = isLight ? '#64748b' : 'rgba(226,232,240,0.78)'
  const muted = isLight ? '#94a3b8' : 'rgba(148,163,184,0.82)'
  const softBg = isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)'
  const softBorder = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const divider = isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.06)'
  const activeMessageBg = isLight ? 'rgba(25,147,210,0.05)' : 'rgba(25,147,210,0.10)'

  return (
    <AdminLayout>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(25,147,210,0.10)',
                border: '1px solid rgba(25,147,210,0.20)',
              }}
            >
              <Mail size={15} style={{ color: '#1993D2' }} />
            </div>
            <span
              className="text-[10px] font-semibold tracking-[0.22em] uppercase"
              style={{ color: muted }}
            >
              Inbox Management
            </span>
          </div>

          <h1
            className="text-[2rem] font-bold mb-1 leading-none"
            style={{ color: heading }}
          >
            Inbox
          </h1>
          <p className="text-sm" style={{ color: subText }}>
            View customer inquiries, requests, follow-ups, and concerns
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-[16px] text-sm font-semibold transition-all hover:scale-[1.01]"
          style={{
            background: sectionBg,
            border: `1px solid ${sectionBorder}`,
            color: subText,
            boxShadow: sectionShadow,
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <SummaryCard title="Total Messages" value={summary.total} icon={Mail} color="#1993D2" isLight={isLight} />
        <SummaryCard title="Unread" value={summary.unread} icon={Eye} color="#f59e0b" isLight={isLight} />
        <SummaryCard title="Open" value={summary.open} icon={Clock3} color="#8b5cf6" isLight={isLight} />
        <SummaryCard title="Resolved" value={summary.resolved} icon={CheckCircle2} color="#16a34a" isLight={isLight} />
      </div>

      <div className="grid xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <div
            className="rounded-[24px] border overflow-hidden"
            style={{
              background: sectionBg,
              borderColor: sectionBorder,
              boxShadow: sectionShadow,
            }}
          >
            <div className="p-5 border-b space-y-4" style={{ borderColor: divider }}>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: muted }}
                />
                <input
                  type="text"
                  placeholder="Search name, email, order ID, or message"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-[16px] border pl-9 pr-4 py-3 text-sm outline-none"
                  style={{
                    background: softBg,
                    borderColor: softBorder,
                    color: heading,
                  }}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'new', label: 'Unread' },
                  { key: 'open', label: 'Open' },
                  { key: 'resolved', label: 'Resolved' },
                ].map((item) => {
                  const active = filter === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => setFilter(item.key)}
                      className="px-4 py-2 rounded-[14px] text-xs font-semibold border transition-all"
                      style={{
                        background: active
                          ? isLight
                            ? 'rgba(25,147,210,0.10)'
                            : 'rgba(25,147,210,0.18)'
                          : 'transparent',
                        color: active ? '#1993D2' : subText,
                        borderColor: active
                          ? 'rgba(25,147,210,0.20)'
                          : softBorder,
                      }}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-flex items-center gap-2" style={{ color: subText }}>
                  <Loader2 size={16} className="animate-spin" />
                  Loading inbox...
                </div>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="py-20 text-center px-6">
                <Mail size={30} className="mx-auto mb-3" style={{ color: muted }} />
                <p className="text-sm" style={{ color: subText }}>No messages found.</p>
              </div>
            ) : (
              <div className="max-h-[700px] overflow-y-auto">
                {filteredMessages.map((message) => {
                  const active = selected?.id === message.id

                  return (
                    <button
                      key={message.id}
                      onClick={() => {
                        setSelected(message)
                        markAsRead(message)
                      }}
                      className="w-full text-left p-5 border-b transition-all"
                      style={{
                        background: active ? activeMessageBg : 'transparent',
                        borderColor: divider,
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = isLight
                            ? 'rgba(248,250,252,0.70)'
                            : 'rgba(255,255,255,0.03)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold" style={{ color: heading }}>
                            {message.full_name}
                          </p>
                          <p className="text-xs mt-1" style={{ color: muted }}>
                            {message.email}
                          </p>
                        </div>

                        {!message.is_read && (
                          <span
                            className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                            style={{ background: '#1993D2' }}
                          />
                        )}
                      </div>

                      <div className="mb-3">
                        <TypeBadge type={message.concern_type} />
                      </div>

                      {message.order_id && (
                        <p className="text-xs mb-2" style={{ color: subText }}>
                          Order ID:{' '}
                          <span className="font-semibold" style={{ color: heading }}>
                            {message.order_id}
                          </span>
                        </p>
                      )}

                      <p className="text-sm line-clamp-2" style={{ color: subText }}>
                        {message.message}
                      </p>

                      <div className="flex items-center justify-between gap-3 mt-3">
                        <p className="text-xs" style={{ color: muted }}>
                          {formatDateTime(message.created_at)}
                        </p>

                        <span
                          className="text-[11px] font-semibold"
                          style={{
                            color: message.is_resolved ? '#16a34a' : '#f59e0b',
                          }}
                        >
                          {message.is_resolved ? 'Resolved' : 'Open'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-7">
          <div
            className="rounded-[24px] border min-h-[620px]"
            style={{
              background: sectionBg,
              borderColor: sectionBorder,
              boxShadow: sectionShadow,
            }}
          >
            {!selected ? (
              <div className="h-full min-h-[620px] flex items-center justify-center text-center px-6">
                <div>
                  <MessageSquare size={32} className="mx-auto mb-4" style={{ color: muted }} />
                  <p className="text-sm" style={{ color: subText }}>
                    Select a message from the inbox to view details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{
                          background: 'rgba(25,147,210,0.10)',
                          border: '1px solid rgba(25,147,210,0.18)',
                        }}
                      >
                        <User size={16} style={{ color: '#1993D2' }} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: heading }}>
                          {selected.full_name}
                        </h2>
                        <p className="text-sm" style={{ color: subText }}>
                          {selected.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <TypeBadge type={selected.concern_type} />

                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                        style={{
                          background: selected.is_resolved
                            ? 'rgba(22,163,74,0.10)'
                            : 'rgba(245,158,11,0.10)',
                          borderColor: selected.is_resolved
                            ? 'rgba(22,163,74,0.20)'
                            : 'rgba(245,158,11,0.20)',
                          color: selected.is_resolved ? '#16a34a' : '#f59e0b',
                        }}
                      >
                        {selected.is_resolved ? (
                          <CheckCircle2 size={12} />
                        ) : (
                          <Clock3 size={12} />
                        )}
                        {selected.is_resolved ? 'Resolved' : 'Open'}
                      </span>

                      {!selected.is_read && (
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                          style={{
                            background: 'rgba(25,147,210,0.10)',
                            borderColor: 'rgba(25,147,210,0.20)',
                            color: '#1993D2',
                          }}
                        >
                          <Eye size={12} />
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => toggleRead(selected)}
                      disabled={updatingId === selected.id}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                      style={{
                        background: softBg,
                        color: subText,
                        borderColor: softBorder,
                      }}
                    >
                      {selected.is_read ? <EyeOff size={14} /> : <Eye size={14} />}
                      {selected.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>

                    <button
                      onClick={() => toggleResolved(selected)}
                      disabled={updatingId === selected.id}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold border transition-all"
                      style={{
                        background: selected.is_resolved
                          ? 'rgba(245,158,11,0.10)'
                          : 'rgba(22,163,74,0.10)',
                        color: selected.is_resolved ? '#f59e0b' : '#16a34a',
                        borderColor: selected.is_resolved
                          ? 'rgba(245,158,11,0.20)'
                          : 'rgba(22,163,74,0.20)',
                      }}
                    >
                      {updatingId === selected.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      {selected.is_resolved ? 'Mark Open' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div
                    className="rounded-[18px] border p-4"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: muted }}>Phone</p>
                    <p className="font-medium" style={{ color: heading }}>{selected.phone || '—'}</p>
                  </div>

                  <div
                    className="rounded-[18px] border p-4"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: muted }}>Order ID</p>
                    <p className="font-medium" style={{ color: heading }}>{selected.order_id || '—'}</p>
                  </div>

                  <div
                    className="rounded-[18px] border p-4 sm:col-span-2"
                    style={{
                      background: softBg,
                      borderColor: softBorder,
                    }}
                  >
                    <p className="text-xs mb-1" style={{ color: muted }}>Submitted</p>
                    <p className="font-medium" style={{ color: heading }}>
                      {formatDateTime(selected.created_at)}
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-[22px] border p-5"
                  style={{
                    background: softBg,
                    borderColor: softBorder,
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.18em] mb-3"
                    style={{ color: muted }}
                  >
                    Message
                  </p>
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: subText }}
                  >
                    {selected.message || '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}