import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
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
} from 'lucide-react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', perm: null },
  { to: '/dashboard/orders', icon: Package, label: 'Orders', perm: 'view_orders' },
  { to: '/dashboard/inbox', icon: Mail, label: 'Inbox', perm: null },
  { to: '/dashboard/products', icon: ShoppingBag, label: 'Products', perm: 'view_products' },
  { to: '/dashboard/categories', icon: Tag, label: 'Categories', perm: 'manage_categories' },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics', perm: 'view_analytics' },
]

const ADMIN_NAV = [{ to: '/dashboard/staff', icon: Users, label: 'Staff Mgmt' }]

function Sidebar({
  mobile = false,
  collapsed = false,
  onClose,
  onToggleCollapse,
  isLight,
  toggleTheme,
}) {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebarBg = isLight ? '#1993D2' : '#07152d'
  const sidebarBorder = isLight
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(255,255,255,0.06)'
  const textPrimary = '#FFFFFF'
  const textMuted = isLight ? 'rgba(255,255,255,0.88)' : 'rgba(226,232,240,0.88)'
  const textFaint = isLight ? 'rgba(255,255,255,0.68)' : 'rgba(148,163,184,0.95)'
  const dividerColor = isLight
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.08)'
  const hoverBg = isLight
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(255,255,255,0.06)'
  const activeBg = isLight
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(25,147,210,0.18)'
  const activeBorder = isLight
    ? 'rgba(255,255,255,0.24)'
    : 'rgba(25,147,210,0.30)'
  const controlBg = isLight
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(255,255,255,0.04)'
  const controlBorder = isLight
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.08)'
  const sidebarWidth = mobile ? '17rem' : collapsed ? '5.5rem' : '16rem'

  const visibleNav = NAV.filter(({ perm }) => !perm || hasPermission?.(perm))

  return (
    <aside
      className="flex flex-col h-full p-4 sm:p-5 transition-all duration-300"
      style={{
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        width: sidebarWidth,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-8">
        <div
          className={`flex items-center gap-3 min-w-0 ${
            collapsed && !mobile ? 'justify-center w-full' : ''
          }`}
        >
          <img
            src="/logos/icons/icon-dark.svg"
            alt="WELLPrint"
            className="w-10 h-10 object-contain shrink-0"
          />

          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div
                className="truncate leading-none"
                style={{
                  color: textPrimary,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                }}
              >
                WELLPrint
              </div>
              <div
                className="mt-1 uppercase tracking-[0.22em] truncate"
                style={{
                  color: isLight ? 'rgba(255,255,255,0.78)' : 'rgba(191,219,254,0.78)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
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
              style={{
                color: textMuted,
                background: controlBg,
                border: `1px solid ${controlBorder}`,
              }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>
          )}

          {mobile && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
              style={{
                color: textMuted,
                background: controlBg,
                border: `1px solid ${controlBorder}`,
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 flex flex-col min-h-0">
        <div className="space-y-1.5">
          {visibleNav.map(({ to, icon: Icon, label }) => {
            const active =
              location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))

            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-[16px] transition-all duration-200 ${
                  collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'
                }`}
                style={{
                  background: active ? activeBg : 'transparent',
                  border: `1px solid ${active ? activeBorder : 'transparent'}`,
                  color: textPrimary,
                }}
                title={collapsed && !mobile ? label : undefined}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = hoverBg
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon size={18} style={{ color: '#FFFFFF', flexShrink: 0 }} />
                {(!collapsed || mobile) && (
                  <>
                    <span
                      className="flex-1 truncate"
                      style={{
                        color: '#FFFFFF',
                        fontSize: '0.95rem',
                        fontWeight: active ? 600 : 500,
                      }}
                    >
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
                <span
                  style={{
                    color: isLight ? 'rgba(255,255,255,0.72)' : 'rgba(191,219,254,0.78)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
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
                    className={`group flex items-center gap-3 rounded-[16px] transition-all duration-200 ${
                      collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'
                    }`}
                    style={{
                      background: active ? activeBg : 'transparent',
                      border: `1px solid ${active ? activeBorder : 'transparent'}`,
                      color: '#FFFFFF',
                    }}
                    title={collapsed && !mobile ? label : undefined}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = hoverBg
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Icon size={18} style={{ color: '#FFFFFF', flexShrink: 0 }} />
                    {(!collapsed || mobile) && (
                      <>
                        <span
                          className="flex-1 truncate"
                          style={{
                            color: '#FFFFFF',
                            fontSize: '0.95rem',
                            fontWeight: active ? 600 : 500,
                          }}
                        >
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

      <div className="pt-4 mt-4 space-y-3" style={{ borderTop: `1px solid ${dividerColor}` }}>
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 rounded-[16px] border transition-all ${
            collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'
          }`}
          style={{
            borderColor: controlBorder,
            background: controlBg,
            color: '#FFFFFF',
          }}
          title={collapsed && !mobile ? (isLight ? 'Dark Mode' : 'Light Mode') : undefined}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: isLight ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${controlBorder}`,
            }}
          >
            {isLight ? (
              <Moon size={14} style={{ color: '#FFFFFF' }} />
            ) : (
              <Sun size={14} style={{ color: '#FFFFFF' }} />
            )}
          </div>

          {(!collapsed || mobile) && (
            <>
              <span
                className="flex-1 text-left uppercase"
                style={{
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                }}
              >
                {isLight ? 'Dark Mode' : 'Light Mode'}
              </span>

              <div
                className="w-9 h-5 rounded-full relative shrink-0"
                style={{
                  background: isLight
                    ? 'rgba(255,255,255,0.20)'
                    : 'rgba(25,147,210,0.35)',
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    background: '#FFFFFF',
                    left: isLight ? '1.05rem' : '0.12rem',
                  }}
                />
              </div>
            </>
          )}
        </button>

        {(!collapsed || mobile) && (
          <div className="flex items-center gap-3 px-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
              style={{
                background: isLight ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${controlBorder}`,
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {user?.name?.charAt(0) ?? '?'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate" style={{ color: textPrimary }}>
                {user?.name}
              </div>
              <div
                className="truncate capitalize flex items-center gap-1"
                style={{ color: textFaint, fontSize: '0.72rem' }}
              >
                <User size={11} />
                {user?.role}
              </div>
            </div>
          </div>
        )}

        <Link
          to="/"
          onClick={onClose}
          className={`w-full flex items-center gap-2 rounded-[16px] border transition-all ${
            collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'
          }`}
          style={{
            borderColor: controlBorder,
            color: '#FFFFFF',
            background: 'transparent',
          }}
          title={collapsed && !mobile ? 'Back to Homepage' : undefined}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = hoverBg
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
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
          className={`w-full flex items-center gap-2 rounded-[16px] border transition-all ${
            collapsed && !mobile ? 'justify-center px-0 py-3' : 'px-3 py-3'
          }`}
          style={{
            borderColor: controlBorder,
            color: '#FFFFFF',
            background: 'transparent',
          }}
          title={collapsed && !mobile ? 'Sign Out' : undefined}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = hoverBg
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <LogOut size={14} />
          {(!collapsed || mobile) && <span className="flex-1 text-left text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const isLight = theme === 'light'

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: isLight ? '#F4F7FB' : '#03112a' }}
    >
      <div className="hidden lg:flex flex-col h-full shrink-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          isLight={isLight}
          toggleTheme={toggleTheme}
        />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <Sidebar
            mobile
            onClose={() => setSidebarOpen(false)}
            isLight={isLight}
            toggleTheme={toggleTheme}
          />
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="shrink-0 flex items-center justify-between px-5 py-4"
          style={{
            background: isLight ? '#FFFFFF' : '#021022',
            borderBottom: isLight
              ? '1px solid rgba(15,23,42,0.06)'
              : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden transition-colors"
              style={{ color: isLight ? '#0f172a' : 'rgba(226,232,240,0.80)' }}
            >
              <Menu size={20} />
            </button>

            <span
              className="text-[10px] tracking-widest uppercase"
              style={{
                color: isLight ? 'rgba(15,23,42,0.40)' : 'rgba(148,163,184,0.75)',
              }}
            >
              {NAV.find((n) => location.pathname.startsWith(n.to))?.label ??
                ADMIN_NAV.find((n) => location.pathname.startsWith(n.to))?.label ??
                'Admin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Bell
              size={16}
              style={{
                color: isLight ? 'rgba(15,23,42,0.28)' : 'rgba(226,232,240,0.60)',
              }}
            />

            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-[10px] border transition-all"
              style={{
                borderColor: isLight ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)',
                color: isLight ? 'rgba(15,23,42,0.50)' : 'rgba(226,232,240,0.70)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isLight
                  ? 'rgba(25,147,210,0.45)'
                  : 'rgba(25,147,210,0.40)'
                e.currentTarget.style.color = isLight ? '#1993D2' : '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isLight
                  ? 'rgba(15,23,42,0.10)'
                  : 'rgba(255,255,255,0.10)'
                e.currentTarget.style.color = isLight
                  ? 'rgba(15,23,42,0.50)'
                  : 'rgba(226,232,240,0.70)'
              }}
            >
              <Home size={11} /> Homepage
            </Link>

            <div
              className="text-xs hidden sm:block"
              style={{
                color: isLight ? 'rgba(15,23,42,0.50)' : 'rgba(226,232,240,0.80)',
              }}
            >
              {user?.name}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}