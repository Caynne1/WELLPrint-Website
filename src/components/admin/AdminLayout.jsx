import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/DashboardThemeContext'
import { useNotifications } from '../../context/NotificationContext'
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Bell,
  Users,
  BarChart2,
  ShoppingBag,
  Shield,
  Home,
  ExternalLink,
  Tag,
  PanelLeftClose,
  PanelLeftOpen,
  Mail,
  Sun,
  Moon,
  CheckCheck,
  Circle,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',            icon: LayoutDashboard, label: 'Dashboard',   perm: null },
  { to: '/dashboard/orders',     icon: Package,         label: 'Orders',      perm: 'view_orders' },
  { to: '/dashboard/customers',  icon: Users,           label: 'Customers',   perm: 'view_orders' },
  { to: '/dashboard/inbox',      icon: Mail,            label: 'Inbox',       perm: null },
  { to: '/dashboard/products',   icon: ShoppingBag,     label: 'Products',    perm: 'view_products' },
  { to: '/dashboard/categories', icon: Tag,             label: 'Categories',  perm: 'manage_categories' },
  { to: '/dashboard/analytics',  icon: BarChart2,       label: 'Analytics',   perm: 'view_analytics' },
]

const ADMIN_NAV = [{ to: '/dashboard/staff', icon: Users, label: 'Staff Mgmt' }]

/* ─── Relative time helper ──────────────────────────────────────────────────── */
function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

/* ─── Notification Bell ─────────────────────────────────────────────────────── */
function NotificationBell({ isLight }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  const navigate  = useNavigate()
  const [open, setOpen]     = useState(false)
  const [filter, setFilter] = useState('all')
  const wrapRef = useRef(null)

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  function handleClick(notif) {
    markRead(notif.id)
    setOpen(false)
    navigate(notif.link)
  }

  /* colours */
  const iconColor    = isLight ? 'rgba(15,23,42,0.40)'  : 'rgba(148,163,184,0.75)'
  const dropBg       = isLight ? '#ffffff'               : '#0d2240'
  const dropBorder   = isLight ? 'rgba(15,23,42,0.08)'  : 'rgba(255,255,255,0.08)'
  const headerBg     = isLight ? '#f8fafc'               : '#081833'
  const textPrimary  = isLight ? '#0f172a'               : '#f0f4ff'
  const textMuted    = isLight ? '#5a7a9a'               : 'rgba(168,190,217,0.60)'
  const itemHover    = isLight ? '#f0f6ff'               : 'rgba(25,147,210,0.07)'
  const sepColor     = isLight ? 'rgba(15,23,42,0.07)'  : 'rgba(255,255,255,0.07)'
  const tabActive    = '#1993D2'

  return (
    <div className="relative" ref={wrapRef}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200"
        style={{
          background:   open ? (isLight ? 'rgba(25,147,210,0.08)' : 'rgba(25,147,210,0.12)') : 'transparent',
          borderColor:  open ? 'rgba(25,147,210,0.30)' : (isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.08)'),
          color:        open ? '#1993D2' : iconColor,
        }}
        title="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1 leading-none"
            style={{ background: '#ef4444' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-[22rem] rounded-2xl overflow-hidden shadow-2xl z-50 border"
          style={{ background: dropBg, borderColor: dropBorder }}
        >

          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ background: headerBg, borderColor: sepColor }}
          >
            <div className="flex items-center gap-2">
              <Bell size={13} style={{ color: '#1993D2' }} />
              <span className="font-semibold text-sm" style={{ color: textPrimary }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white leading-none"
                  style={{ background: '#ef4444' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] font-semibold transition-opacity hover:opacity-70"
                style={{ color: '#1993D2' }}
              >
                <CheckCheck size={11} /> Mark all read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex border-b" style={{ borderColor: sepColor }}>
            {[
              { key: 'all',    label: 'All' },
              { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="flex-1 py-2.5 text-[11px] font-semibold transition-all border-b-2"
                style={{
                  color:       filter === tab.key ? tabActive : textMuted,
                  borderColor: filter === tab.key ? tabActive : 'transparent',
                  background:  'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="overflow-y-auto max-h-[360px]" style={{ scrollbarWidth: 'thin' }}>
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Bell size={26} style={{ color: textMuted, opacity: 0.3 }} />
                <p className="text-xs" style={{ color: textMuted }}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
              </div>
            ) : (
              displayed.map((notif, idx) => (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className="w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all duration-150 border-b last:border-b-0"
                  style={{ borderColor: sepColor, background: 'transparent' }}
                  onMouseEnter={e => (e.currentTarget.style.background = itemHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Type icon */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: notif.type === 'order'
                        ? 'rgba(19,161,80,0.14)'
                        : 'rgba(25,147,210,0.14)',
                      border: notif.type === 'order'
                        ? '1px solid rgba(19,161,80,0.22)'
                        : '1px solid rgba(25,147,210,0.22)',
                    }}
                  >
                    {notif.type === 'order'
                      ? <Package size={13} style={{ color: '#13A150' }} />
                      : <Mail    size={13} style={{ color: '#1993D2' }} />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: textPrimary, fontWeight: notif.isRead ? 500 : 700 }}
                      >
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <Circle
                          size={6}
                          className="shrink-0 fill-current"
                          style={{ color: '#1993D2' }}
                        />
                      )}
                    </div>
                    <p
                      className="text-[11px] leading-snug line-clamp-2"
                      style={{ color: textMuted }}
                    >
                      {notif.body}
                    </p>
                    <p
                      className="text-[10px] mt-1"
                      style={{ color: textMuted, opacity: 0.65 }}
                    >
                      {formatRelativeTime(notif.createdAt)}
                    </p>
                  </div>

                  {/* Individual mark-read dot / button */}
                  {!notif.isRead && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead(notif.id) }}
                      className="shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(25,147,210,0.15)', border: '1px solid rgba(25,147,210,0.25)' }}
                      title="Mark as read"
                    >
                      <Circle size={5} className="fill-current" style={{ color: '#1993D2' }} />
                    </button>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer link */}
          <div
            className="px-4 py-2.5 border-t text-center"
            style={{ borderColor: sepColor, background: headerBg }}
          >
            <Link
              to="/dashboard/inbox"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: '#1993D2' }}
            >
              View all messages in Inbox →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Sidebar ───────────────────────────────────────────────────────────────── */
function Sidebar({ mobile = false, collapsed = false, onClose, onToggleCollapse, isLight }) {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebarBg    = isLight ? '#1993D2'                    : '#07152d'
  const sidebarBorder= isLight ? 'rgba(255,255,255,0.10)'     : 'rgba(255,255,255,0.06)'
  const textPrimary  = '#FFFFFF'
  const textFaint    = isLight ? 'rgba(255,255,255,0.68)'     : 'rgba(148,163,184,0.95)'
  const textMuted    = isLight ? 'rgba(255,255,255,0.88)'     : 'rgba(226,232,240,0.88)'
  const dividerColor = isLight ? 'rgba(255,255,255,0.12)'     : 'rgba(255,255,255,0.08)'
  const hoverBg      = isLight ? 'rgba(255,255,255,0.10)'     : 'rgba(255,255,255,0.06)'
  const activeBg     = isLight ? 'rgba(255,255,255,0.18)'     : 'rgba(25,147,210,0.18)'
  const activeBorder = isLight ? 'rgba(255,255,255,0.24)'     : 'rgba(25,147,210,0.30)'
  const controlBg    = isLight ? 'rgba(255,255,255,0.08)'     : 'rgba(255,255,255,0.04)'
  const controlBorder= isLight ? 'rgba(255,255,255,0.12)'     : 'rgba(255,255,255,0.08)'
  const sidebarWidth = mobile ? '17rem' : collapsed ? '5.5rem' : '16rem'

  const visibleNav = NAV.filter(({ perm }) => !perm || hasPermission?.(perm))

  return (
    <aside
      className="flex flex-col h-full p-4 sm:p-5 transition-all duration-300"
      style={{ background: sidebarBg, borderRight: `1px solid ${sidebarBorder}`, width: sidebarWidth }}
    >
      {/* Logo */}
      <div className="flex items-start justify-between gap-2 mb-8">
        <div className={`flex items-center gap-3 min-w-0 ${collapsed && !mobile ? 'justify-center w-full' : ''}`}>
          <img src="/logos/icons/icon-dark.svg" alt="WELLPrint" className="w-10 h-10 object-contain shrink-0" />
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="truncate leading-none" style={{ color: textPrimary, fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.25rem' }}>
                WELLPrint
              </div>
              <div className="mt-1 uppercase tracking-[0.22em] truncate" style={{ color: isLight ? 'rgba(255,255,255,0.78)' : 'rgba(191,219,254,0.78)', fontSize: '0.65rem', fontWeight: 600 }}>
                Admin Portal
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!mobile && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-8 h-8 rounded-xl items-center justify-center transition-all"
              style={{ color: textMuted, background: controlBg, border: `1px solid ${controlBorder}` }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}
          {mobile && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{ color: textMuted, background: controlBg, border: `1px solid ${controlBorder}` }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col min-h-0">
        <div className="space-y-1.5">
          {visibleNav.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-[16px] transition-all duration-200 ${collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'}`}
                style={{ background: active ? activeBg : 'transparent', border: `1px solid ${active ? activeBorder : 'transparent'}`, color: textPrimary }}
                title={collapsed && !mobile ? label : undefined}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <Icon size={18} style={{ color: '#FFFFFF', flexShrink: 0 }} />
                {(!collapsed || mobile) && (
                  <>
                    <span className="flex-1 truncate" style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: active ? 600 : 500 }}>
                      {label}
                    </span>
                    {active && <ChevronRight size={14} style={{ color: '#FFFFFF' }} />}
                  </>
                )}
              </Link>
            )
          })}
        </div>

        {user?.role === 'admin' && (
          <div className="mt-5 pt-5" style={{ borderTop: `1px solid ${dividerColor}` }}>
            {(!collapsed || mobile) && (
              <div className="flex items-center gap-2 px-1 mb-2">
                <Shield size={11} style={{ color: '#FFFFFF' }} />
                <span style={{ color: isLight ? 'rgba(255,255,255,0.72)' : 'rgba(191,219,254,0.78)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Admin Only
                </span>
                <div className="flex-1 h-px" style={{ background: dividerColor }} />
              </div>
            )}
            <div className="space-y-1.5">
              {ADMIN_NAV.map(({ to, icon: Icon, label }) => {
                const active = location.pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-[16px] transition-all duration-200 ${collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'}`}
                    style={{ background: active ? activeBg : 'transparent', border: `1px solid ${active ? activeBorder : 'transparent'}`, color: '#FFFFFF' }}
                    title={collapsed && !mobile ? label : undefined}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    <Icon size={18} style={{ color: '#FFFFFF', flexShrink: 0 }} />
                    {(!collapsed || mobile) && (
                      <>
                        <span className="flex-1 truncate" style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: active ? 600 : 500 }}>
                          {label}
                        </span>
                        {active && <ChevronRight size={14} style={{ color: '#FFFFFF' }} />}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User info + actions */}
      <div className="pt-4 mt-4 space-y-3" style={{ borderTop: `1px solid ${dividerColor}` }}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
              style={{ background: isLight ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)', border: `1px solid ${controlBorder}`, color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}
            >
              {user?.name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate" style={{ color: textPrimary }}>{user?.name}</div>
              <div className="truncate capitalize flex items-center gap-1" style={{ color: textFaint, fontSize: '0.72rem' }}>
                <User size={11} />
                {user?.role}
              </div>
            </div>
          </div>
        )}

        <Link
          to="/"
          onClick={onClose}
          className={`w-full flex items-center gap-2 rounded-[16px] border transition-all ${collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'}`}
          style={{ borderColor: controlBorder, color: '#FFFFFF', background: 'transparent' }}
          title={collapsed && !mobile ? 'Back to Homepage' : undefined}
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <Home size={14} />
          {(!collapsed || mobile) && (
            <>
              <span className="flex-1 text-sm">Back to Homepage</span>
              <ExternalLink size={11} className="opacity-70" />
            </>
          )}
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 rounded-[16px] border transition-all ${collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'}`}
          style={{ borderColor: controlBorder, color: '#FFFFFF', background: 'transparent' }}
          title={collapsed && !mobile ? 'Sign Out' : undefined}
          onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={14} />
          {(!collapsed || mobile) && <span className="flex-1 text-left text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

/* ─── Layout ────────────────────────────────────────────────────────────────── */
export default function AdminLayout({ children }) {
  const { user }           = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location           = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed]     = useState(false)

  const isLight = theme === 'light'

  const headerBg      = isLight ? '#FFFFFF'                   : '#021022'
  const headerBorder  = isLight ? '1px solid rgba(15,23,42,0.06)' : '1px solid rgba(255,255,255,0.06)'
  const breadcrumbColor = isLight ? 'rgba(15,23,42,0.40)'    : 'rgba(148,163,184,0.75)'

  const currentLabel =
    NAV.find((n) => location.pathname === n.to || (n.to !== '/dashboard' && location.pathname.startsWith(n.to)))?.label ??
    ADMIN_NAV.find((n) => location.pathname.startsWith(n.to))?.label ??
    'Admin'

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: isLight ? '#F4F7FB' : '#03112a' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} isLight={isLight} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <Sidebar mobile onClose={() => setSidebarOpen(false)} isLight={isLight} />
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{ background: headerBg, borderBottom: headerBorder }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden transition-colors"
              style={{ color: isLight ? '#0f172a' : 'rgba(226,232,240,0.80)' }}
            >
              <Menu size={20} />
            </button>
            <span className="text-[10px] tracking-widest uppercase" style={{ color: breadcrumbColor }}>
              {currentLabel}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] border transition-all"
              style={{
                background:   isLight ? 'rgba(15,23,42,0.04)'  : 'rgba(255,255,255,0.05)',
                borderColor:  isLight ? 'rgba(15,23,42,0.10)'  : 'rgba(255,255,255,0.10)',
                color:        isLight ? '#0f172a'               : 'rgba(226,232,240,0.85)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(25,147,210,0.40)'
                e.currentTarget.style.color = '#1993D2'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)'
                e.currentTarget.style.color = isLight ? '#0f172a' : 'rgba(226,232,240,0.85)'
              }}
            >
              {isLight ? <Sun size={13} /> : <Moon size={13} />}
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] hidden sm:block">
                {isLight ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Notification bell */}
            <NotificationBell isLight={isLight} />

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[10px] border transition-all"
              style={{
                borderColor: isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)',
                color:       isLight ? 'rgba(15,23,42,0.50)' : 'rgba(226,232,240,0.70)',
                background:  'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isLight ? 'rgba(25,147,210,0.45)' : 'rgba(25,147,210,0.40)'
                e.currentTarget.style.color = isLight ? '#1993D2' : '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)'
                e.currentTarget.style.color = isLight ? 'rgba(15,23,42,0.50)' : 'rgba(226,232,240,0.70)'
              }}
            >
              <Home size={11} /> Homepage
            </Link>

            <div className="text-xs hidden sm:block" style={{ color: isLight ? 'rgba(15,23,42,0.50)' : 'rgba(226,232,240,0.80)' }}>
              {user?.name}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
